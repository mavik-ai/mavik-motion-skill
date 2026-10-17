#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
export function validateShotlist(x) {
 const errors=[], warnings=[];
 if(typeof x!=='object'||x===null)return {errors:['JSON raiz inválido'],warnings:[]};
 if(!Number.isFinite(x.duration)||x.duration<=0||x.duration>600)errors.push('duration deve ser 0–600 segundos');
 if(!Array.isArray(x.shots)||x.shots.length<1)errors.push('shots deve conter pelo menos uma cena');
 else {
  let previous=0;
  x.shots.forEach((s,i)=>{
   const prefix=`shots[${i}]`;
   if(!Number.isFinite(s.start)||!Number.isFinite(s.end)||s.end<=s.start)errors.push(`${prefix}: intervalo inválido`);
   else { if(s.start<previous-0.0001)errors.push(`${prefix}: sobreposição fora de ordem`); if(s.start>previous+0.05)warnings.push(`${prefix}: lacuna entre cenas (${(s.start-previous).toFixed(2)}s)`); previous=s.end; if(s.end>x.duration+0.001)errors.push(`${prefix}: ultrapassa duration`); }
   for(const key of ['title','voiceover','visual','transition'])if(typeof s[key]!=='string'||!s[key].trim())errors.push(`${prefix}: ${key} obrigatório`);
   if((s.title||'').length>65)warnings.push(`${prefix}: título longo para mobile`);
  });
  if(Number.isFinite(x.duration)&&Math.abs(previous-x.duration)>0.05)errors.push(`Última cena acaba em ${previous}s, vídeo declarado com ${x.duration}s`);
 }
 if(x.fps && ![24,25,30,50,60].includes(x.fps)) warnings.push('FPS incomum, validar plataforma');
 if(x.aspect_ratio && !/^\d+:\d+$/.test(x.aspect_ratio))errors.push('aspect_ratio inválido');
 if(!x.cta)warnings.push('CTA ausente no metadata');
 return {errors,warnings};
}
if(import.meta.url === `file://${process.argv[1]}`){
 const p=process.argv[2];if(!p){console.error('Uso: node scripts/validate-shotlist.mjs caminho.json');process.exit(2);}
 try {const data=JSON.parse(readFileSync(resolve(p),'utf8'));const {errors,warnings}=validateShotlist(data);warnings.forEach(x=>console.warn('WARN',x)); errors.forEach(x=>console.error('ERROR',x)); console.log(`${errors.length?'FALHOU':'OK'} | ${data.shots?.length||0} cenas | ${data.duration||'?'} segundos`);process.exit(errors.length?1:0);}catch(e){console.error(e.message);process.exit(2);}
}
