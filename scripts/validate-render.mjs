#!/usr/bin/env node
/** FFprobe metadata gate; human vision and audio review remain mandatory. */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
const [file,...args]=process.argv.slice(2);
function flag(name,def){let i=args.indexOf('--'+name);return i<0?def:Number(args[i+1]);}
if(!file){console.error('Uso: node scripts/validate-render.mjs filme.mp4 [--duration 60] [--width 1080] [--height 1920] [--audio 1]');process.exit(2);}
if(!existsSync(file)){console.error('Arquivo inexistente:',file);process.exit(2);}
let data;try{data=JSON.parse(execFileSync('ffprobe',['-v','quiet','-show_streams','-show_format','-of','json',file],{encoding:'utf8'}));}catch(e){console.error('ffprobe falhou:',e.message);process.exit(2);}
const video=data.streams.find(s=>s.codec_type==='video'),audio=data.streams.find(s=>s.codec_type==='audio');
const dur=Number(data.format?.duration||video?.duration);
const errors=[],warnings=[];
if(!video)errors.push('Sem stream de vídeo');
if(!Number.isFinite(dur)||dur<=0)errors.push('Duração inválida');
const expected=flag('duration',0);if(expected&&Math.abs(expected-dur)>0.25)errors.push(`Duração ${dur.toFixed(2)}s difere da esperada ${expected}s`);
const width=flag('width',0),height=flag('height',0);
if(width&&video?.width!==width)errors.push(`Largura ${video?.width} != ${width}`);
if(height&&video?.height!==height)errors.push(`Altura ${video?.height} != ${height}`);
if(flag('audio',1)&&!audio)errors.push('Sem áudio, narração ou trilha');
if(video?.codec_name!=='h264')warnings.push('Vídeo não usa H.264 (validar destino)');
if(audio&&audio.codec_name!=='aac')warnings.push('Áudio não usa AAC (validar destino)');
const result={ok:errors.length===0,file,duration:dur,width:video?.width,height:video?.height,fps:video?.r_frame_rate,video_codec:video?.codec_name,audio_codec:audio?.codec_name,errors,warnings};
console.log(JSON.stringify(result,null,2));process.exit(result.ok?0:1);
