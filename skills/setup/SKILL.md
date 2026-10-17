---
name: mavik-motion-setup
description: Prepare e valide o ambiente da MAVIK Motion Skill; execute o diagnóstico antes do primeiro projeto de motion graphics.
---

# Configurar MAVIK Motion Skill

1. Localize a raiz do pacote que contém `scripts/doctor.mjs`.
2. Execute `node scripts/doctor.mjs` (somente diagnóstico; não instala nada).
3. Informe Node.js, FFmpeg/FFprobe, navegador, HyperFrames e adaptadores disponíveis.
4. Se houver falhas, explique quais dependências instalar e solicite autorização antes de alterar o computador.
5. Após a instalação autorizada, execute o diagnóstico novamente.
6. Se houver HyperFrames local, use `npx --no-install hyperframes doctor` e teste o exemplo.
7. Não declare ambiente pronto sem executar testes funcionais, distinguindo verificações documentais de render efetivo.

Leia também `../../references/environment-and-installation.md`.
