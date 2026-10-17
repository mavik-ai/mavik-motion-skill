#!/usr/bin/env node
/** Validates minimum context; no API, installs, or writes. */
import {readFileSync, existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const sample={project:'meu-reel',brand:{file:'brand.json',confirmed:false,source_label:'Design System aprovado'},objective:'',audience:'',key_message:'',platform:'instagram-reels',format:'9:16',duration_seconds:60,style:'kinetic-editorial',reference_urls:[],voice:{mode:'ai',language:'pt-BR',provider:'elevenlabs',approved:false},music:{direction:'energetic electronic low under speech',rights:'original'},cta:{mode:'follow',text:'',destination:''},claims_verified:false};
export function checkBrief(b,baseDir=process.cwd()){
  const errors=[],warnings=[],questions=[];
  const need=(v,k,q)=>{if(typeof v!=='string'||!v.trim()){errors.push(`${k}: obrigatório`);questions.push(q);}};
  if(!b||typeof b!=='object'||Array.isArray(b))return {ready:false,errors:['brief inválido'],warnings,questions:['Envie o briefing do vídeo']};
  need(b.project,'project','Qual o nome do projeto?');
  need(b.objective,'objective','Qual é o objetivo do vídeo?');
  need(b.audience,'audience','Para quem é o vídeo?');
  need(b.key_message,'key_message','Qual a principal ideia que o público precisa entender?');
  need(b.platform,'platform','Onde o vídeo será publicado?');
  need(b.format,'format','Qual formato (ex.: 9:16)?');
  if(!Number.isFinite(b.duration_seconds)||b.duration_seconds<=0||b.duration_seconds>600){errors.push('duration_seconds: número de 1 a 600 obrigatório');questions.push('Qual a duração do vídeo?');}
  need(b.style,'style','Qual estilo de motion deseja?');
  if(!b.brand||typeof b.brand!=='object'){errors.push('brand: identidade ausente');questions.push('Qual a identidade visual ou design system?');}
  else{
    need(b.brand.file,'brand.file','Onde está o arquivo da identidade visual?');
    if(b.brand.file){
      const f=path.resolve(baseDir,b.brand.file);
      if(!f.startsWith(path.resolve(baseDir)+path.sep)){errors.push('brand.file: caminho precisa estar dentro da pasta do projeto');}
      else if(!existsSync(f))errors.push(`brand.file: não encontrado (${b.brand.file})`);
      else {
        try{const v=JSON.parse(readFileSync(f,'utf8'));
          if(!v.colors||!v.fonts?.primary||!(v.brand||v.name))errors.push('brand.file: faltam nome, paleta ou tipografia');
          else if(!Object.values(v.colors).some(c=>typeof c==='string'&&/^#[0-9a-fA-F]{6}$/.test(c)))errors.push('brand.file: cores HEX não encontradas');
        }catch {errors.push('brand.file: JSON inválido');}
      }
    }
    if(b.brand.confirmed!==true){errors.push('brand.confirmed: confirmação da fonte de identidade pendente');questions.push('Podemos usar esta identidade visual como referência oficial?');}
    need(b.brand.source_label,'brand.source_label','Qual a origem/versão do design system?');
  }
  if(!b.voice || !['ai','own','none'].includes(b.voice.mode)) {errors.push('voice.mode: ai, own ou none');questions.push('O vídeo terá narração de IA, voz enviada ou nenhuma voz?');}
  else if(b.voice.mode!=='none'){
    need(b.voice.language,'voice.language','Qual idioma/acento da narração?');
    if(b.voice.mode==='ai'&&!b.voice.provider){errors.push('voice.provider: escolha um fornecedor');questions.push('Qual serviço de voz prefere?');}
    if(b.voice.mode==='ai'&&b.voice.approved!==true){errors.push('voice.approved: autorização para síntese de voz pendente');questions.push('Você autoriza a voz sintética escolhida?');}
  }
  if(!b.music||!['original','licensed','none'].includes(b.music.rights)){errors.push('music.rights: original, licensed ou none');questions.push('Qual a origem/licença da trilha?');}
  if(b.music?.rights!=='none')need(b.music?.direction,'music.direction','Qual o ritmo/energia e volume desejado da música?');
  if(!b.cta||!['follow','visit','buy','contact','other','none'].includes(b.cta.mode)){errors.push('cta.mode: especifique follow/visit/buy/contact/other/none');questions.push('Qual ação você quer no encerramento?');}
  else if(b.cta.mode!=='none'){
    need(b.cta.text,'cta.text','Qual texto exato aparece no CTA?');
    need(b.cta.destination,'cta.destination','Para onde o CTA direciona?');
  }
  if(b.claims_verified!==true)warnings.push('Não usar números ou provas sem documentação confirmada.');
  if(!Array.isArray(b.reference_urls))warnings.push('reference_urls: opcional, preferir array de links.');
  return {ready:errors.length===0,errors,warnings,questions:[...new Set(questions)]};
}
const direct=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(direct){
 if(process.argv.includes('--template')){console.log(JSON.stringify(sample,null,2));process.exit(0);}
 const src=process.argv.find((a,i)=>i>1&&!a.startsWith('-'));
 if(!src){console.error('Uso: node scripts/brief-check.mjs projeto/brief.json | --template');process.exit(2);}
 try{const file=path.resolve(src);const b=JSON.parse(readFileSync(file,'utf8'));const result=checkBrief(b,path.dirname(file));console.log(JSON.stringify(result,null,2));process.exit(result.ready?0:2);}
 catch(e){console.error('Brief inválido: '+e.message);process.exit(2);}
}
