#!/usr/bin/env bash
set -euo pipefail
if [[ $# -lt 2 ]]; then echo "Uso: bash scripts/create-contact-sheet.sh input.mp4 output.jpg" >&2; exit 2; fi
input="$1"; output="$2"
[[ -f "$input" ]] || { echo "Arquivo de entrada não encontrado" >&2; exit 2; }
mkdir -p "$(dirname "$output")"
# 12 capturas em um mosaico 3x4, para uma revisão rápida; não substitui assistir ao vídeo.
ffmpeg -hide_banner -loglevel error -y -i "$input" -vf "fps=1/5,scale=360:-2,tile=3x4:padding=4:margin=4:color=black" -frames:v 1 "$output"
echo "Contact sheet: $output"
