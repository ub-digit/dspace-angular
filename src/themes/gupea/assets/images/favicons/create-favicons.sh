#!/usr/bin/env bash
set -euo pipefail

if (( $# > 2 )); then
  echo "Usage: $0 [source-image] [output-directory]" >&2
  exit 2
fi

asset_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
default_source="$asset_dir/favicon.svg"
if [[ -f "$asset_dir/logo.png" ]]; then
  default_source="$asset_dir/logo.png"
fi
source_image="${1:-$default_source}"
output_dir="${2:-$asset_dir}"

if command -v magick >/dev/null; then
  convert_image=(magick)
elif command -v convert >/dev/null; then
  convert_image=(convert)
else
  echo 'Install ImageMagick to generate favicons.' >&2
  exit 1
fi

if [[ ! -f "$source_image" ]]; then
  echo "Source image not found: $source_image" >&2
  exit 1
fi

if [[ "$source_image" == *.svg ]] && ! command -v rsvg-convert >/dev/null; then
  echo 'Install rsvg-convert to generate favicons from SVG artwork.' >&2
  exit 1
fi

mkdir -p -- "$output_dir"
work_dir="$(mktemp -d "$output_dir/.favicons.XXXXXXXX")"
trap 'rm -rf -- "$work_dir"' EXIT

if [[ "$source_image" == *.svg ]]; then
  # The GUPEA SVG uses clip paths that ImageMagick's internal renderer can miss.
  rsvg-convert --keep-aspect-ratio --width 512 --height 512 -- "$source_image" > "$work_dir/logo.png"
else
  "${convert_image[@]}" "$source_image" -strip "$work_dir/logo.png"
fi

render_icon() {
  local size="$1"
  local filename="$2"
  "${convert_image[@]}" "$work_dir/logo.png" -background none -resize "${size}x${size}" \
    -gravity center -extent "${size}x${size}" -strip "$work_dir/$filename"
}

for size in 16 32 64 128; do
  render_icon "$size" "icon-$size.png"
done
"${convert_image[@]}" "$work_dir/icon-16.png" "$work_dir/icon-32.png" \
  "$work_dir/icon-64.png" "$work_dir/icon-128.png" "$work_dir/favicon.ico"

render_icon 512 android-chrome-512x512.png
render_icon 192 android-chrome-192x192.png
render_icon 180 apple-touch-icon.png

for file in favicon.ico android-chrome-512x512.png android-chrome-192x192.png apple-touch-icon.png; do
  mv -- "$work_dir/$file" "$output_dir/$file"
done
