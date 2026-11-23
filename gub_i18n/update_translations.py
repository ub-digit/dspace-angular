#!/usr/bin/env python3
import argparse
from collections import Counter
import json
from pathlib import Path
import re

import json5


TOOL_DIR = Path(__file__).resolve().parent
ENTRY = re.compile(
    r'''^(?P<prefix>[ \t]*(?P<comment>//[ \t]*)?'''
    r'''(?:"(?P<double_key>[^"\\]+)"|'(?P<single_key>[^'\\]+)'|(?P<bare_key>[\w$]+))'''
    r'''[ \t]*:[ \t]*)(?P<value>"(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*')''',
    re.MULTILINE,
)
PLACEHOLDER = re.compile(r'{{\s*([^{}]+?)\s*}}')


def entry_key(match):
    return match['double_key'] or match['single_key'] or match['bare_key']


def read_rules():
    replacements = {}
    for line in (TOOL_DIR / 'replacements').read_text(encoding='utf-8').splitlines():
        if '=>' in line:
            original, replacement = line.split('=>', 1)
            replacements[original] = replacement
    skip_words = [
        line.strip().lower()
        for line in (TOOL_DIR / 'skip_words').read_text(encoding='utf-8').splitlines()
        if line.strip()
    ]
    return replacements, skip_words


def merge_catalog(source_path, target_path):
    """Write a candidate catalog while preserving the target's comments and layout."""
    source = json5.loads(source_path.read_text(encoding='utf-8'))
    text = target_path.read_text(encoding='utf-8')
    replacements, skip_words = read_rules()
    original_values = {
        entry_key(match): json5.loads(match['value'])
        for match in ENTRY.finditer(text)
        if match['comment']
    }
    updated_count = 0

    def update_entry(match):
        nonlocal updated_count
        key = entry_key(match)
        source_value = source.get(key)
        if match['comment'] or key not in original_values or not isinstance(source_value, str):
            return match[0]

        target_value = json5.loads(match['value'])
        if target_value != original_values[key]:
            return match[0]

        for old, new in replacements.items():
            source_value = source_value.replace(old, new)
        if target_value == source_value or any(word in source_value.lower() for word in skip_words):
            return match[0]

        if Counter(PLACEHOLDER.findall(target_value)) != Counter(PLACEHOLDER.findall(source_value)):
            print(f'Skipping {key} because its interpolation parameters differ')
            return match[0]

        updated_count += 1
        return match['prefix'] + json.dumps(source_value, ensure_ascii=False)

    updated = ENTRY.sub(update_entry, text)
    json5.loads(updated)
    output_path = target_path.with_name(target_path.name + '.updated')
    output_path.write_text(updated, encoding='utf-8')
    print(f'Wrote {output_path} with {updated_count} updates')


def main():
    parser = argparse.ArgumentParser(description='Merge translations into untranslated JSON5 entries.')
    parser.add_argument('source', type=Path)
    parser.add_argument('target', type=Path)
    args = parser.parse_args()
    merge_catalog(args.source, args.target)


if __name__ == '__main__':
    main()
