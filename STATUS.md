# Estado de verificação — MAVIK Motion Skill v1.2.0

## Validado neste ambiente
- Estrutura Agent Plugin/skill e manifestos com versão consistente.
- Testes unitários de brief, beat grid, shotlist, áudio simulado e regras de integração.
- `scripts/brief-check.mjs` bloqueia briefing sem fonte confirmada, CTA ou voz aprovada.
- CLI `doctor` é somente leitura e não instala nada.
- Modelo Remotion com uso explícito de GSAP e Three.js incluído e auditado estaticamente.

## Ainda requer homologação
- **Render end-to-end** do exemplo Remotion + GSAP + Three.js com dependências instaladas.
- Instalação e invocação da skill em um Codex ou Claude Code autorizado.
- Voz ElevenLabs/Fish/Higgsfield com credenciais reais e custos aprovados.
- HyperFrames antigo continua como motor alternativo, ainda sem render final homologado.

Atenção: CI de unit tests não substitui smoke render real. Publicação no GitHub e tag são separadas, registrar SHA apenas após confirmação.
