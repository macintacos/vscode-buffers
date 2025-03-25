#!/usr/bin/env bash

set -euo pipefail

version_to_bump="$(pnpm exec git-cliff --bumped-version)"

pnpm exec git-cliff --unreleased --tag "$version_to_bump"
gum confirm "About to publish v$version_to_bump with the above changelog. Proceed?"

# Prepare the changelog, update package.json
pnpm exec git-cliff --bump -o CHANGELOG.md
git add . && git commit -m "prerelease: generate changelog for v$version_to_bump"
pnpm version "$version_to_bump"
git add . && git commit -m "prerelease: bump 'package.json' for v$version_to_bump"
git push origin main

# Actually package and release
pnpm run vscode:prepublish
pnpm exec vsce package && pnpm exec vsce publish "$version_to_bump"
