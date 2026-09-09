#!/usr/bin/env python3
"""Validate the local files reachable from the published LiveLabs manifest."""

from __future__ import annotations

import argparse
import json
import re
import tempfile
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlsplit

PUBLIC_BASE_PATH = "/workshop-dataplatform-esp/"
MARKDOWN_LINK = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")


def link_destination(raw_destination: str) -> str:
    raw_destination = raw_destination.strip()
    if raw_destination.startswith("<") and ">" in raw_destination:
        return raw_destination[1 : raw_destination.index(">")]
    return raw_destination.split(maxsplit=1)[0] if raw_destination else ""


def is_external(destination: str) -> bool:
    parsed = urlsplit(destination)
    return bool(parsed.scheme or parsed.netloc or destination.startswith("//"))


def relative_parts(source_parts: tuple[str, ...], destination: str) -> tuple[str, ...] | str | None:
    destination = unquote(destination)
    parsed = urlsplit(destination)
    if not parsed.path:
        return None
    if is_external(destination):
        return None

    path = parsed.path.replace("\\", "/")
    if path.startswith(PUBLIC_BASE_PATH):
        parts: list[str] = []
        path = path[len(PUBLIC_BASE_PATH) :]
    elif path.startswith("/"):
        return f"uses '{path}', which is outside the public base path '{PUBLIC_BASE_PATH}'"
    else:
        parts = list(source_parts)

    for part in PurePosixPath(path).parts:
        if part in ("", ".", "/"):
            continue
        if part == "..":
            if not parts:
                return "escapes the repository"
            parts.pop()
            continue
        parts.append(part)
    return tuple(parts)


def resolve_exact(root: Path, parts: tuple[str, ...]) -> str | None:
    current = root
    for part in parts:
        if not current.is_dir():
            return f"missing '{'/'.join(parts)}'"
        entries = {entry.name: entry for entry in current.iterdir()}
        if part in entries:
            current = entries[part]
            continue
        folded = {entry.name.casefold(): entry.name for entry in entries.values()}
        if part.casefold() in folded:
            return f"case differs at '{part}' (actual name: '{folded[part.casefold()]}')"
        return f"missing '{'/'.join(parts)}'"
    if not current.is_file():
        return f"missing file '{'/'.join(parts)}'"
    return None


def validate_reference(root: Path, source_parts: tuple[str, ...], destination: str, label: str) -> list[str]:
    if destination.startswith("#") or is_external(destination):
        return []
    parts_or_error = relative_parts(source_parts, destination)
    if parts_or_error is None:
        return []
    if isinstance(parts_or_error, str):
        return [f"{label}: {parts_or_error}"]
    error = resolve_exact(root, parts_or_error)
    return [] if error is None else [f"{label}: {error}"]


def load_manifest(root: Path) -> tuple[dict | None, list[str]]:
    manifest_path = root / "manifest.json"
    try:
        data = json.loads(manifest_path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return None, ["manifest.json: missing"]
    except json.JSONDecodeError as error:
        return None, [f"manifest.json: invalid JSON ({error.msg})"]
    if not isinstance(data, dict):
        return None, ["manifest.json: root must be an object"]
    tutorials = data.get("tutorials")
    if not isinstance(tutorials, list) or not tutorials:
        return None, ["manifest.json: tutorials must be a non-empty list"]
    return data, []


def validate_site(root: Path) -> list[str]:
    manifest, problems = load_manifest(root)
    if manifest is None:
        return problems

    for index, tutorial in enumerate(manifest["tutorials"], start=1):
        label = f"manifest tutorial {index}"
        if not isinstance(tutorial, dict) or not isinstance(tutorial.get("filename"), str):
            problems.append(f"{label}: filename must be a string")
            continue
        filename = tutorial["filename"]
        if is_external(filename):
            problems.append(f"{label}: external Markdown is outside this repository")
            continue
        problems.extend(validate_reference(root, (), filename, label))
        parts_or_error = relative_parts((), filename)
        if isinstance(parts_or_error, str) or parts_or_error is None:
            continue
        if resolve_exact(root, parts_or_error) is not None:
            continue
        if not filename.lower().split("?", 1)[0].endswith(".md"):
            problems.append(f"{label}: expected a Markdown file")
            continue

        markdown_path = root.joinpath(*parts_or_error)
        source_parts = parts_or_error[:-1]
        for line_number, line in enumerate(markdown_path.read_text(encoding="utf-8").splitlines(), start=1):
            for raw_destination in MARKDOWN_LINK.findall(line):
                destination = link_destination(raw_destination)
                problems.extend(
                    validate_reference(root, source_parts, destination, f"{'/'.join(parts_or_error)}:{line_number}")
                )
    return problems


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def test_root() -> Path:
    root = Path(tempfile.mkdtemp())
    write(root / "manifest.json", '{"tutorials": [{"filename": "docs/lab.md"}]}')
    write(root / "docs/lab.md", '![diagram](images/Diagram.PNG)\n[public](/workshop-dataplatform-esp/docs/images/Diagram.PNG)')
    write(root / "docs/images/Diagram.PNG", "image")
    return root


def run_self_test() -> None:
    root = test_root()
    assert not validate_site(root), "a complete, correctly cased site must pass"

    write(root / "manifest.json", "{")
    assert any("invalid JSON" in problem for problem in validate_site(root)), "invalid JSON must fail"

    root = test_root()
    write(root / "manifest.json", '{"tutorials": [{"filename": "docs/missing.md"}]}')
    assert any("missing" in problem for problem in validate_site(root)), "missing Markdown must fail"

    root = test_root()
    write(root / "docs/lab.md", "![diagram](images/diagram.png)")
    assert any("case differs" in problem for problem in validate_site(root)), "case differences must fail"

    print("site-check self-test passed")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--self-test", action="store_true", help="run the validator's built-in checks")
    args = parser.parse_args()
    if args.self_test:
        run_self_test()
        return 0

    problems = validate_site(Path(__file__).resolve().parents[1])
    if problems:
        print("site check failed:")
        for problem in problems:
            print(f"- {problem}")
        return 1
    print("site check passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
