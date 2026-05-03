# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Windows 98-themed personal portfolio site, live at `bavrumov.github.io`. It has been running since its first commit on **2017-01-18**. No framework, no bundler — pure HTML/CSS/JS deployed via GitHub Pages. Jekyll is present only to satisfy Pages; `_config.yml` just sets the theme and is otherwise inert.

## Developing locally

```bash
# Serve with Jekyll (matches Pages environment exactly)
bundle exec jekyll serve

# Or any static file server works fine — no build step required
python3 -m http.server 8080
npx serve .
```

There are no lint, test, or build commands. Changes to any file are live-reload visible immediately with `jekyll serve --livereload`.

## Deploying

Use the `/deploy` skill — it pushes to `master`, which triggers GitHub Pages automatically.

## Architecture

### The window system

Everything on screen is a "window". There are two constructors:

- **`oldWindow.js`** — `uiWindow(title, body, height, width)` builds a generic content window (notepad-style). `createNewWindow(title, content)` is the factory wrapper that also places the window randomly and wires up drag/buttons. `globalZindexCounter` lives here and is the single source of truth for layering.
- **`windows.js`** — `folder(title, height, width)` builds folder windows (file-explorer style). `item(type, name)` and `domItem(item)` construct desktop icon elements.

`taskbar.js` is an IIFE that owns minimize/maximize/restore, the taskbar task buttons, the start menu, the clock, and the shutdown dialog. It exposes `wireUpWindowButtons(el, title)` globally — **every new window must call this** to register with the taskbar.

Script load order in `index.html` matters:
```
oldWindow.js → windows.js → filenames.js → xmlfilequery.js → md5.js → passwordProtection.js → taskbar.js
```

### Data layer (XML files)

Content is driven by three XML files — no database, no API:

| File | Purpose |
|---|---|
| `filestructure.xml` | Defines what icons appear on the desktop and inside folders (type, name, date) |
| `filedata.xml` | Stores the HTML content of each file, keyed by filename |
| `hashlookup.xml` | MD5 hash-to-content map for password-protected files |

`xmlfilequery.js` → `retrieveNode(filename)` fetches `filedata.xml` and opens a window with the matching content.

To add a new file to the desktop: add an `<item>` to `filestructure.xml`, then add a matching `<file>` with `<name>` and `<content>` to `filedata.xml`.

### Password protection

`passwordProtection.js` hashes user input as `MD5("gottem," + input)` and looks it up in `hashlookup.xml`. The `.password` CSS class on a desktop item triggers this flow instead of the normal open.

### MS-DOS terminal

A separate page at `/ms-dos/index.html` (self-contained, no shared JS). Supported commands: `cls`, `exit` (returns to `/`), and `Paycheck.sh <salary> [zip]` — which POSTs to SmartAsset via `corsproxy.io` and displays annualized take-home pay.

### CSS

- `contra/win98.css` — the Win98 chrome (window frames, taskbar, start menu, buttons, file icons). Treat as a vendor file.
- `main.css` — site-specific overrides and layout on top of the above.

### Mobile / touch

jQuery UI Touch Punch adds drag support on touch devices. Double-tap is handled manually in `index.html` (`onDoubleTap`) because Touch Punch's `preventDefault` suppresses the browser's synthetic `dblclick`.
