#!/usr/bin/env node
/** Mix voice and music into AAC/M4A with sidechain ducking, only when explicitly invoked. */
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const args=process.argv.slice(2);
function arg(k){const i=args.indexOf('--'+k);return i===-1?null:args[i+1];}
const voice=arg('voice'),music=arg('music'),out=arg('out');
if(!voice||!music||!out||!out.toLowerCase().endsWith('.m4a')){
 console.error('Uso: node scripts/mix-audio.mjs --voice voice.wav --music track.mp3 --out mix.m4a');process.exit(2);
}
if(!existsSync(voice)||!existsSync(music)){
 console.error('Entrada ausente; não foi gerado áudio.');process.exit(2);
}
if(existsSync(out)&&!args.includes('--overwrite')){
 console.error('Saída já existe; use --overwrite após confirmar substituição.');process.exit(2);
}
const filter=[
 '[0:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,volume=1[voice]',
 '[1:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,volume=0.30[music]',
 '[music][voice]sidechaincompress=threshold=0.03:ratio=8:attack=12:release=350[ducked]',
 '[voice][ducked]amix=inputs=2:duration=first:dropout_transition=0,alimiter=limit=0.9[aout]'
].join(';');
const cmd=['-hide_banner','-loglevel','error',...(args.includes('--overwrite')?['-y']:['-n']),'-i',voice,'-i',music,'-filter_complex',filter,'-map','[aout]','-c:a','aac','-b:a','192k',out];
const r=spawnSync('ffmpeg',cmd,{stdio:'inherit'});
if(r.error)console.error(r.error.message);
process.exit(r.status??1);
