# Demo Remotion + GSAP + Three.js

Exemplo editável de 8 segundos, vertical 1080×1920/30 FPS.

- **Remotion** dirige timeline e renderização (240 frames).
- **GSAP** fornece função `parseEase('power3.out')` para animação determinística. *Não rodar timeline realtime, scroll, timer ou `.play()` em render*.
- **Three.js** constrói uma `IcosahedronGeometry`, aplica rotação baseada no frame, projeta com `PerspectiveCamera` e desenha arestas em SVG. É 3D geométrico real projetado em vetor; **não** é WebGL nem scene shader.

Execute somente após autorizar a instalação das dependências:

```bash
cd examples/demo-remotion
npm install
npm run compositions
npm run still
npm run render
```

Não há narração nem música no exemplo técnico. O vídeo completo deve importar `Audio`/assets aprovados, mapear timestamps reais e mixar áudio sob as regras da skill. A presença deste código não comprova renderização homologada até o comando real terminar e o MP4 passar pelo QA.

As versões são fixadas para reproduzibilidade inicial; atualize-as de maneira coordenada e rode o smoke render ao fazer upgrades. Verifique o licenciamento comercial do Remotion para seu cenário de uso.
