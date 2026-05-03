(function () {
    var taskbarButtons = {};
    var windowIdCounter = 0;

    function getWindowId(windowEl) {
        if (!windowEl.dataset.wid) windowEl.dataset.wid = 'w' + (++windowIdCounter);
        return windowEl.dataset.wid;
    }

    function getWindowTitle(windowEl) {
        var header = windowEl.querySelector('.header');
        if (!header) return 'Window';
        var clone = header.cloneNode(true);
        clone.querySelectorAll('.buttons, img').forEach(function (el) { el.remove(); });
        return clone.textContent.trim().replace(/\s+/g, ' ') || 'Window';
    }

    function playWireframeAnimation(fromRect, toRect) {
        var el = document.createElement('div');
        el.className = 'wireframe-anim';
        el.style.top    = fromRect.top    + 'px';
        el.style.left   = fromRect.left   + 'px';
        el.style.width  = fromRect.width  + 'px';
        el.style.height = fromRect.height + 'px';
        document.body.appendChild(el);
        el.getBoundingClientRect(); // force reflow so initial position is painted
        el.style.top    = toRect.top    + 'px';
        el.style.left   = toRect.left   + 'px';
        el.style.width  = toRect.width  + 'px';
        el.style.height = toRect.height + 'px';
        setTimeout(function () { el.remove(); }, 220);
    }

    function registerWindow(windowEl, title) {
        var wid = getWindowId(windowEl);
        if (taskbarButtons[wid]) return;
        var label = title || getWindowTitle(windowEl);
        var btn = document.createElement('button');
        btn.className = 'taskbar-task-btn';
        btn.textContent = label.length > 20 ? label.slice(0, 18) + '…' : label;
        btn.title = label;
        btn.dataset.wid = wid;
        btn.addEventListener('click', function () {
            if (windowEl.classList.contains('minimized')) restoreWindow(windowEl);
            else minimizeWindow(windowEl);
        });
        document.getElementById('taskbarTasks').appendChild(btn);
        taskbarButtons[wid] = btn;
    }

    function unregisterWindow(windowEl) {
        var wid = getWindowId(windowEl);
        var btn = taskbarButtons[wid];
        if (btn) { btn.remove(); delete taskbarButtons[wid]; }
    }

    function minimizeWindow(windowEl) {
        var wid = getWindowId(windowEl);
        var btn = taskbarButtons[wid];
        var from = windowEl.getBoundingClientRect();
        // Store rect so the restore animation can animate back to the right place
        windowEl.dataset.lastRect = JSON.stringify({ top: from.top, left: from.left, width: from.width, height: from.height });
        var to = btn ? btn.getBoundingClientRect() : { top: window.innerHeight - 28, left: 70, width: 120, height: 22 };
        playWireframeAnimation(from, to);
        setTimeout(function () {
            windowEl.classList.add('minimized');
            if (btn) btn.classList.add('pressed');
        }, 160);
    }

    function restoreWindow(windowEl) {
        var wid = getWindowId(windowEl);
        var btn = taskbarButtons[wid];
        var stored = windowEl.dataset.lastRect ? JSON.parse(windowEl.dataset.lastRect) : null;
        var to   = stored || { top: 100, left: 100, width: 400, height: 300 };
        var from = btn ? btn.getBoundingClientRect() : { top: window.innerHeight - 28, left: 70, width: 120, height: 22 };
        playWireframeAnimation(from, to);
        if (btn) btn.classList.remove('pressed');
        setTimeout(function () {
            windowEl.classList.remove('minimized');
            windowEl.style.zIndex = ++globalZindexCounter;
        }, 160);
    }

    function maximizeWindow(windowEl) {
        if (windowEl.classList.contains('maximized')) {
            var orig = JSON.parse(windowEl.dataset.origRect || '{}');
            windowEl.style.top    = orig.top    || '';
            windowEl.style.left   = orig.left   || '';
            windowEl.style.width  = orig.width  || '';
            windowEl.style.height = orig.height || '';
            windowEl.classList.remove('maximized');
        } else {
            windowEl.dataset.origRect = JSON.stringify({
                top: windowEl.style.top, left: windowEl.style.left,
                width: windowEl.style.width, height: windowEl.style.height
            });
            windowEl.classList.add('maximized');
            windowEl.style.zIndex = ++globalZindexCounter;
        }
    }

    function wireUpWindowButtons(windowEl, title) {
        registerWindow(windowEl, title);
        var btns = windowEl.querySelectorAll('.buttons button');
        if (btns.length >= 3) {
            btns[2].removeAttribute('onclick');
            btns[0].addEventListener('click', function () { minimizeWindow(windowEl); });
            btns[1].addEventListener('click', function () { maximizeWindow(windowEl); });
            btns[2].addEventListener('click', function () { unregisterWindow(windowEl); windowEl.remove(); });
        }
        windowEl.addEventListener('mousedown', function () {
            this.style.zIndex = ++globalZindexCounter;
        });
    }

    // --- Shutdown ---

    function shutDown() {
        var content = [
            '<div class="innerWindow" style="padding:12px;text-align:left;">',
            '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;">',
            '<img src="ico/classic/power-1.png" style="width:32px;height:32px;flex-shrink:0"/>',
            '<div style="line-height:1.6">What do you want the computer to do?<br/>',
            '<select id="shutdownOption" style="margin-top:6px;width:100%;">',
            '<option value="off">Shut down</option>',
            '<option value="restart">Restart</option>',
            '<option value="dos">Restart in MS-DOS mode</option>',
            '</select></div></div>',
            '<div style="text-align:right;">',
            '<button onclick="confirmShutdown(this)" style="margin-right:4px;">OK</button>',
            '<button onclick="var w=this.closest(\'.window\');unregisterWindow(w);w.remove();">Cancel</button>',
            '</div></div>'
        ].join('');
        createNewWindow('Shut Down Windows', content);
    }

    function confirmShutdown(btn) {
        var val = btn.closest('.window').querySelector('#shutdownOption').value;
        if (val === 'restart') {
            location.reload();
        } else if (val === 'dos') {
            var shutdownWin = btn.closest('.window');
            unregisterWindow(shutdownWin);
            shutdownWin.remove();
            document.querySelectorAll('.window').forEach(function (w) {
                w.style.transition = 'opacity 0.45s';
                w.style.opacity = '0';
            });
            setTimeout(function () {
                document.querySelectorAll('.file, .folder').forEach(function (el) {
                    el.style.transition = 'opacity 0.45s';
                    el.style.opacity = '0';
                });
                setTimeout(function () { window.location.href = '/ms-dos'; }, 500);
            }, 500);
        } else {
            document.body.style.transition = 'opacity 1.2s';
            document.body.style.opacity = '0';
            setTimeout(function () {
                document.body.innerHTML = [
                    '<div style="background:black;color:white;font-family:Tahoma,sans-serif;',
                    'display:flex;align-items:center;justify-content:center;height:100vh;font-size:16px;">',
                    'It is now safe to turn off your computer.</div>'
                ].join('');
                document.body.style.opacity = '1';
            }, 1200);
        }
    }

    // --- Clock & start menu setup ---

    document.addEventListener('DOMContentLoaded', function () {
        // Clock
        function tick() {
            var el = document.getElementById('taskbarClock');
            if (!el) return;
            var d = new Date(), h = d.getHours() % 12 || 12, m = d.getMinutes();
            el.textContent = h + ':' + (m < 10 ? '0' : '') + m + ' ' + (d.getHours() >= 12 ? 'PM' : 'AM');
        }
        tick();
        setInterval(tick, 1000);

        // Start menu
        var startBtn  = document.getElementById('startBtn');
        var startMenu = document.getElementById('startMenu');
        if (!startBtn || !startMenu) return;

        startBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            var open = startMenu.style.display !== 'none';
            startMenu.style.display = open ? 'none' : 'block';
            startBtn.classList.toggle('active', !open);
        });

        document.addEventListener('click', function () {
            startMenu.style.display = 'none';
            startBtn.classList.remove('active');
        });

        // Close menu when a program link is clicked
        startMenu.addEventListener('click', function (e) {
            if (e.target.closest('a')) {
                startMenu.style.display = 'none';
                startBtn.classList.remove('active');
            }
            e.stopPropagation();
        });

        document.getElementById('settingsItem').addEventListener('click', function () {
            startMenu.style.display = 'none';
            startBtn.classList.remove('active');
            var welcome = document.getElementById('welcomeWindow');
            if (welcome) {
                if (welcome.classList.contains('minimized')) restoreWindow(welcome);
                welcome.style.zIndex = ++globalZindexCounter;
            }
        });

        document.getElementById('shutdownItem').addEventListener('click', function () {
            startMenu.style.display = 'none';
            startBtn.classList.remove('active');
            shutDown();
        });
    });

    // Expose to global scope so inline onclicks and other files can call these
    window.wireUpWindowButtons = wireUpWindowButtons;
    window.unregisterWindow    = unregisterWindow;
    window.minimizeWindow      = minimizeWindow;
    window.restoreWindow       = restoreWindow;
    window.maximizeWindow      = maximizeWindow;
    window.shutDown            = shutDown;
    window.confirmShutdown     = confirmShutdown;
})();
