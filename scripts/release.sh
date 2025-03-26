#!/usr/bin/env bash

set -euo pipefail

version_to_bump="$(pnpm exec git-cliff --bumped-version)"

pnpm exec git-cliff --unreleased --tag "$version_to_bump"
gum confirm "About to publish v$version_to_bump with the above changelog. Proceed?"

# Prepare the changelog, update package.json
pnpm exec git-cliff --bump -o CHANGELOG.md
git add . && git commit -m "prerelease: generate changelog for v$version_to_bump"
git push origin main

# Actually package and release
pnpm run vscode:prepublish
pnpm vsce publish --no-dependencies "$version_to_bump" -m "release: publish v$version_to_bump"
git push origin tag "$version_to_bump"
