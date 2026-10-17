#!/usr/bin/env node
/** MAVIK Audio Director: one dry-run-first interface to premium TTS providers.
 * No charge, network call or output write without --execute.
 * Live providers use the documented REST API; Higgsfield runs through a separate authorized connector.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const SUPPORTED_PROVIDERS = ['elevenlabs','fish','higgsfield'];
export function prepareSpeech({provider='elevenlabs', text, voiceId, model}={}) {
 if (!SUPPORTED_PROVIDERS.includes(provider)) throw new Error('Provedor inválido: '+provider);
 if(typeof text!=='string'||!text.trim())throw new Error('Texto vazio');
 if(Buffer.byteLength(text,'utf8')>50000)throw new Error('Texto excede o limite de segurança de 50 KB');
 if(typeof voiceId!=='string'||!voiceId.trim())throw new Error('Informe --voice-id da voz autorizada');
 if(provider==='elevenlabs'){
  return {provider, model:model||'eleven_multilingual_v2',method:'POST',url:`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}/with-timestamps`,body:{text,model_id:model||'eleven_multilingual_v2'},audioFormat:'mp3',timestamps:'characters',keyEnv:'ELEVENLABS_API_KEY'};
 }
 if(provider==='fish'){
  return {provider,model:model||'s2.1-pro',method:'POST',url:'https://api.fish.audio/v1/tts',body:{text,reference_id:voiceId,format:'mp3'},audioFormat:'mp3',timestamps:'unavailable_in_this_adapter',keyEnv:'FISH_AUDIO_API_KEY'};
 }
 return {provider,model:'higgsfield_connector',method:'connector',url:null,body:{text,voice_id:voiceId},audioFormat:'provider_defined',timestamps:'provider_defined',keyEnv:null};
}
export async function executeSpeech(plan,{apiKey,fetchImpl=fetch}={}) {
 if(plan.provider==='higgsfield')throw new Error('Higgsfield exige conector autorizado: esta CLI não envia áudio automaticamente.');
 if(!apiKey)throw new Error('Chave de API não configurada para '+plan.provider);
 const headers=plan.provider==='elevenlabs'?{'xi-api-key':apiKey,'content-type':'application/json'}:{'Authorization':`Bearer ${apiKey}`,'content-type':'application/json','model':plan.model};
 const res=await fetchImpl(plan.url,{method:'POST',headers,body:JSON.stringify(plan.body),signal:AbortSignal.timeout(120000)});
 if(!res.ok)throw new Error(`Provedor ${plan.provider} retornou HTTP ${res.status} (não imprimir corpo por segurança)`);
 if(plan.provider==='fish'){
  const data=Buffer.from(await res.arrayBuffer());
  if(!data.length)throw new Error('Resposta de áudio vazia');
  return {audio:data,alignment:null};
 }
 const result=await res.json();
 if(!result.audio_base64)throw new Error('Resposta ElevenLabs sem audio_base64');
 const audio=Buffer.from(result.audio_base64,'base64');
 if(!audio.length)throw new Error('Resposta de áudio vazia');
 return {audio,alignment:result.normalized_alignment||result.alignment||null};
}
function arg(args,key){const i=args.indexOf('--'+key);return i<0?null:args[i+1]}
async function main(){
 const args=process.argv.slice(2);
 if(args.includes('--help')||!args.length){console.log('Uso: node scripts/tts.mjs --provider elevenlabs|fish|higgsfield --text-file roteiro.txt --voice-id ID --out voz.mp3 [--execute] [--overwrite] [--model ID]');return;}
 const txtFile=arg(args,'text-file'),out=arg(args,'out');
 if(!txtFile||!out||!out.toLowerCase().endsWith('.mp3'))throw new Error('Forneça --text-file e --out finalizando em .mp3');
 const text=readFileSync(txtFile,'utf8');
 const p=prepareSpeech({provider:arg(args,'provider')||'elevenlabs',text,voiceId:arg(args,'voice-id'),model:arg(args,'model')});
 if(!args.includes('--execute')){console.log(JSON.stringify({status:'dry-run',provider:p.provider,model:p.model,bytes:Buffer.byteLength(text,'utf8'),voiceIdProvided:true,timestamps:p.timestamps,apiKeyNeeded:p.keyEnv,estimatedCredits:'not_quoted',charged:false,output:out},null,2));return;}
 if(p.provider==='higgsfield')throw new Error('Use o conector Higgsfield após aprovação do orçamento; não há endpoint REST genérico configurado.');
 if(existsSync(out)&&!args.includes('--overwrite'))throw new Error('Saída existente: passe --overwrite para substituir');
 const alignmentFile=out.replace(/\.mp3$/i,'.alignment.json');
 if(p.provider==='elevenlabs'&&existsSync(alignmentFile)&&!args.includes('--overwrite'))throw new Error('Alignment existente: passe --overwrite para substituir');
 const result=await executeSpeech(p,{apiKey:process.env[p.keyEnv]});
 mkdirSync(dirname(resolve(out)),{recursive:true});
 writeFileSync(out,result.audio);
 if(result.alignment)writeFileSync(alignmentFile,JSON.stringify(result.alignment,null,2)+'\n');
 console.log(JSON.stringify({status:'created',provider:p.provider,out,hasAlignment:!!result.alignment,bytes:result.audio.length},null,2));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main().catch(e=>{console.error('MAVIK TTS:',e.message);process.exitCode=2});
