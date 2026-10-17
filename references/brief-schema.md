# Contrato JSON de projeto

Campos críticos para o comando `node scripts/brief-check.mjs <arquivo.json>`:

```json
{
  "project": "nome-projeto",
  "brand": {"file": "brand.json", "confirmed": true, "source_label": "Design System v4 aprovado"},
  "objective": "O que o vídeo precisa alcançar",
  "audience": "Público específico",
  "key_message": "Uma tese clara",
  "platform": "instagram-reels",
  "format": "9:16",
  "duration_seconds": 60,
  "style": "kinetic-editorial + seamless-morphing + beat-sync",
  "reference_urls": [],
  "voice": {"mode": "ai", "language": "pt-BR", "provider": "elevenlabs", "approved": true},
  "music": {"direction": "electronic energetic low under voice", "rights": "original"},
  "cta": {"mode": "follow", "text": "Siga @rafaeljorge.ai", "destination": "https://instagram.com/rafaeljorge.ai"},
  "claims_verified": false,
  "brief_owner": "client",
  "approved_at": "2026-10-17"
}
```

- CTA pode ser intencionalmente omitido com `{ "mode": "none" }`.
- `voice.mode`: `ai`, `own` ou `none`; `voice.approved` requer aprovação de uso da voz quando se pretende gerar voz.
- `brand.confirmed` significa que a fonte do design foi efetivamente verificada, não inferida da memória.
- Referências são URLs opcionais, não garantem o direito de reproduzir o trabalho de terceiros.
- Roteiro visual deve derivar deste contrato; a skill não pode inserir oferta, preço, CTA ou promessas não confirmadas.
