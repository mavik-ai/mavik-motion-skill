# MAVIK Motion Skill 🎬

> Uma habilidade open source para agentes produzirem motion graphics profissionais com **direção, roteiro, animação cinética, sincronização musical e revisão visual**.

**Status:** v1.2.0 — base funcional e distribuível. Testes unitários e validadores incluídos. O uso com engines externas e o acabamento criativo devem ser homologados no equipamento e com a licença de cada ferramenta. **Não é um SaaS** e **não promete resultados perfeitos no primeiro render**.

## O que faz

- Diagnóstico automático e **somente-leitura** do ambiente na primeira utilização.
- Biblioteca de estilos com exemplos de vídeo e critérios de direção.
- Planejamento de roteiro, shotlist e transições contínuas.
- Grade de batidas determinística a partir de BPM editorialmente confirmado.
- Extração de texto de narração e mixagem opcional por FFmpeg com ducking da trilha.
- **MAVIK Audio Director:** ElevenLabs (padrão, com timestamps), Fish Audio (alternativo) e Higgsfield (via conector autorizado). Prévia de custo/ação em dry-run sem chamadas de API.
- Compositor principal **Remotion**, GSAP para easing e coreografia determinística, Three.js para 3D/projeção quando necessário. HyperFrames é adaptador alternativo.
- Validação de shotlist e metadados da renderização; contact sheet para QA humano.
- **Gate Context First obrigatório:** `brief.json` verificado com `brief:check` antes de criar cena; identidade com fonte local confirmada, CTA exato, objetivo, público, voz e trilha. Contexto da memória não substitui briefing confirmado.
- Contexto de marca por projeto/cliente; identidade da Mavik não fica hardcoded.
- Plugin de skills para ChatGPT/Codex, com skill de onboarding; instruções para Claude Code.

## Estrutura

```text
mavik-motion-skill/
├── plugin.json                     # formato Agent Plugin
├── SKILL.md                        # skill standalone
├── skills/
│   ├── setup/SKILL.md              # onboarding / doctor
│   └── mavik-motion/SKILL.md       # direção e produção
├── references/                     # guia de estilo, som, QA e engines
├── examples/
│   ├── ia10x/                      # brand + brief + shotlist de 60 s
│   ├── demo-remotion/              # composição Remotion / GSAP / Three.js
│   └── demo-hyperframes/           # demo HTML opcional anterior
├── scripts/                        # diagnósticos, beats e validações
├── tests/                          # testes unitários
└── .github/workflows/ci.yml
```

## Uso imediato

Requer **Node.js 22 ou mais** para o nosso toolchain (e para HyperFrames, se usado). FFmpeg/FFprobe são necessários para QA e exportação. Tenha atenção às permissões de navegador/headless.

```bash
# Na pasta deste repositório, sem instalar nada:
node scripts/doctor.mjs
npm run brief:check
npm test
node scripts/validate-shotlist.mjs examples/ia10x/shotlist.json
node scripts/beat-grid.mjs --bpm 124 --duration 60 > /tmp/mavik-beats.json
node scripts/narration-text.mjs examples/ia10x/shotlist.json  # revisar antes de gerar voz
```

> A primeira execução do agente chama `doctor`. O script NÃO executa npm install, downloads nem mutações; a instalação de dependências é uma ação posterior sujeita à autorização do operador.

### Testar o motor principal: Remotion + GSAP + Three.js

**Somente depois de aprovar a instalação de dependências:**

```bash
cd examples/demo-remotion
npm install
npm run still
npm run render
cd ../..
node scripts/validate-render.mjs examples/demo-remotion/out/demo.mp4 --duration 8 --width 1080 --height 1920 --audio 0
```

O demo usa GSAP determinístico e geometria 3D matemática Three.js projetada em SVG para garantir compatibilidade sem GPU. Isso não substitui um pipeline completo de WebGL. Até executar e validar o MP4, status = **não homologado**.

### Testar uma composição HyperFrames (alternativa)

**Somente após autorizar a instalação das dependências:**

```bash
# Consulte as versões e políticas no projeto HyperFrames antes de instalar:
npm install --save-dev hyperframes gsap
npx --no-install hyperframes doctor
npx --no-install hyperframes lint examples/demo-hyperframes
npx --no-install hyperframes check examples/demo-hyperframes
npx --no-install hyperframes render examples/demo-hyperframes --output examples/demo-hyperframes/out/demo.mp4
node scripts/validate-render.mjs examples/demo-hyperframes/out/demo.mp4 --duration 8 --width 1080 --height 1920 --audio 0
```

O template usa GSAP via CDN. Para ambientes offline, substitua a tag externa por um bundle local **com a licença correspondente**. Sua reprodução depende do renderer e das versões efetivamente instaladas. Os comandos de HyperFrames podem variar; use `npx hyperframes <command> --help` como fonte primária.

### Instalação no Claude Code

Pode clonar o repositório e disponibilizar a **pasta inteira** como uma skill, pois o `SKILL.md` da raiz referencia as demais pastas:

```bash
mkdir -p ~/.claude/skills
ln -s "$(pwd)" ~/.claude/skills/mavik-motion-skill
```

No projeto, alternativamente, use `.claude/skills/mavik-motion-skill` apontando para a raiz deste repositório. O cliente deve ser reiniciado quando necessário.

### Instalação no Codex

O repositório é empacotado como plugin conforme o manifesto `plugin.json`, com `skills/` na raiz. Após publicação, use o mecanismo de plugins do seu ambiente Codex para instalar pelo repositório ou diretório. Para execução local por skill, disponibilize o diretório que contém `SKILL.md` no diretório de skills configurado para sua instalação Codex.

### ChatGPT

O mesmo `plugin.json` permite empacotar a skill no padrão de Agent Plugins. **Instalar no ChatGPT não concede, por si só, acesso a um processo local, navegador ou FFmpeg**. Para renderização, o ambiente precisa expor essas ferramentas por uma execução permitida ou conector. A publicação em um repositório GitHub não equivale à publicação em uma loja de plugins.

## Código e propriedade intelectual

O **código original desta distribuição** é MIT (consulte `LICENSE`). O material de terceiros contido nos links e o uso das marcas citadas **não** são licenciados por este repositório. O `motion-reel-kit.zip` avaliado anteriormente **não** foi copiado para este código porque sua licença geral não foi confirmada. Os padrões de QA e beat sync foram implementados do zero.

## Versionamento e releases

A versão atual é **v1.2.0**. Atualize `CHANGELOG.md`, `package.json`, `plugin.json` e os dois `SKILL.md` juntos. Execute `npm run release:check` e `npm test` antes de qualquer commit e tag. Confira [CHANGELOG.md](CHANGELOG.md) para histórico e limitações. Publicações GitHub exigem revisão e aprovação; nenhum script faz push automaticamente.

## Audio Director

```bash
# Prévia: sem rede e sem cobranças
node scripts/tts.mjs --provider elevenlabs --voice-id SUA_VOZ --text-file roteiro.txt --out narracao.mp3
node scripts/tts.mjs --provider fish --voice-id SUA_VOZ --text-file roteiro.txt --out narracao.mp3
# Após orçamento aprovado, configurar API key em segredo do ambiente e adicionar --execute
```

Consulte `references/audio-providers.md` para configuração, segurança, alinhamento e limitações.

## Roadmap

1. Homologar render real em macOS e Linux com HyperFrames instalado.
2. Adicionar teste end-to-end de 8 segundos com áudio e contact sheet revisados.
3. Homologar o adaptador Remotion + GSAP + Three.js com smoke render em CI manual.
4. Ampliar biblioteca de referências com metadados e snapshots autorizados.
5. Adicionar templates por formato e testes de legibilidade/safe areas automatizados.

## Contribuições

Issues e PRs são bem-vindos após a publicação. Não inclua vídeos ou músicas de terceiros sem licença explícita e não envie chaves de API ou credenciais.

### Instalador local opcional (não automático)

```bash
node scripts/install-local.mjs --target claude          # apenas preview
node scripts/install-local.mjs --target codex           # apenas preview
node scripts/install-local.mjs --target claude --yes    # cria symlink, depois de autorizar
```

Os destinos de skill local podem variar conforme o host e a configuração. A distribuição por `plugin.json` é o fluxo preferencial para novos clientes Codex/ChatGPT compatíveis.
