pc.script.createLoadingScreen(function (app) {
    var createCss = function () {
        var css = [
            'body { background-color: #000; margin: 0; padding: 0; overflow: hidden; }',
            '#splash-wrapper { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #050505; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 9999; font-family: "Segoe UI", sans-serif; color: white; }',
            '#splash-container { width: 280px; text-align: center; display: flex; flex-direction: column; align-items: center; }',
            
            // Your Custom Logo (Colored)
            '#custom-logo { width: 120px; height: 120px; margin-bottom: 20px; border-radius: 50%; }',
            
            // PlayCanvas Logo (White text style)
            '#pc-logo { width: 80px; opacity: 0.4; margin-bottom: 30px; filter: brightness(0) invert(1); }',
            
            '#progress-container { width: 100%; height: 2px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-bottom: 12px; position: relative; overflow: hidden; }',
            '#progress-bar { width: 0%; height: 100%; background: #00ffcc; box-shadow: 0 0 15px rgba(0, 255, 204, 0.6); transition: width 0.2s ease-out; }',
            '#status-row { display: flex; justify-content: space-between; width: 100%; font-size: 11px; opacity: 0.4; letter-spacing: 2px; text-transform: uppercase; }',
            '.fade-out { opacity: 0 !important; transition: opacity 0.8s ease-in !important; pointer-events: none !important; }'
        ].join('\n');

        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    };

    var showSplash = function () {
        var wrapper = document.createElement('div');
        wrapper.id = 'splash-wrapper';
        document.body.appendChild(wrapper);

        // Corrected HTML string
        wrapper.innerHTML = 
            '<div id="splash-container">' +
                // 1. Your Custom Logo
                '<img id="custom-logo" src="https://i.postimg.cc/MHkYLZzN/color-circle-icon-layout.png">' +
                // 2. PlayCanvas Logo
                '<img id="pc-logo" src="https://playcanvas.com/static-assets/images/play_text_252_white.png">' +
                
                '<div id="progress-container"><div id="progress-bar"></div></div>' +
                '<div id="status-row">' +
                    '<span id="asset-count">Initialising...</span>' +
                    '<span id="percent">0%</span>' +
                '</div>' +
            '</div>';
    };

    var updateUI = function (progressValue) {
        var bar = document.getElementById('progress-bar');
        var percentText = document.getElementById('percent');
        var assetText = document.getElementById('asset-count');

        if (progressValue !== undefined) {
            var p = Math.floor(progressValue * 100);
            if (bar) bar.style.width = p + '%';
            if (percentText) percentText.textContent = p + '%';
        }

        if (assetText && app.assets && typeof app.assets.list === 'function') {
            var assets = app.assets.list(); 
            var preloads = assets.filter(function(a) { return a.preload; });
            var loaded = preloads.filter(function(a) { return a.loaded; }).length;
            var total = preloads.length;

            if (total > 0) {
                assetText.textContent = 'Files: ' + loaded + ' / ' + total;
            }
        }
    };

    var hideSplash = function () {
        var wrapper = document.getElementById('splash-wrapper');
        if (wrapper) {
            wrapper.classList.add('fade-out');
            setTimeout(function () { wrapper.remove(); }, 800);
        }
    };

    createCss();
    showSplash();

    app.on('preload:progress', function (value) { updateUI(value); });
    app.assets.on('load', function () { updateUI(); });
    app.assets.on('add', function () { updateUI(); });
    app.on('preload:end', function () { app.off('preload:progress'); });
    app.on('start', function () { hideSplash(); });
});