# MAVIK Motion Skill — Instruções para agentes de código

Se a tarefa envolver criação ou edição de motion graphics, leia `skills/mavik-motion/SKILL.md`.
Antes de qualquer renderização ou instalação, rode o diagnóstico em modo somente-leitura:

```sh
node scripts/doctor.mjs
```

A instalação de dependências, escrita fora da pasta de trabalho, uso de APIs pagas, publicação e sobrescrita de arquivos exigem confirmação do usuário. Nunca presuma que um MP4 foi renderizado.

## Mandatory preflight (v1.2.0)
Run `node scripts/doctor.mjs` and `node scripts/brief-check.mjs <project>/brief.json` before any storyboard, synthesis or rendering. Do not infer brand identity or CTA from model memory. Remotion is the default; GSAP and Three.js are available as optional layers. No paid calls or install without approval.
