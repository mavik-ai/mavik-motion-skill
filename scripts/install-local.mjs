#!/usr/bin/env node
/** Explicit opt-in install as symlink to the root skill; no overwrites. */
import path from 'node:path';
import os from 'node:os';
import { existsSync, mkdirSync, symlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const p=process.argv;
const targetIndex=p.indexOf('--target');
const target=targetIndex>=0?p[targetIndex+1]:null;
if(!['claude','codex'].includes(target)){
 console.error('Uso: node scripts/install-local.mjs --target claude|codex [--yes]'); process.exit(2);
}
const skillDir=target==='claude'?'.claude/skills':'.codex/skills';
const destination=path.join(os.homedir(),skillDir,'mavik-motion-skill');
console.log(`Origem: ${root}\nDestino: ${destination}`);
if(!p.includes('--yes')){console.log('PREVIEW: Nenhum arquivo foi alterado. Use --yes após autorizar a instalação.');process.exit(0);}
if(existsSync(destination)){console.error('Destino já existe. Não sobrescrevendo:',destination);process.exit(1);}
mkdirSync(path.dirname(destination),{recursive:true});
symlinkSync(root,destination,'dir');
console.log('Instalação local concluída. Reinicie seu agente se ele não detectar a skill automaticamente.');
