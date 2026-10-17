# MAVIK Audio Director — Provedores e políticas

## Padrão de narração

**ElevenLabs Multilingual v2** é a opção inicial para voz premium com alinhamento de caracteres no endpoint `with-timestamps`. **Fish Audio S2.1 Pro** é a alternativa de custo/qualidade. **Higgsfield** é opcional, utilizado somente mediante conector autenticado, orçamento e autorização. O produtor deve testar a mesma frase em português brasileiro para decidir a melhor voz; o modelo não substitui a escuta humana.

## Fluxo recomendado

1. Aprovar roteiro, direitos de voz e duração esperada.
2. Executar `node scripts/tts.mjs --provider elevenlabs --voice-id VOZ --text-file roteiro.txt --out narracao.mp3` para prévia seca: **nenhuma chamada paga**.
3. Conferir chave por variável de ambiente, nunca pelo chat ou em arquivos versionados.
4. Com autorização explícita de custo, repetir com `--execute`. Sem autorização, permanecer em dry-run.
5. Medir a duração real (`ffprobe`); sincronizar primeiro as palavras e pausas, depois beats da música.
6. Usar alinhamento de caracteres fornecido pela ElevenLabs ou ferramenta específica de alinhamento/transcrição para Fish (não inventar timestamps). Revisar manualmente.
7. Mixar voz em primeiro plano e música com ducking (`scripts/mix-audio.mjs`). Verificar picos e ouvir o arquivo.
8. Reaproveitar arquivo aprovado; não chamar API de novo quando mudar apenas a animação.

## Comandos

```bash
# Prévia, não consome créditos nem faz rede
node scripts/tts.mjs --provider elevenlabs --voice-id ID --text-file roteiro.txt --out narracao.mp3
node scripts/tts.mjs --provider fish --voice-id ID --text-file roteiro.txt --out narracao.mp3

# Após autorização, usa credenciais presentes nas variáveis de ambiente
ELEVENLABS_API_KEY=... node scripts/tts.mjs --provider elevenlabs --voice-id ID --text-file roteiro.txt --out narracao.mp3 --execute
FISH_AUDIO_API_KEY=... node scripts/tts.mjs --provider fish --voice-id ID --text-file roteiro.txt --out narracao.mp3 --execute
```

**Cuidado:** nos comandos acima, nunca digite chaves reais em terminal cujo histórico é compartilhado ou exportado. Configure variáveis em ambiente protegido/gerenciador de segredos. As linhas usam `...` só como notação, não como instrução de copiar credenciais.

## Contratos API verificados (outubro de 2026)

- ElevenLabs: `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps` — `xi-api-key` — JSON com `text`, `model_id` — retorna `audio_base64`, `alignment`/`normalized_alignment`.
- Fish Audio: `POST https://api.fish.audio/v1/tts` — `Authorization: Bearer ...`, header `model: s2.1-pro` — JSON `text`, `reference_id`, `format: mp3` — retorna áudio MP3.
- Higgsfield: conector externo autorizado; sem implementação direta de API neste repositório, sem afirmar suporte nativo a timestamps.

## Direitos, orçamento e segurança

- Usar vozes licenciadas ou próprias com consentimento. Não imitar pessoas reais sem autorização.
- Não efetuar chamadas pagas, clonar vozes ou publicar automaticamente.
- Não registrar chaves, corpos de erro sensíveis ou áudios pessoais em logs públicos.
- `doctor` verifica somente a presença de variáveis (não exibe valores); `tts.mjs` recusa sobrescrever arquivo sem `--overwrite`.
- Duração, texto e modelo impactam custo. **A skill não faz estimativa monetária automática**; consultar preço/preflight do provedor antes de executar.

## Fontes oficiais

- https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps/
- https://fish.audio/pt/text-to-speech-api/
