#!/usr/bin/env node
/** Validate semver single version across all published surfaces; read-only. */
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=x=>readFileSync(path.join(root,x),'utf8');
const ver=JSON.parse(read('package.json')).version;
if(!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(ver))throw new Error('SemVer inválido: '+ver);
const plugin=JSON.parse(read('plugin.json')).version;
if(ver!==plugin)throw new Error('Version mismatch: package.json vs plugin.json');
for(const file of ['SKILL.md','skills/mavik-motion/SKILL.md']){
 if(!read(file).startsWith(`---\nname: mavik-motion\nversion: ${ver}\n`))throw new Error('Version mismatch: '+file);
}
if(!read('CHANGELOG.md').includes(`## [${ver}]`))throw new Error('CHANGELOG sem release '+ver);
if(!read('README.md').includes(`v${ver}`))throw new Error('README com versão divergente');
console.log('PASS: SemVer '+ver+' em package, plugin, skills, changelog e README');
