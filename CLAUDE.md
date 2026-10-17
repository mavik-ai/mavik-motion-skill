# MAVIK Motion Skill — Claude Code

Para trabalhar com animação, leia `skills/mavik-motion/SKILL.md` (a cópia instalada costuma ficar em `.claude/skills/mavik-motion-skill/`).
Primeiro execute `node scripts/doctor.mjs`, inspecione `references/` e peça aprovação de um piloto antes de renderizar o projeto inteiro.
Não instale dependências nem publique sem permissão.

## Mandatory preflight (v1.2.0)
Run `node scripts/doctor.mjs` and `node scripts/brief-check.mjs <project>/brief.json` before any storyboard, synthesis or rendering. Do not infer brand identity or CTA from model memory. Remotion is the default; GSAP and Three.js are available as optional layers. No paid calls or install without approval.
