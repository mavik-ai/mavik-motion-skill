#!/usr/bin/env node
/** Read-only diagnostic. No network calls, installs or writes. */
import { execFileSync } from 'node:child_process';
import { existsSync, statfsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, '..');
function run(cmd, args = []) {
  try { return { ok: true, output: execFileSync(cmd, args, {encoding:'utf8',timeout:10000,stdio:['ignore','pipe','pipe']}).trim() }; }
  catch (error) { return {ok:false, error: error.code || error.message}; }
}
function firstLine(s) { return (s||'').split('\n')[0].slice(0,180); }
function binary(label, cmd, args) { const r=run(cmd,args); return {name:label,status:r.ok?'ok':'missing',detail:r.ok?firstLine(r.output):String(r.error)}; }
const ver = process.versions.node;
const nodeOk = Number(ver.split('.')[0])>=22;
const rows = [{name:'Node.js >= 22 (toolchain)',status:nodeOk?'ok':'fail',detail:ver}];
rows.push(binary('FFmpeg','ffmpeg',['-version']));
rows.push(binary('FFprobe','ffprobe',['-version']));
for(const [name,paths] of [
  ['HyperFrames CLI (alternativo)',[path.join(root,'node_modules/.bin/hyperframes'),path.join(process.cwd(),'node_modules/.bin/hyperframes')]],
  ['GSAP (dep. exemplo)',[path.join(root,'examples/demo-remotion/node_modules/gsap'),path.join(root,'node_modules/gsap')]],
  ['Three.js (dep. exemplo)',[path.join(root,'examples/demo-remotion/node_modules/three'),path.join(root,'node_modules/three')]],
  ['Playwright (QA)',[path.join(root,'node_modules/playwright'),path.join(process.cwd(),'node_modules/playwright')]],
  ['Remotion (principal)',[path.join(root,'examples/demo-remotion/node_modules/remotion'),path.join(root,'node_modules/remotion'),path.join(process.cwd(),'node_modules/remotion')]]
]) { const found=paths.find(existsSync); rows.push({name,status:found?'ok':'optional',detail:found||'Não instalado localmente; não executar npm/npx automaticamente'}); }
const chromes = ['chromium','chromium-browser','google-chrome','chrome'];
const browser = chromes.map(x=>({cmd:x,res:run(x,['--version'])})).find(x=>x.res.ok);
rows.push({name:'Navegador headless',status:browser?'ok':'optional',detail:browser?`${browser.cmd}: ${firstLine(browser.res.output)}`:'Renderer pode baixar Chrome após aprovação'});
try { const fs=statfsSync(process.cwd()); const gb=Math.round(fs.bavail*fs.bsize/1e8)/10; rows.push({name:'Espaço livre',status:gb>=2?'ok':'warn',detail:gb+' GB'}); } catch(e) { rows.push({name:'Espaço livre',status:'warn',detail:String(e)}); }
rows.push({name:'ElevenLabs API configurada',status:process.env.ELEVENLABS_API_KEY?'ok':'optional',detail:process.env.ELEVENLABS_API_KEY?'Variável presente (valor oculto)':'Chave não configurada; gera somente dry-run'});
rows.push({name:'Fish Audio API configurada',status:process.env.FISH_AUDIO_API_KEY?'ok':'optional',detail:process.env.FISH_AUDIO_API_KEY?'Variável presente (valor oculto)':'Chave não configurada; gera somente dry-run'});
const report = {skill:'mavik-motion-skill',version:'1.2.0',checked_at:new Date().toISOString(),platform:process.platform,cwd:process.cwd(),ready_to_plan:true,ready_to_render:rows.slice(0,3).every(x=>x.status==='ok')&&rows.find(x=>x.name==='Remotion (principal)').status==='ok'&&rows.find(x=>x.name==='GSAP (dep. exemplo)').status==='ok'&&rows.find(x=>x.name==='Three.js (dep. exemplo)').status==='ok',checks:rows,installation_performed:false};
if(process.argv.includes('--json')) console.log(JSON.stringify(report,null,2));
else {console.log('MAVIK Motion / Doctor (somente leitura)\n');for(const x of rows)console.log(`${x.status.padEnd(8)} ${x.name.padEnd(31)} ${x.detail}`);console.log(`\nPronto para render: ${report.ready_to_render?'SIM':'NÃO — requer componentes/validação adicionais'}`);}
