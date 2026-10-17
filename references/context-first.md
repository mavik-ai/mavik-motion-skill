# Context First — contrato de briefing / preflight obrigatório

O agente **não pode iniciar cenas, narração paga ou exportação de vídeo** sem validar contexto mínimo. A memória do modelo é apenas hipótese; **repositório do cliente, Design System, briefing explícito e decisões atuais** prevalecem.

## 1. Ordem de consulta (mais confiável primeiro)

1. Briefing e identidade fornecidos nesta tarefa.
2. Design System e brand.json no projeto; anotar caminho e versão.
3. Ativos e estratégia atuais aprovados (CTA, canal, oferta, públicos, exemplos).
4. Memória/conversa do agente **somente como sugestão**, nunca como prova de aprovação.
5. Defaults técnicos neutros (ex.: vertical 9:16), marcados como *propostos*.

Não tratar identidade de exemplo (Rafael Jorge/IA10X) como identidade default de cliente novo.

## 2. Campos de entrada

Salve `brief.json` na pasta do projeto. Use o formato em `references/brief-schema.md` ou rode `node scripts/brief-check.mjs --template`.

| Campo | Motivo | Quando bloquear |
|---|---|---|
| brand.file e brand.confirmed | Não inventar cores, logo, fonte e restrições | Arquivo não existe ou não foi validado |
| objective, audience, key_message | Clareza estratégica | Vazio |
| platform, format, duration_seconds | Restrições técnicas | Ausente/inválido |
| style, reference_urls | Direção audiovisual | Estilo ausente; referências podem ser vazias |
| voice.mode e language | Tipo de narração e idioma | Ausente |
| music.direction + music.rights | Trilha e direitos | Ausente; só aceitar `original`, `licensed`, `none` |
| cta.text, cta.destination | Evitar CTA improvisado | Ausente; caso sem CTA, `cta.mode=none` explícito |
| claims_verified | Evitar inventar números/cases | `false` exige evitar alegações factuais não documentadas |

## 3. Padrões de perguntas

- Pergunte apenas os campos críticos ausentes, em linguagem simples e em um **único turno curto**, quando realmente necessário.
- Exemplo: "Qual marca/design system devo usar, e qual CTA exato aparece ao final?"; se uma delas já está confirmada, pergunte apenas a outra.
- Se a fonte visual for insuficiente, peça um brand kit ou aceite um **preset temporário aprovado**.
- Caso o vídeo tenha narração e CTA, valide o **texto falado** e o **texto na tela** separadamente.
- Gerar prévia sem cobrança pode ser permitido para discutir proposta, mas **não chamar de vídeo final** nem consumir API paga.

## 4. Evidência de aprovação

O `brief-check` testa estrutura, coerência e existência do arquivo local. Ele **não autentica o consentimento humano**: `brand.confirmed=true` só pode ser preenchido após o cliente realmente confirmar a fonte. O produtor registra `brief_owner` e `approved_at` quando disponíveis.

## 5. Fluxo

`Doctor → Context First / brief:check → referências → roteiro / CTA → aprovação de piloto → produção Remotion → QA → entrega`.
