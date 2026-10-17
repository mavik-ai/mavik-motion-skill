#!/usr/bin/env node
/** Extract a plain voiceover script; never submit to a paid TTS automatically. */
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
const [file,out]=process.argv.slice(2);
if(!file){console.error('Uso: node scripts/narration-text.mjs shotlist.json [texto.txt]');process.exit(2);}
let x;try{x=JSON.parse(readFileSync(file,'utf8'));}catch(e){console.error(e.message);process.exit(2);}
if(!Array.isArray(x.shots)){console.error('Shotlist sem cenas');process.exit(2);}
const script=x.shots.map(s=>(s.voiceover||'').trim()).filter(Boolean).join('\n\n')+'\n';
if(out){if(existsSync(out)){console.error('Saída já existe, não sobrescrevendo:',out);process.exit(2);}writeFileSync(out,script,'utf8');console.log(`Roteiro exportado: ${out}`);} else process.stdout.write(script);
