# mesa-reels

Templates Remotion para os Reels do Mesa AI. Renderizados no GitHub Actions (`render.yml`), disparados pelo cenário do Make.com.

- `src/Dica.tsx`: template "Dica" (foto + gancho + passos + encerramento com a logo oficial). Duração calculada pelo número de passos.
- Props (JSON): `foto` (URL pública), `hook`, `steps[]`, `closing`.
- Localmente: `npm install && npx remotion studio src/index.ts`.
