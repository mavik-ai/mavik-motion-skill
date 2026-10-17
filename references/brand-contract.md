# Brand Contract — identidade por projeto (fonte rastreável)

**A MAVIK Motion Skill não impõe a marca Rafael Jorge a novos clientes.** Todo projeto deve conter `brief.json` e `brand.json` próprios ou link a Design System acessível, confirmado por quem encomendou.

Antes de produzir, validar com:

```bash
node scripts/brief-check.mjs caminho/do/projeto/brief.json
```

**Gate bloqueante:** não basta o modelo "lembrar" da marca. O briefing deve apontar para um arquivo real `brand.file` e `brand.confirmed: true` após consentimento. `brief-check` valida existência, paleta e fonte tipográfica, mas **não comprova** direitos, autorização ou precisão subjetiva.

A marca define paleta HEX, tipografia, logo, tom, materiais proibidos, público e identidade de produto. O vídeo define contexto narrativo, plataforma, duração, idioma, música, estilo e CTA específico. **Nunca inferir CTA a partir de vídeos anteriores**.

- Se o briefing está pronto, prossiga sem perguntar novamente.
- Se há 1–2 campos críticos, pergunte só eles.
- Se é cliente novo, não aplicar automaticamente `#CFFF3D`, Inter ou `@rafaeljorge.ai`.
- `examples/ia10x/` é exemplo específico da marca de Rafael Jorge, não template universal.
- Antes de chamadas pagas, confirmar roteiro final, voz e orçamento.

Leia `references/context-first.md` e `references/brief-schema.md`.
