#!/usr/bin/env python3
"""Measure the raw transparent Erdem atlas. Upper head scan bands are proxies."""
import base64,io,json,re
from pathlib import Path
from PIL import Image,ImageDraw

src=Path(__file__).resolve().parents[1]/"erdem-v57-hd-atlas.js"
m=re.search(r"data:image/avif;base64,([A-Za-z0-9+/=]+)",src.read_text())
assert m,"AVIF source not found"
im=Image.open(io.BytesIO(base64.b64decode(m.group(1)))).convert("RGBA")
assert im.size==(1040,2025),str(im.size)
rows=[];cells=[]
for i in range(18):
    x,y=(i%4)*260,(i//4)*405
    cell=im.crop((x,y,x+260,y+405))
    alpha=cell.getchannel("A")
    bbox=alpha.point(lambda z:255 if z>=100 else 0).getbbox()
    assert bbox,f"empty frame {i}"
    left,top,right,bottom=bbox
    whole_w,whole_h=right-left,bottom-top
    scan_y0=top+int(whole_h*.08)
    scan_y1=min(bottom,top+int(whole_h*.31))
    row_widths=[];band_min_x=260;band_max_x=-1
    for row_y in range(scan_y0,scan_y1):
        hits=[xx for xx in range(18,242) if alpha.getpixel((xx,row_y))>=120]
        if hits:
            width=hits[-1]-hits[0]+1
            if width>=16:row_widths.append(width)
            band_min_x=min(band_min_x,hits[0]);band_max_x=max(band_max_x,hits[-1])
    row_widths.sort()
    p70=row_widths[int((len(row_widths)-1)*.7)] if row_widths else 0
    band_w=band_max_x-band_min_x+1 if band_max_x>=band_min_x else 0
    row=dict(frame=i,motion="walk" if i<8 else "jump" if i<14 else "turn",
        body_width=whole_w,body_height=whole_h,body_top=top,body_bottom=bottom,
        upper_band_width=band_w,upper_band_p70_width=p70,upper_band_scan_height=scan_y1-scan_y0)
    rows.append(row)
    tile=Image.new("RGB",(150,254),"#d6ddde")
    small=cell.resize((144,225),Image.Resampling.LANCZOS)
    tile.paste(small,(3,24),small)
    c=ImageDraw.Draw(tile)
    c.text((4,4),f'{i:02d} {row["motion"]} H{p70} S{whole_h}',fill="#202328")
    c.rectangle((3+round(144*18/260),24+round(225*scan_y0/405),
                 3+round(144*242/260),24+round(225*scan_y1/405)),
                outline="#d8302f",width=1)
    cells.append(tile)
sheet=Image.new("RGB",(900,762),"#f0f0f0")
for i,tile in enumerate(cells):sheet.paste(tile,((i%6)*150,(i//6)*254))
print("FRAME_METRICS_BEGIN")
print(json.dumps(rows,ensure_ascii=False))
print("FRAME_METRICS_END")
q=io.BytesIO();sheet.save(q,"JPEG",quality=65,optimize=True)
print("CONTACT_JPEG_BASE64_BEGIN")
print(base64.b64encode(q.getvalue()).decode("ascii"))
print("CONTACT_JPEG_BASE64_END")
