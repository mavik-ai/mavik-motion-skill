# MAVIK Quality Director — critérios de entrega

## Gates bloqueantes

1. **Mensagem:** público entende o vídeo sem precisar ler um artigo?
2. **Roteiro:** nomes/etapas corretos, ortografia revisada, claims verdadeiros?
3. **Legibilidade:** títulos, contrastes, tempo de leitura e áreas seguras no mobile?
4. **Motion:** próximo quadro nasce do anterior de forma deliberada?
5. **Sincronização:** voz respira; música acompanha e não atropela a frase?
6. **Áudio:** trilha autorizada, sem clipping e voz inteligível no smartphone?
7. **Tecnologia:** render verificado, resolução, codecs, duração e ausência de quadros pretos acidentais?
8. **Direitos:** nenhuma marca, mídia, voz ou áudio usados sem permissão?

## Rito mínimo de QA

```bash
node scripts/validate-shotlist.mjs examples/ia10x/shotlist.json
node scripts/validate-render.mjs video.mp4 --duration 60 --width 1080 --height 1920 --audio 1
bash scripts/create-contact-sheet.sh video.mp4 contact-sheet.jpg
```

Depois **assistir ao vídeo inteiro com fones e no celular**. Analisar ao menos os primeiros 2s, uma transição de pilar, uma cena tipográfica longa e o CTA. Solicitar correções se não estiver no padrão.

O validator é automatizado **apenas para metadata e shotlist**; `contact-sheet.jpg` é evidência para revisão visual humana ou com visão computacional, não uma aprovação automática. Evite atribuir uma nota “10/10” sem critérios objetivos.
