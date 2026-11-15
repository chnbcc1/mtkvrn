#!/usr/bin/env python3
"""Rebuild the source Erdem atlas once (not per-frame runtime scaling).

v83: normalize head silhouette width across all 18 authored 3D sprite poses;
for standing/walking/turning poses normalize total silhouette height too.
Keep crouching poses naturally crouched, boots anchored, every cell 260x405.
"""
from __future__ import annotations
import base64, io, json, re
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "erdem-v57-hd-atlas.js"
OUTPUT = ROOT / "erdem-v83-hd-atlas.js"
METRICS = ROOT / "assets" / "erdem-v83-atlas-metrics.json"
PREVIEW = ROOT / "assets" / "erdem-v83-atlas-preview.webp"
W,H,FOOT = 260,405,394
TARGET_HEAD = 123
TARGET_STANDING_HEIGHT = 360
BASELINE = [124,124,123,123,124,123,123,124,118,110,110,108,118,129,120,113,107,117]
raw = SOURCE.read_text(encoding="utf8")
match = re.search(r"data:image/avif;base64,([A-Za-z0-9+/=]+)",raw)
if not match:
    raise RuntimeError("Missing original AVIF atlas")
image = Image.open(io.BytesIO(base64.b64decode(match.group(1)))).convert("RGBA")
if image.size != (1040,2025):
    raise RuntimeError(f"Unexpected atlas size {image.size}")
def measure(frame:Image.Image):
    a=np.asarray(frame.getchannel("A"))
    ys,xs=np.where(a>=100)
    if len(ys)==0:
        return dict(head=0,body_height=0,top=405,bottom=0,body_width=0)
    top,bottom=int(ys.min()),int(ys.max())
    left,right=int(xs.min()),int(xs.max())
    bh=bottom-top+1
    y0=max(0,top+int(bh*.08))
    y1=min(H,top+int(bh*.31))
    widths=[]
    for y in range(y0,y1):
        xx=np.where(a[y,18:242]>=120)[0]
        if len(xx) and xx[-1]-xx[0]+1>=16:
            widths.append(int(xx[-1]-xx[0]+1))
    widths.sort()
    head=widths[int((len(widths)-1)*.70)] if widths else 0
    return dict(head=head,body_height=bh,top=top,bottom=bottom,body_width=right-left+1)
def uniform(frame:Image.Image, scale:float):
    inv=1/scale
    return frame.transform((W,H),Image.Transform.AFFINE,
        (inv,0,130*(1-inv),0,inv,FOOT*(1-inv)),
        resample=Image.Resampling.BICUBIC,fillcolor=(0,0,0,0))
def preserve_head_and_adjust_legs(frame:Image.Image):
    # Above the shoulder: TRANSLATE only. Hair, eyes, nose keep their shape.
    # Shoulder-to-sole: gentle linear vertical mapping to restore standing
    # height without stretching or squeezing the face.
    top=measure(frame)["top"]
    delta=FOOT-TARGET_STANDING_HEIGHT-top
    if abs(delta)<.5:
        return frame
    shoulder=166
    shoulder_out=shoulder+delta
    y=np.arange(H,dtype=np.float32)
    denom=1-delta/(FOOT-shoulder)
    ysrc=np.where(y<=shoulder_out,y-delta,
        (y-delta*FOOT/(FOOT-shoulder))/denom)
    valid=(ysrc>=0)&(ysrc<H-1)
    y0=np.clip(np.floor(ysrc).astype(int),0,H-1)
    y1=np.clip(y0+1,0,H-1)
    blend=(ysrc-y0)[:,None,None].astype(np.float32)
    arr=np.asarray(frame).astype(np.float32)
    dest=arr[y0]*(1-blend)+arr[y1]*blend
    dest[~valid,:,:]=0
    return Image.fromarray(np.clip(dest,0,255).astype(np.uint8),"RGBA")
original=[];corrected=[];entries=[]
for i in range(18):
    x,y=(i%4)*W,(i//4)*H
    src=image.crop((x,y,x+W,y+H))
    before=measure(src)
    if abs(before["head"]-BASELINE[i])>3:
        raise RuntimeError(f"Source drift at frame {i}: {before['head']} vs {BASELINE[i]}")
    s=TARGET_HEAD/max(1,before["head"])
    standing = i<8 or i>=14
    # Iterate against the actual head silhouette after remapping.
    for iteration in range(5):
        candidate=uniform(src,s)
        if standing:
            candidate=preserve_head_and_adjust_legs(candidate)
        info=measure(candidate)
        if abs(info["head"]-TARGET_HEAD)<=1: break
        s *= max(.96,min(1.04,TARGET_HEAD/max(1,info["head"])))
    result=measure(candidate)
    if abs(result["head"]-TARGET_HEAD)>3:
        raise RuntimeError(f"Head size mismatch frame {i}: {result['head']}")
    if standing and abs(result["body_height"]-TARGET_STANDING_HEIGHT)>5:
        raise RuntimeError(f"Standing body height mismatch frame {i}: {result['body_height']}")
    original.append(src);corrected.append(candidate)
    entries.append(dict(frame=i,state="walk" if i<8 else "jump" if i<14 else "turn",
        before=before,after=result,uniform_scale=round(s,5)))
new=Image.new("RGBA",image.size,(0,0,0,0))
for i,frame in enumerate(corrected):
    new.paste(frame,((i%4)*W,(i//4)*H))
mem=io.BytesIO()
new.save(mem,format="AVIF",quality=92,speed=6)
reloaded=Image.open(io.BytesIO(mem.getvalue())).convert("RGBA")
for i,e in enumerate(entries):
    f=reloaded.crop(((i%4)*W,(i//4)*H,((i%4)+1)*W,((i//4)+1)*H))
    e["encoded"]=measure(f)
    if abs(e["encoded"]["head"]-TARGET_HEAD)>4:
        raise RuntimeError(f"Encoded head drift at frame {i}: {e['encoded']['head']}")
    if i<8 or i>=14:
        if abs(e["encoded"]["body_height"]-TARGET_STANDING_HEIGHT)>6:
            raise RuntimeError(f"Encoded standing drift frame {i}")
OUTPUT.write_text("window.ERDEM_V83_HD_ATLAS='data:image/avif;base64,"+
    base64.b64encode(mem.getvalue()).decode("ascii")+"';\n",encoding="utf8")
METRICS.parent.mkdir(exist_ok=True,parents=True)
METRICS.write_text(json.dumps({"source":"v57","target_head_band_px":TARGET_HEAD,
    "target_standing_height_px":TARGET_STANDING_HEIGHT,"frames":entries},
    ensure_ascii=False,indent=2)+"\n",encoding="utf8")
preview=Image.new("RGB",(1200,1104),"#e1e6e4")
pen=ImageDraw.Draw(preview)
for i,frame in enumerate(corrected):
    px=(i%6)*200
    py=(i//6)*368
    small=frame.resize((200,312),Image.Resampling.LANCZOS)
    preview.paste(small,(px,py+28),small)
    old=entries[i]["before"]["head"]
    newh=entries[i]["encoded"]["head"]
    pen.text((px+6,py+6),f'{i:02d} {entries[i]["state"]} HEAD {old}->{newh}',fill="#1b2628")
preview.save(PREVIEW,format="WEBP",quality=90,method=5)
print("SUCCESS: source atlas normalized; per-frame pixel metrics validated")
for row in entries:
    print(f'{row["frame"]:02d} {row["state"]:4s}: head {row["before"]["head"]:3d} -> {row["encoded"]["head"]:3d} px; '
          f'body {row["before"]["body_height"]:3d} -> {row["encoded"]["body_height"]:3d} px; '
          f'scale {row["uniform_scale"]:.4f}')
print(f'OUTPUT: {OUTPUT.name} {OUTPUT.stat().st_size} bytes; preview {PREVIEW.name}')
