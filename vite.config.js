import { defineConfig } from 'vite';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
const run=promisify(execFile), cwd=fileURLToPath(new URL('.',import.meta.url));
const git=async (...args)=>(await run('git',args,{cwd,timeout:90000,maxBuffer:1024*1024,windowsHide:true,env:{...process.env,GIT_TERMINAL_PROMPT:'0'}})).stdout.trim();
let busy=false;
export default defineConfig({plugins:[{name:'mtk-local-version',configureServer(server){
server.middlewares.use('/__studio_version',async(req,res)=>{
res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');
const send=(status,obj)=>{res.statusCode=status;res.end(JSON.stringify(obj))};
const host=req.headers.host, remote=req.socket.remoteAddress;
const allowedHost=['localhost:5173','127.0.0.1:5173','[::1]:5173'].includes(host);
const local=['127.0.0.1','::1','::ffff:127.0.0.1'].includes(remote);
const origin=req.headers.origin;
if(!local||!allowedHost||(origin&&origin!=='http://'+host)||req.headers['sec-fetch-site']==='cross-site')return send(403,{error:'Sürüm merkezi yalnızca bilgisayarın kendisinden açılabilir.'});
const action=(req.url||'').split('?')[0];
if(req.method!=='POST'||req.headers['x-mtk-studio']!=='1'||!['/check','/update','/status'].includes(action))return send(405,{error:'Geçersiz işlem'});
if(busy)return send(409,{error:'Başka bir sürüm işlemi sürüyor.'});
busy=true;try{
const branch=await git('branch','--show-current');
if(branch!=='phaser-test')throw Error('Yalnızca phaser-test dalında çalışır.');
const remoteUrl=await git('remote','get-url','origin');
if(!['https://github.com/chnbcc1/mtkvrn.git','https://github.com/chnbcc1/mtkvrn'].includes(remoteUrl))throw Error('Beklenmeyen GitHub deposu.');
if(action!=='/status')await git('fetch','origin','phaser-test');
if(action==='/update'){
if(await git('status','--porcelain','--untracked-files=no'))throw Error('Yerel izlenen dosyalarda değişiklik var. Önce VS Code ile inceleyin; hiçbir dosya silinmedi.');
await git('merge','--ff-only','origin/phaser-test');
}
const localSha=await git('rev-parse','--short','HEAD'),remoteSha=await git('rev-parse','--short','origin/phaser-test'),history=await git('log','-8','--format=%h %s');
send(200,{branch,localSha,remoteSha,history,current:localSha===remoteSha});
}catch(e){send(400,{error:String(e.message).slice(0,1200)})}finally{busy=false}
});}}]});
