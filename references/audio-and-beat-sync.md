# MAVIK Beat Director — voz, trilha e sincronização

## Ordem de prioridade

1. **Compreensão da fala**. A voz determina respiração, pausas e duração verdadeira.
2. **Emoção e estrutura**. Música define a energia sem competir com a mensagem.
3. **Cortes e entradas**. Vincular transições aos acentos perceptíveis, não a cada hi-hat.
4. **Efeitos pontuais**. Whoosh, impacto e UI ticks são opcionais e devem complementar a trilha.

## Rito

1. Aprovar roteiro de voz. Gerar voz com autorização e licença adequadas ou utilizar áudio enviado pelo usuário.
2. Medir duração final com `ffprobe` e adaptar as durações da shotlist à locução real.
3. Selecionar música apropriada e verificar licença para publicação comercial.
4. Obter BPM do arquivo por análise auditiva ou ferramenta de detecção; confirmar o primeiro downbeat (`offset`).
5. Calcular grade com `node scripts/beat-grid.mjs --bpm 124 --duration 60 --offset 0`.
6. Marcar beats relevantes no roteiro: entrada dos pilares, reviravoltas e CTA.
7. Encaixar entradas em beats fortes **apenas quando não atrapalhar palavras ou leitura**.
8. Fazer mixagem por audição; usar compressão/limiter e ducking ou volume manual sob voz.

## Mixagem

- A música deve soar baixa **em relação à voz**, não apenas exibir um número de decibéis fixo.
- Ajustar ducking com o ouvido e medir pico/nível integrado, evitando clipping.
- Em conteúdos de voz: não sacrificar consoantes por graves. Considerar filtros e equalização.
- Permitir mais energia musical em aberturas, pausas e conclusão.
- Não utilizar o gerador de voz para sintetizar música (ferramentas distintas).

## Nota sobre o script

`beat-grid.mjs` **não detecta BPM**: apenas constrói a grade matemática de um BPM previamente medido/confirmado. Nunca apresentar sua saída como uma análise automática da música.

## Mixagem local opcional

Após a narração e trilha estarem autorizadas:

```sh
node scripts/mix-audio.mjs --voice narracao.wav --music bg.mp3 --out mix.m4a
```

O script usa sidechain compression para abaixar a música durante a voz; parâmetros são ponto de partida e exigem revisão auditiva. Não substitui aprovação de direitos de uso.

## Provedores de narração

Veja `audio-providers.md` para ElevenLabs, Fish Audio e Higgsfield, priorização, segurança e comandos dry-run.
