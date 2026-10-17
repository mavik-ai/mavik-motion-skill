# Changelog

Este projeto segue [Semantic Versioning 2.0.0](https://semver.org/lang/pt-BR/). Versões `MAJOR.MINOR.PATCH`; toda alteração distribuída requer atualização sincronizada de `package.json`, `plugin.json`, `SKILL.md` e `skills/mavik-motion/SKILL.md`, testes CI e changelog. Tags Git anotadas `vX.Y.Z` serão criadas após testes e aprovação do release.

## [Unreleased]

### Próximos passos
- Homologar render final de 8 s no Codex e um projeto narrado com trilha.

## [1.2.0] - 2026-10-17

### Adicionado
- Preflight bloqueante `scripts/brief-check.mjs`: exige identidade verificada, objetivo, público, mensagem, CTA, idioma, narração, música e formato antes de produzir.
- Documentação `references/context-first.md` e `references/brief-schema.md`; `examples/ia10x/brief.json` ilustrativo validado.
- Motor principal Remotion com demo editável de 8 s; integração determinística de easing GSAP e projeção de geometria Three.js 3D em SVG.
- Comandos `npm run brief:check`, `demo:remotion:install`, `demo:remotion:still` e `demo:remotion:render`.
- Testes para presença de GSAP/Three/Remotion e bloqueios do preflight.

### Alterado
- Seleção de motor: Remotion principal; GSAP/Three.js sob demanda; HyperFrames alternativo.
- Skill, README, doctor, guias e CI atualizados.
- Nenhuma dependência é instalada automaticamente e nenhuma chamada paga é feita pelo preflight.

### Limitações
- O demo Remotion foi inspecionado estaticamente, **ainda não homologado com render final neste ambiente**.
- A integração de voz continua exigindo testes com contas autorizadas.


### Planejado
- Teste de renderização end-to-end real em Remotion / HyperFrames nos ambientes Codex e Claude Code.
- Comparativo auditivo de vozes pt-BR com execução autorizada, alinhamento em Fish e integração de conector Higgsfield.

## [1.1.0] - 2026-10-17

### Adicionado
- `MAVIK Audio Director`: script de narração `scripts/tts.mjs` com provedores ElevenLabs Multilingual v2 e Fish Audio S2.1 Pro e interface de planejamento para Higgsfield.
- Prévia dry-run por padrão; `--execute` exigido para chamadas potencialmente pagas; salvaguarda de overwrite.
- Alinhamento temporal por caractere para ElevenLabs quando fornecido pelo provedor.
- `references/audio-providers.md` com contratos API, licenciamento e fluxo seguro de produção.
- `scripts/release-check.mjs` e testes de áudio sem chamadas reais às APIs.
- Modelo de `.env.example` e verificação read-only do ambiente para provedores.

### Alterado
- Documentação e skill principal atualizadas com pipeline ElevenLabs → Fish Audio → Higgsfield (opcional).
- Versões sincronizadas com `package.json`, plugin e cabeçalhos de skill.
- CI passa a executar a verificação de consistência de versões.

### Limitações
- Integrações não foram testadas com chaves reais, nem geraram voz paga.
- Renderização end-to-end HyperFrames e Remotion continua pendente de homologação.

## [1.0.0] - 2026-10-17

### Inicial
- Estrutura Agent Plugin; skills Codex / Claude Code; `doctor`, Beat Grid, referências, shotlists e testes automatizados.
- Exemplo de motion HyperFrames ainda não homologado em render final.
- Distribuído inicialmente como ZIP antes da primeira publicação no GitHub.
