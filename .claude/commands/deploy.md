---
description: Deploy the site to GitHub Pages (bavrumov.github.io)
allowed-tools: Bash(git push:*), Bash(git status:*), Bash(git log:*)
---

## What this does

Pushes the current `master` branch to `origin`, which triggers GitHub Pages to rebuild and serve the site at [bavrumov.github.io](https://bavrumov.github.io).

This is a static Jekyll site with no build step — GitHub Pages handles the Jekyll build automatically after the push.

## Run it

```bash
git push origin master
```

## Notes

- Propagation usually takes 1–2 minutes after the push
- The site is served directly from `master` — do not push broken HTML/JS
- If Pages doesn't update, check the Actions tab on GitHub for build errors
