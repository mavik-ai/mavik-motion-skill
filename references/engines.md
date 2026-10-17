# Engines — decisões de tecnologia (v1.2.0)

## 1. Remotion — compositor e renderer principal

Use para Reels narrados, séries, vídeos por cena, tipografia em português, duração precisa, trilha/voz sincronizada, render reproduzível.

- `useCurrentFrame`, `useVideoConfig`, `spring`, `interpolate`, `<Sequence>`, `<Audio>`.
- Timeline calculada por frame; nunca `Date.now`, timers, `Math.random` sem seed, elementos que dependem de hover/scroll ou GSAP `.play()` real-time.
- Demo local: `examples/demo-remotion`. Dependências próprias e versões fixadas; não instala quando executa `doctor`.
- Com aprovação do usuário: `cd examples/demo-remotion && npm install && npm run still && npm run render`.
- Conferir licenciamento conforme equipe/uso comercial: https://www.remotion.dev/license .

## 2. GSAP — easing/coreografia, não outro renderer

- `gsap.parseEase()` como easing puro por frame em Remotion — padrão seguro.
- Timelines do GSAP só são aceitas se **paused** e com `seek(time)`/aplicação determinística, sem efeitos globais/realtime.
- GSAP não substitui Remotion; a biblioteca é uma ferramenta de animação.
- Documentação: https://gsap.com/docs/v3/.

## 3. Three.js — geometria e profundidade opcionais

- Formas simples: Three `Geometry`, `Matrix4`, `PerspectiveCamera`, `Vector3.project()` e vetores SVG, sem GPU; demo implementado.
- Cena 3D avançada com WebGL pode usar integração adequada no Remotion quando houver necessidade, dependências e suporte de renderização. Não ativar 3D por decoração.
- Evite expressões dependentes de clock/GPU instável; testar renderer antes da entrega.
- Referência: https://threejs.org/docs/ .

## 4. HyperFrames — adaptador alternativo HTML/GSAP

- Usar somente quando vantagem para um briefing específico; não carregar duas engines obrigatórias.
- Node >=22, FFmpeg, Chromium, `window.__timelines[id]` com timeline pausada conforme documentação da versão instalada.
- Demo anterior preservado em `examples/demo-hyperframes/`; **ainda não homologado end-to-end**.
- Docs: https://hyperframes.app/docs/5-packages/cli .

## 5. QA / FFmpeg / Playwright

- Playwright para screenshots/legibilidade/layout antes do render quando houver UI web, não como editor.
- FFprobe valida codec, fps, duração e streams; FFmpeg para mix, loudness e contact sheet.
- `scripts/doctor.mjs` apenas lê: acusa disponibilidade de dependências sem instalar nada.

## Seleção automática

Se o briefing não exigir um motor específico: **Remotion**. Adicione GSAP para curvas ou sequências de animação precisas, Three.js só para cenas com profundidade/objetos, HyperFrames sob solicitação ou decisão justificada. Higgsfield generativo é opcional e exige orçamento/consentimento.
