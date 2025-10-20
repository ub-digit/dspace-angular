#!/usr/bin/env python3
import json5
import re
import sys
from pathlib import Path

def load_json5(path):
    """Load JSON5 as a Python dict (for the source file)."""
    with open(path, 'r', encoding='utf-8') as f:
        return json5.load(f)

def unescape_json5_string(s, quote='"'):
    """
    Unescape JSON5 string content.
    Handles \n, \t, \\, and the quote character used.
    """
    # Replace escaped backslashes first
    s = s.replace('\\\\', '\\')
    # Replace escaped quote used in the file
    s = s.replace(f'\\{quote}', quote)
    # Standard escapes
    s = s.replace('\\n', '\n').replace('\\r', '\r').replace('\\t', '\t')
    return s

def load_skip_words(path):
    """Load skip words from file, one per line, ignoring empty lines."""
    skip_words = []
    if path and Path(path).exists():
        with open(path, 'r', encoding='utf-8') as f:
            skip_words = [line.strip().lower() for line in f if line.strip()]
    return skip_words

def load_replacements(path):
    """Load replacements from file in format original=>replacement"""
    replacements = {}
    if path and Path(path).exists():
        with open(path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or '=>' not in line:
                    continue
                key, value = line.split('=>', 1)
                replacements[key] = value
    return replacements

def apply_replacements(s, replacements):
    """Apply all replacements to string s"""
    for old, new in replacements.items():
        s = s.replace(old, new)
    return s

def update_target_in_place(source_path, target_path):
    source = load_json5(source_path)
    text = Path(target_path).read_text(encoding='utf-8')
    replacements = load_replacements('./replacements')
    skip_words = load_skip_words('./skip_words')

    for key, src_value in source.items():
        if not isinstance(src_value, str):
            continue  # only update string translations

        # Apply replacements to the source value
        src_value = apply_replacements(src_value, replacements)

        # Check skip words in the source value
        src_lower = src_value.lower()
        if any(word in src_lower for word in skip_words):
            print(f'Skipping key "{key}" because it contains a skip word')
            continue


        # Escape key for regex
        key_pattern = re.escape(key)

        # Regex pattern to find "key": "value" or key: 'value'
        pattern = re.compile(
            rf'^([ \t]*)([\'"]?){key_pattern}\2\s*:\s*([\'"])((?:\\.|(?!\3).)*)\3',
            flags=re.MULTILINE
        )

        def replacer(match):
            key_quote = match.group(2)
            quote = match.group(3)
            old_value = unescape_json5_string(match.group(4), quote)
            if old_value != src_value:
                print(f'Updating key "{key}":')
                print(f'{old_value} → {src_value}')
                new_escaped = src_value.replace('\\', '\\\\').replace(quote, f'\\{quote}')
                new_escaped = new_escaped.replace('\n', '\\n').replace('\r', '\\r')
                return f'{match.group(1)}{key_quote}{key}{key_quote}: {quote}{new_escaped}{quote}'
            return match.group(0)

        text, _ = pattern.subn(replacer, text, count=1)
    updated_path = target_path + '.updated'
    Path(updated_path).write_text(text, encoding='utf-8')
    print(f"\n✅ Updated: {target_path} as {updated_path}")

def main():
    if len(sys.argv) != 3:
        print("Usage: python update_translations_json5.py source.json5 target.json5")
        sys.exit(1)

    source_path, target_path = sys.argv[1], sys.argv[2]
    update_target_in_place(source_path, target_path)

if __name__ == '__main__':
    main()
