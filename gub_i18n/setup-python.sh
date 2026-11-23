# Load this script from Bash with source gub_i18n/setup-python.sh.
gupea_i18n_setup() {
  local script_dir python_version
  script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)" || return

  if command -v asdf >/dev/null; then
    read -r _ python_version < "$script_dir/.tool-versions" || return
    asdf install python "$python_version" || return
    (cd -- "$script_dir" && asdf exec python -m venv .venv) || return
  else
    python3 -m venv "$script_dir/.venv" || return
  fi

  source "$script_dir/.venv/bin/activate" || return
  python -m pip install -r "$script_dir/requirements.txt"
}

gupea_i18n_setup
