# bavrumov.github.io

A Windows 98-themed personal portfolio that lives at [bavrumov.github.io](https://bavrumov.github.io). Built entirely with vanilla HTML, CSS, and jQuery — no framework, no bundler, no nonsense. It has been haunting the internet since January 2017.

## What's inside

The site simulates a Windows 98 desktop. Icons are draggable, windows are resizable and minimizable, the Start menu works, and the taskbar keeps track of everything. Double-clicking a file opens its content in a new window. There's even a password-protected file if you're feeling brave.

Tucked away in the Start menu's Shut Down dialog is an option to **Restart in MS-DOS mode**, which drops you into `/ms-dos` — a faithful terminal recreation with a `Paycheck.sh` command that calculates take-home salary by zip code.

## Architecture at a glance

Content lives in three XML files:

- **`filestructure.xml`** — what icons appear on the desktop and in folders
- **`filedata.xml`** — the HTML content inside each file
- **`hashlookup.xml`** — MD5 hashes for the password-protected file

The window system is split across `oldWindow.js` (generic content windows) and `windows.js` (folder windows). `taskbar.js` handles the taskbar, minimize/restore animations, Start menu, and shutdown.

Styling comes from `contra/win98.css` (the Win98 chrome) and `main.css` (site-specific stuff on top).

## Running locally

```bash
# With Jekyll (matches GitHub Pages exactly)
bundle exec jekyll serve

# Or just any static file server
python3 -m http.server 8080
```

No build step. Changes are instant.

## Deploying

Push to `master`. GitHub Pages does the rest.
