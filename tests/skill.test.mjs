import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {makeGrid} from '../scripts/beat-grid.mjs';
import {validateShotlist} from '../scripts/validate-shotlist.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
function file(name){return readFileSync(path.join(root,name),'utf8');}
test('manifest e skills instaláveis existem',()=>{
 const p=JSON.parse(file('plugin.json'));assert.equal(p.name,'mavik-motion-skill');assert.ok(file('skills/mavik-motion/SKILL.md').startsWith('---\nname: mavik-motion'));
 assert.ok(existsSync(path.join(root,'skills/setup/SKILL.md')));
});
test('grade de batidas é determinística',()=>{
 const a=makeGrid({bpm:120,duration:10});assert.deepEqual(a,makeGrid({bpm:120,duration:10}));
 assert.equal(a.beats[0].time,0);assert.equal(a.beats[1].time,0.5);assert.ok(a.beats.some(x=>x.strong));
});
test('shotlist IA10X cobre o vídeo sem lacunas/erros',()=>{
 const d=JSON.parse(file('examples/ia10x/shotlist.json'));
 const r=validateShotlist(d);assert.deepEqual(r.errors,[]);assert.deepEqual(r.warnings,[]);
});
test('storyboard com sobreposição deve falhar',()=>{
 const r=validateShotlist({duration:4,shots:[{start:0,end:3,title:'A',voiceover:'a',visual:'b',transition:'c'},{start:2,end:4,title:'B',voiceover:'a',visual:'b',transition:'c'}]});
 assert.ok(r.errors.some(x=>x.includes('sobreposição')));
});
test('demo HTML declara canvas e timeline paused',()=>{
 const h=file('examples/demo-hyperframes/index.html');assert.match(h,/data-composition-id="mavik-demo"/);assert.match(h,/data-width="1080"/);assert.match(h,/paused: true/);assert.match(h,/window\.__timelines\["mavik-demo"\]/);
});

import {prepareSpeech,executeSpeech} from '../scripts/tts.mjs';
test('audio: configuração de provedores e dry-run',()=>{
 const a=prepareSpeech({provider:'elevenlabs',text:'Olá, esta é uma narração de teste.',voiceId:'voz-licenciada'});
 assert.equal(a.timestamps,'characters');assert.match(a.url,/with-timestamps$/);assert.equal(a.body.model_id,'eleven_multilingual_v2');
 const b=prepareSpeech({provider:'fish',text:'Teste de português brasileiro.',voiceId:'voz-autorizada'});
 assert.equal(b.body.reference_id,'voz-autorizada');assert.equal(b.model,'s2.1-pro');
 const c=prepareSpeech({provider:'higgsfield',text:'Teste',voiceId:'preset'});
 assert.equal(c.method,'connector');
 assert.throws(()=>prepareSpeech({provider:'fish',text:'',voiceId:'x'}));
});
test('audio: ElevenLabs retorna áudio e timestamps no mock, sem rede real',async()=>{
 const p=prepareSpeech({text:'Olá',voiceId:'voice-id'});
 const res=await executeSpeech(p,{apiKey:'mock-key',fetchImpl:async()=>({ok:true,json:async()=>({audio_base64:Buffer.from('mp3test').toString('base64'),alignment:{characters:['O'],character_start_times_seconds:[0],character_end_times_seconds:[0.3]}})})});
 assert.equal(res.audio.toString(),'mp3test');assert.equal(res.alignment.character_end_times_seconds[0],.3);
});
test('audio: Fish recebe áudio binário no mock, sem rede real',async()=>{
 const p=prepareSpeech({provider:'fish',text:'Olá',voiceId:'voice-id'});
 const res=await executeSpeech(p,{apiKey:'mock-key',fetchImpl:async()=>({ok:true,arrayBuffer:async()=>new Uint8Array([1,2,3]).buffer})});
 assert.equal(res.audio.length,3);assert.equal(res.alignment,null);
});
test('release: versões iguais em package, plugin, skill e changelog',()=>{
 const ver=JSON.parse(file('package.json')).version;
 assert.equal(JSON.parse(file('plugin.json')).version,ver);
 assert.ok(file('CHANGELOG.md').includes(`## [${ver}]`));
 assert.ok(file('SKILL.md').includes(`version: ${ver}`));
});

import {checkBrief} from '../scripts/brief-check.mjs';
test('context first: exemplo IA10X está válido e confirmado',()=>{
 const b=JSON.parse(file('examples/ia10x/brief.json'));
 const r=checkBrief(b,path.join(root,'examples/ia10x'));
 assert.deepEqual(r.errors,[]);assert.equal(r.ready,true);
});
test('context first: branding não confirmado bloqueia',()=>{
 const b=JSON.parse(file('examples/ia10x/brief.json'));b.brand.confirmed=false;
 const r=checkBrief(b,path.join(root,'examples/ia10x'));
 assert.equal(r.ready,false);assert.ok(r.errors.some(e=>e.includes('brand.confirmed')));
});
test('context first: CTA ausente bloqueia sem inventar texto',()=>{
 const b=JSON.parse(file('examples/ia10x/brief.json'));b.cta.text='';
 const r=checkBrief(b,path.join(root,'examples/ia10x'));
 assert.equal(r.ready,false);assert.ok(r.errors.some(e=>e.includes('cta.text')));
});
test('context first: direitos da trilha e voz sem autorização bloqueiam',()=>{
 const b=JSON.parse(file('examples/ia10x/brief.json'));b.music.rights='unknown';b.voice.approved=false;
 const r=checkBrief(b,path.join(root,'examples/ia10x'));
 assert.equal(r.ready,false);assert.ok(r.errors.some(e=>e.includes('music.rights')));assert.ok(r.errors.some(e=>e.includes('voice.approved')));
});
test('context first: brand.json malicioso/fora da pasta bloqueia',()=>{
 const b=JSON.parse(file('examples/ia10x/brief.json'));b.brand.file='../../LICENSE';
 const r=checkBrief(b,path.join(root,'examples/ia10x'));assert.equal(r.ready,false);
});
test('demo de Remotion usa GSAP, Three.js e frames determinísticos',()=>{
 const p=JSON.parse(file('examples/demo-remotion/package.json'));
 for(const n of ['remotion','gsap','three'])assert.ok(p.dependencies[n]);
 const src=file('examples/demo-remotion/src/index.tsx');
 const three=file('examples/demo-remotion/src/three-geometry.tsx');
 assert.match(src,/useCurrentFrame/);assert.match(src,/gsap\.parseEase/);assert.match(src,/GeometryIcon/);
 assert.match(three,/THREE\.PerspectiveCamera/);assert.match(three,/THREE\.IcosahedronGeometry/);
 assert.doesNotMatch(src,/setTimeout\(|Date\.now\(|\.play\(\)/);
});
