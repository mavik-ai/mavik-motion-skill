# MAVIK Doctor — contrato de instalação

- Sempre diagnosticar antes de alterar o ambiente.
- `node scripts/doctor.mjs` é somente-leitura e detecta Node, FFmpeg, FFprobe, navegador, HyperFrames/Playwright/Remotion locais e espaço livre.
- O comando não faz `npm install` nem busca rede, não cria pasta, não migra nem publica código.
- Em caso de ausência de Node 22+, explicar que HyperFrames requer Node 22+.
- Propor o menor número possível de instalações. Playwright e Remotion são opcionais conforme tipo de projeto.
- Após consentimento do usuário, seguir documentação oficial da ferramenta correspondente e executar `doctor` novamente.
- Falhas de render precisam mostrar comando, saída resumida e próximo passo. Nunca silenciosamente substituí-las por vídeo estático.
- Se a skill for instalada via plugin em um ambiente sem terminal/browsers, ela continua funcionando para planejamento; a produção exigirá um executor conectado.
