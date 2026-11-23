#!/usr/bin/env bash
set -euo pipefail

case "${1:-}" in
  en|sv) language="$1" ;;
  *) echo "Usage: $0 en|sv" >&2; exit 2 ;;
esac

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
python_command=python3
if [[ -x "$script_dir/.venv/bin/python" ]]; then
  python_command="$script_dir/.venv/bin/python"
fi

exec "$python_command" "$script_dir/update_translations.py" \
  "$script_dir/i18n/$language.json5" "$script_dir/../src/assets/i18n/$language.json5"
