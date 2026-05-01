/* =====================================================
    LOAD HEADER (ALL PAGES)
===================================================== */
(function() {
    const headerContainer = document.getElementById("headerContainer");
    if (headerContainer) {
        fetch("header.html")
            .then(res => {
                if (!res.ok) throw new Error("header.html not found");
                return res.text();
            })
            .then(data => {
                headerContainer.innerHTML = data;
                initMusic();
            })
            .catch(() => {
                initMusic(); // still start music even if header fails to load
            });
    } else {
        initMusic();
    }
}());

/* =====================================================
    RESPONSIVE SCALE
    Keeps the 1600×850 canvas fitting any screen.
===================================================== */
/* Portrait canvas dimensions for mobile */
const PORTRAIT_W = 480;
const PORTRAIT_H = 854;
const LANDSCAPE_W = 1600;
const LANDSCAPE_H = 850;

function isMobileDevice() {
    return window.innerWidth < 900 || ("ontouchstart" in window && window.innerWidth < 1024);
}

function applyGameScale() {
    const container = document.getElementById("gameContainer");
    const gameCanvas = document.getElementById("gameCanvas");
    if (!container) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mobile = isMobileDevice();

    const mc = document.getElementById("mobileControls");

    if (mobile) {
        /* -- Portrait mode -- */
        // Scale to fill screen edge-to-edge
        const scale = Math.min(vw / PORTRAIT_W, vh / PORTRAIT_H);
        container.dataset.mode = "portrait";
        container.style.width  = PORTRAIT_W + "px";
        container.style.height = PORTRAIT_H + "px";
        container.style.transform = `scale(${scale})`;
        if (gameCanvas) {
            gameCanvas.style.width  = PORTRAIT_W + "px";
            gameCanvas.style.height = PORTRAIT_H + "px";
            gameCanvas.style.borderRadius = "0";
        }
        if (mc) mc.style.display = "flex";
    } else {
        /* -- Landscape / Desktop mode -- */
        const scale = Math.min(vw / LANDSCAPE_W, vh / LANDSCAPE_H, 1);
        container.dataset.mode = "landscape";
        container.style.width  = LANDSCAPE_W + "px";
        container.style.height = LANDSCAPE_H + "px";
        container.style.transform = `scale(${scale})`;
        if (gameCanvas) {
            gameCanvas.style.width  = LANDSCAPE_W + "px";
            gameCanvas.style.height = LANDSCAPE_H + "px";
            gameCanvas.style.borderRadius = "20px";
        }
        if (mc) mc.style.display = "none";
    }
}

applyGameScale();
window.addEventListener("resize", applyGameScale);

applyGameScale();
window.addEventListener("resize", applyGameScale);

/* =====================================================
    GLOBAL HIGH SCORE
===================================================== */
let highScore = parseInt(localStorage.getItem("highScore")) || 0;

/* =====================================================
    MUSIC SYSTEM
===================================================== */
function initMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    if (!bgMusic || !musicToggle) return;

    const isPlaying = localStorage.getItem('musicPlaying') === 'true';
    const savedTime = localStorage.getItem('musicTime');
    if (savedTime) bgMusic.currentTime = parseFloat(savedTime);

    if (isPlaying) {
        bgMusic.play().catch(() => {});
        musicToggle.textContent = "🔊";
        musicToggle.classList.add("music-playing");
    } else {
        bgMusic.pause();
        musicToggle.textContent = "🔇";
        musicToggle.classList.remove("music-playing");
    }

    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.textContent = "🔊";
            musicToggle.classList.add("music-playing");
            localStorage.setItem('musicPlaying', 'true');
        } else {
            bgMusic.pause();
            musicToggle.textContent = "🔇";
            musicToggle.classList.remove("music-playing");
            localStorage.setItem('musicPlaying', 'false');
        }
    });

    setInterval(() => {
        if (bgMusic && !bgMusic.paused) {
            localStorage.setItem('musicTime', bgMusic.currentTime);
        }
    }, 1000);
}

/* =====================================================
    PAGE TRANSITION
===================================================== */
function startGame() {
    document.body.style.opacity = "0";
    setTimeout(() => { window.location.href = "game.html"; }, 800);
}

/* =====================================================
    STARFIELD BACKGROUND
===================================================== */
const starCanvas = document.getElementById("stars");
if (starCanvas) {
    const starCtx = starCanvas.getContext("2d");

    function resizeStarCanvas() {
        starCanvas.width = window.innerWidth;
        starCanvas.height = window.innerHeight;
    }
    resizeStarCanvas();
    window.addEventListener("resize", resizeStarCanvas);

    let stars = [], nebulaClouds = [];
    const clusterCenters = [];

    function buildClusters() {
        clusterCenters.length = 0;
        for (let c = 0; c < 8; c++) {
            clusterCenters.push({
                x: Math.random() * starCanvas.width,
                y: Math.random() * starCanvas.height,
                spread: 80 + Math.random() * 200
            });
        }
    }

    function gaussianOffset(spread) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * spread;
    }

    function createStars() {
        buildClusters();
        stars = []; nebulaClouds = [];

        for (let i = 0; i < 180; i++) {
            stars.push({
                x: Math.random() * starCanvas.width,
                y: Math.random() * starCanvas.height,
                size: Math.random() * 1.2 + 0.3,
                speed: Math.random() * 0.4 + 0.1,
                opacity: Math.random() * 0.5 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2,
                color: "255,255,255",
                glow: false
            });
        }

        for (let c = 0; c < clusterCenters.length; c++) {
            const center = clusterCenters[c];
            const count = 30 + Math.floor(Math.random() * 40);
            for (let i = 0; i < count; i++) {
                const col = Math.random() < 0.3 ? "180,140,255" : Math.random() < 0.4 ? "140,210,255" : "255,255,255";
                stars.push({
                    x: center.x + gaussianOffset(center.spread),
                    y: center.y + gaussianOffset(center.spread),
                    size: Math.random() * 2.2 + 0.6,
                    speed: Math.random() * 0.3 + 0.05,
                    opacity: Math.random() * 0.5 + 0.5,
                    twinkleSpeed: Math.random() * 0.03 + 0.01,
                    twinkleOffset: Math.random() * Math.PI * 2,
                    color: col,
                    glow: Math.random() < 0.35
                });
            }
        }

        for (let i = 0; i < 18; i++) {
            stars.push({
                x: Math.random() * starCanvas.width,
                y: Math.random() * starCanvas.height,
                size: 2.5 + Math.random() * 2,
                speed: Math.random() * 0.2 + 0.05,
                opacity: 0.85 + Math.random() * 0.15,
                twinkleSpeed: Math.random() * 0.04 + 0.015,
                twinkleOffset: Math.random() * Math.PI * 2,
                color: Math.random() < 0.5 ? "200,160,255" : "160,220,255",
                glow: true,
                spike: true
            });
        }

        for (let i = 0; i < 5; i++) {
            nebulaClouds.push({
                x: Math.random() * starCanvas.width,
                y: Math.random() * starCanvas.height,
                rx: 120 + Math.random() * 200,
                ry: 80 + Math.random() * 150,
                hue: Math.random() < 0.5 ? "111,0,255" : "6,182,212",
                alpha: 0.04 + Math.random() * 0.05
            });
        }
    }

    createStars();
    window.addEventListener("resize", () => { resizeStarCanvas(); createStars(); });

    let tick = 0;
    function animateStars() {
        tick++;
        starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);

        nebulaClouds.forEach(n => {
            const grad = starCtx.createRadialGradient(n.x, n.y, 0, n.x, n.y, Math.max(n.rx, n.ry));
            grad.addColorStop(0, `rgba(${n.hue}, ${n.alpha})`);
            grad.addColorStop(1, `rgba(${n.hue}, 0)`);
            starCtx.save();
            starCtx.scale(1, n.ry / n.rx);
            starCtx.beginPath();
            starCtx.arc(n.x, n.y * (n.rx / n.ry), n.rx, 0, Math.PI * 2);
            starCtx.fillStyle = grad;
            starCtx.fill();
            starCtx.restore();
        });

        stars.forEach(star => {
            star.y += star.speed;
            if (star.y > starCanvas.height) { star.y = 0; star.x = Math.random() * starCanvas.width; }

            const twinkle = 0.5 + 0.5 * Math.sin(tick * star.twinkleSpeed + star.twinkleOffset);
            const alpha = star.opacity * (0.6 + 0.4 * twinkle);

            if (star.glow) {
                const glowR = star.size * 4;
                const grad = starCtx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowR);
                grad.addColorStop(0, `rgba(${star.color}, ${alpha * 0.6})`);
                grad.addColorStop(1, `rgba(${star.color}, 0)`);
                starCtx.beginPath();
                starCtx.arc(star.x, star.y, glowR, 0, Math.PI * 2);
                starCtx.fillStyle = grad;
                starCtx.fill();
            }

            if (star.spike) {
                const spikeLen = star.size * 6 * (0.7 + 0.3 * twinkle);
                starCtx.save();
                starCtx.globalAlpha = alpha * 0.55;
                starCtx.strokeStyle = `rgba(${star.color}, 1)`;
                starCtx.lineWidth = 0.8;
                starCtx.beginPath();
                starCtx.moveTo(star.x - spikeLen, star.y);
                starCtx.lineTo(star.x + spikeLen, star.y);
                starCtx.moveTo(star.x, star.y - spikeLen);
                starCtx.lineTo(star.x, star.y + spikeLen);
                starCtx.stroke();
                starCtx.restore();
            }

            starCtx.globalAlpha = alpha;
            starCtx.fillStyle = `rgb(${star.color})`;
            starCtx.beginPath();
            starCtx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
            starCtx.fill();
            starCtx.globalAlpha = 1;
        });

        requestAnimationFrame(animateStars);
    }
    animateStars();
}

/* =====================================================
    GAME ENGINE
===================================================== */
const canvas = document.getElementById("gameCanvas");
if (canvas) {
    const ctx = canvas.getContext("2d");

    // Set canvas resolution based on device
    const onMobile = isMobileDevice();
    canvas.width  = onMobile ? PORTRAIT_W  : LANDSCAPE_W;
    canvas.height = onMobile ? PORTRAIT_H  : LANDSCAPE_H;

    let score = 0;
    let lives = 5;
    let level = 1;
    let prevLevel = 1;
    let gameRunning = true;
    let isPaused = false;
    let combo = 0;
    let lastKillTime = 0;

    const scoreEl   = document.getElementById("score");
    const levelEl   = document.getElementById("level");
    const highScoreEl = document.getElementById("highScore");
    if (highScoreEl) highScoreEl.textContent = highScore;

    let keys = {};
    let mouseX = canvas.width / 2;
    let isMouseDown = false;
    let usingMouse = false;   // true only when the actual mouse has moved over the canvas

    document.addEventListener("keydown", e => {
        keys[e.key] = true;
        if (e.key === " ") e.preventDefault();
        usingMouse = false; // keyboard press → disable mouse-follow
    });
    document.addEventListener("keyup",   e => { keys[e.key] = false; });

    canvas.addEventListener("mousemove", e => {
        // Only activate mouse-follow for real pointer (not touch-generated mouse events)
        if (e.pointerType === "touch") return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        mouseX = (e.clientX - rect.left) * scaleX;
        usingMouse = true;
    });
    canvas.addEventListener("mousedown",  e => { if (e.pointerType !== "touch") { isMouseDown = true; usingMouse = true; } });
    canvas.addEventListener("mouseup",    e => { if (e.pointerType !== "touch") isMouseDown = false; });

    /* ---- Mobile controls ---- */
    function bindMobileBtn(id, keyName) {
        const btn = document.getElementById(id);
        if (!btn) return;
        const setActive = (on) => {
            keys[keyName] = on;
            btn.classList.toggle("pressed", on);
            if (on) usingMouse = false; // mobile button → disable mouse-follow
        };
        // Pointer events — most reliable on all mobile browsers
        btn.addEventListener("pointerdown",  e => { e.preventDefault(); btn.setPointerCapture(e.pointerId); setActive(true); },  { passive: false });
        btn.addEventListener("pointerup",    e => { e.preventDefault(); setActive(false); }, { passive: false });
        btn.addEventListener("pointercancel",e => { e.preventDefault(); setActive(false); }, { passive: false });
        // Touch fallback
        btn.addEventListener("touchstart",  e => { e.preventDefault(); setActive(true); },  { passive: false });
        btn.addEventListener("touchend",    e => { e.preventDefault(); setActive(false); }, { passive: false });
        btn.addEventListener("touchcancel", e => { e.preventDefault(); setActive(false); }, { passive: false });
    }

    bindMobileBtn("btnLeft",  "ArrowLeft");
    bindMobileBtn("btnRight", "ArrowRight");

    const fireBtn = document.getElementById("btnFire");
    if (fireBtn) {
        const setFire = (on) => {
            isMouseDown = on;
            if (on) usingMouse = false;
            fireBtn.classList.toggle("pressed", on);
        };
        fireBtn.addEventListener("pointerdown",  e => { e.preventDefault(); fireBtn.setPointerCapture(e.pointerId); setFire(true); },  { passive: false });
        fireBtn.addEventListener("pointerup",    e => { e.preventDefault(); setFire(false); }, { passive: false });
        fireBtn.addEventListener("pointercancel",e => { e.preventDefault(); setFire(false); }, { passive: false });
        fireBtn.addEventListener("touchstart",  e => { e.preventDefault(); setFire(true); },  { passive: false });
        fireBtn.addEventListener("touchend",    e => { e.preventDefault(); setFire(false); }, { passive: false });
        fireBtn.addEventListener("touchcancel", e => { e.preventDefault(); setFire(false); }, { passive: false });
        fireBtn.addEventListener("mousedown",  () => setFire(true));
        fireBtn.addEventListener("mouseup",    () => setFire(false));
        fireBtn.addEventListener("mouseleave", () => setFire(false));
    }

    /* ---- Assets ---- */
    const playerImg = new Image();
    playerImg.src = "shooter.png";

    const asteroidImages = [];
    ["asteroid.png","asteroid1.png","asteroid2.png","asteroid3.png"].forEach(src => {
        const img = new Image();
        img.src = src;
        asteroidImages.push(img);
    });

    /* ---- Score popup ---- */
    function spawnScorePopup(x, y, pts) {
        const el = document.createElement("div");
        el.className = "score-popup";
        el.textContent = "+" + pts;
        el.style.left = x + "px";
        el.style.top  = y + "px";
        document.getElementById("gameContainer").appendChild(el);
        el.addEventListener("animationend", () => el.remove());
    }

    /* ---- Level banner ---- */
    function showLevelBanner(lv) {
        const banner = document.getElementById("levelBanner");
        if (!banner) return;
        banner.textContent = "⬡ LEVEL " + lv + " ⬡";
        banner.style.display = "block";
        banner.style.animation = "none";
        void banner.offsetWidth;
        banner.style.animation = "levelFlash 1.8s ease-out forwards";
        banner.addEventListener("animationend", () => { banner.style.display = "none"; }, { once: true });
    }

    /* ---- Particles ---- */
    class Particle {
        constructor(x, y, color) {
            this.x = x; this.y = y;
            this.vx = (Math.random() - 0.5) * 7;
            this.vy = (Math.random() - 0.5) * 7;
            this.life = 50 + Math.random() * 20;
            this.maxLife = this.life;
            this.size = 2 + Math.random() * 3;
            this.color = color || `hsl(${20 + Math.random()*40}, 100%, 60%)`;
        }
        update() { this.x += this.vx; this.y += this.vy; this.vx *= 0.95; this.vy *= 0.95; this.life--; }
        draw() {
            const a = this.life / this.maxLife;
            ctx.globalAlpha = a;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * a, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    let particles = [];
    const MAX_PARTICLES = 150; // hard cap to prevent frame drops

    function addParticle(p) {
        if (particles.length < MAX_PARTICLES) particles.push(p);
    }

    function createExplosion(x, y, big) {
        const count = big ? 20 : 12; // reduced from 60/30
        for (let i = 0; i < count; i++) {
            addParticle(new Particle(x, y));
        }
        // spark ring (reduced from 8 to 5)
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const p = new Particle(x, y, "#06b6d4");
            p.vx = Math.cos(angle) * (4 + Math.random() * 4);
            p.vy = Math.sin(angle) * (4 + Math.random() * 4);
            addParticle(p);
        }
    }

    /* ---- Stars in game canvas ---- */
    class Star {
        constructor(speed) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speed = Math.random() * speed + 0.5;
            this.brightness = 0.3 + Math.random() * 0.7;
        }
        update() { if (!isPaused) { this.y += this.speed; if (this.y > canvas.height) this.y = 0; } }
        draw() {
            ctx.globalAlpha = this.brightness;
            ctx.fillStyle = "white";
            ctx.fillRect(this.x, this.y, this.size, this.size);
            ctx.globalAlpha = 1;
        }
    }

    let stars1 = Array.from({ length: 60 }, () => new Star(0.5));
    let stars2 = Array.from({ length: 50 }, () => new Star(1));
    let stars3 = Array.from({ length: 40 }, () => new Star(2));

    /* ---- Player ---- */
    class Player {
        constructor() {
            // Smaller ship on portrait mobile so it fits the narrow canvas
            this.width  = onMobile ? 48 : 72;
            this.height = onMobile ? 48 : 72;
            this.x = canvas.width / 2;
            this.y = canvas.height - (onMobile ? 90 : 130);
            this.speed = onMobile ? 10 : 14;
            this.lastShot = 0;
            this.thrustParticles = [];
        }
        update() {
            if (isPaused) return;

            const isMobileKey = keys["ArrowLeft"] || keys["ArrowRight"] || keys["a"] || keys["d"];

            if ((keys["ArrowLeft"]  || keys["a"]) && this.x > 0)                    this.x -= this.speed;
            if ((keys["ArrowRight"] || keys["d"]) && this.x < canvas.width - this.width) this.x += this.speed;

            // Only apply mouse-follow when the actual mouse has been used (not on mobile touch)
            if (usingMouse && !isMobileKey) {
                this.x += (mouseX - this.width / 2 - this.x) * 0.18;
            }

            this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));

            // engine glow thrust - throttled to prevent particle overflow
            if (Math.random() < 0.25) {
                const p = new Particle(this.x + this.width / 2 + (Math.random() - 0.5) * 14,
                                       this.y + this.height - 4,
                                       `hsl(${200 + Math.random()*60}, 100%, 65%)`);
                p.vy = 2 + Math.random() * 3;
                p.vx = (Math.random() - 0.5) * 2;
                p.life = 15 + Math.random() * 10;
                p.maxLife = p.life;
                p.size = 2 + Math.random() * 2;
                addParticle(p);
            }
        }
        draw() { ctx.drawImage(playerImg, this.x, this.y, this.width, this.height); }
    }
    let player = new Player();

    /* ---- Bullet ---- */
    class Bullet {
        constructor(x, y, dual) {
            this.x = x; this.y = y;
            this.width = 5; this.height = 22;
            this.speed = 14;
            this.dual = dual || false;
        }
        update() { this.y -= this.speed; }
        draw() {
            // Neon plasma bolt
            const grd = ctx.createLinearGradient(this.x, this.y + this.height, this.x, this.y);
            grd.addColorStop(0, "rgba(109,40,217,0)");
            grd.addColorStop(0.4, "rgba(168,85,247,0.8)");
            grd.addColorStop(1,   "rgba(6,182,212,1)");
            ctx.save();
            ctx.shadowColor = "#06b6d4";
            ctx.shadowBlur  = 16;
            ctx.fillStyle   = grd;
            ctx.beginPath();
            ctx.roundRect(this.x, this.y, this.width, this.height, 3);
            ctx.fill();
            // Core bright streak
            ctx.fillStyle = "rgba(255,255,255,0.9)";
            ctx.fillRect(this.x + 1, this.y, this.width - 2, 5);
            ctx.restore();
        }
    }
    let bullets = [];

    function shoot() {
        const cx = player.x + player.width / 2;
        if (level >= 5) {
            // Dual shot at higher levels
            bullets.push(new Bullet(cx - 14, player.y, true));
            bullets.push(new Bullet(cx + 9,  player.y, true));
        } else {
            bullets.push(new Bullet(cx - 3, player.y));
        }
    }

    /* ---- Enemy ---- */
    class Enemy {
        constructor() {
            // Smaller asteroids on portrait so they fit the narrow width
            const minSize = onMobile ? 28 : 40;
            const maxExtra = onMobile ? 30 : 44;
            this.width  = minSize + Math.random() * maxExtra;
            this.height = this.width;
            this.x = Math.random() * (canvas.width - this.width);
            this.y = -60;
            this.speed = 1.8 + level * 0.45 + Math.random() * 0.8;
            this.image = asteroidImages[Math.floor(Math.random() * asteroidImages.length)];
            this.rotation = 0;
            this.rotSpeed = (Math.random() - 0.5) * 0.06;
            this.hp = level >= 8 ? 2 : 1; // armored at high levels
        }
        update() {
            if (!isPaused) {
                this.y += this.speed;
                this.rotation += this.rotSpeed;
            }
        }
        draw() {
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(this.rotation);
            if (this.hp > 1) {
                // red tint for armored
                ctx.shadowColor = "#ff2d55";
                ctx.shadowBlur  = 18;
            }
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        }
    }

    let enemies = [];
    let spawnInterval;

    function startSpawning() {
        const delay = Math.max(300, 900 - level * 40);
        spawnInterval = setInterval(() => {
            if (!isPaused && gameRunning) enemies.push(new Enemy());
        }, delay);
    }
    function stopSpawning() { clearInterval(spawnInterval); }

    function collision(a, b) {
        return a.x < b.x + b.width && a.x + a.width > b.x &&
               a.y < b.y + b.height && a.y + a.height > b.y;
    }

    function updateLivesDisplay(isDamage) {
        const container = document.getElementById("lives");
        const gameBox   = document.getElementById("gameContainer");
        if (!container) return;
        if (isDamage && gameBox) {
            gameBox.classList.add("shake-effect");
            setTimeout(() => gameBox.classList.remove("shake-effect"), 450);
        }
        container.innerHTML = "";
        for (let i = 0; i < lives; i++) {
            const img = document.createElement("img");
            img.src = "live.png";
            img.style.width = "20px";
            container.appendChild(img);
        }
    }

    /* ---- Main loop ---- */
    function update() {
        if (!gameRunning) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        [...stars1, ...stars2, ...stars3].forEach(s => { s.update(); s.draw(); });

        // Particles - update all, batch-draw by color to minimize ctx state changes
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            if (particles[i].life <= 0) particles.splice(i, 1);
        }
        // Group by color and draw in batches (far fewer ctx calls)
        const colorMap = new Map();
        for (const p of particles) {
            const key = p.color + '|' + Math.round(p.life / p.maxLife * 8); // bucket alpha
            if (!colorMap.has(key)) colorMap.set(key, []);
            colorMap.get(key).push(p);
        }
        for (const [key, group] of colorMap) {
            const p0 = group[0];
            const alpha = p0.life / p0.maxLife;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p0.color;
            ctx.beginPath();
            for (const p of group) {
                ctx.moveTo(p.x + p.size * alpha, p.y);
                ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
            }
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        player.update();
        player.draw();

        // Shooting
        if (!isPaused && Date.now() - player.lastShot > 160) {
            if (keys[" "] || isMouseDown) { shoot(); player.lastShot = Date.now(); }
        }

        // Bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            if (!isPaused) bullets[i].update();
            bullets[i].draw();
            if (bullets[i].y < 0) bullets.splice(i, 1);
        }

        // Enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].update();
            enemies[i].draw();

            if (enemies[i].y > canvas.height) {
                enemies.splice(i, 1);
                combo = 0;
                lives--;
                updateLivesDisplay(true);
                if (lives <= 0) { endGame(); return; }
                continue;
            }

            let hit = false;
            for (let j = bullets.length - 1; j >= 0; j--) {
                if (collision(bullets[j], enemies[i])) {
                    enemies[i].hp--;
                    bullets.splice(j, 1); // always remove the bullet first
                    if (enemies[i].hp <= 0) {
                        // Combo system
                        const now = Date.now();
                        lastKillTime = now;

                        const pts = 10;
                        createExplosion(enemies[i].x + enemies[i].width / 2,
                                        enemies[i].y + enemies[i].height / 2,
                                        enemies[i].width > 60);
                        // Score popup — convert canvas coords to container coords
                        const rect = canvas.getBoundingClientRect();
                        const scaleX = rect.width / canvas.width;
                        const scaleY = rect.height / canvas.height;
                        const popX = (enemies[i].x + enemies[i].width / 2) * scaleX;
                        const popY = (enemies[i].y) * scaleY;
                        spawnScorePopup(popX, popY, pts);

                        score += pts;
                        const newLevel = Math.floor(score / 150) + 1;
                        if (newLevel !== level) {
                            level = newLevel;
                            showLevelBanner(level);
                            // Respawn with tighter interval
                            stopSpawning();
                            startSpawning();
                        }
                        if (scoreEl)   scoreEl.textContent = score;
                        if (levelEl)   levelEl.textContent = level;
                        enemies.splice(i, 1); // remove enemy after all reads are done
                        hit = true;
                        break; // stop checking more bullets for this (now removed) enemy
                    }
                }
            }
        }

        requestAnimationFrame(update);
    }

    /* ---- Pause ---- */
    const pauseBtn = document.getElementById("pauseBtn");
    if (pauseBtn) {
        pauseBtn.addEventListener("click", () => {
            isPaused = true;
            document.getElementById("overlay").style.display = "flex";
            document.getElementById("pauseMenu").style.display = "flex";
            document.getElementById("gameOver").style.display = "none";
        });
    }

    window.resumeGame = function () {
        isPaused = false;
        document.getElementById("overlay").style.display = "none";
    };

    window.restartGame = function () { window.location.reload(); };
    window.quitToGameOver = function () { endGame(); };

    function endGame() {
        gameRunning = false;
        isPaused = false;
        stopSpawning();
        const isNewBest = score > highScore;
        if (isNewBest) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        document.getElementById("finalScore").textContent = score;
        const newBestLabel = document.getElementById("newBestLabel");
        if (newBestLabel) newBestLabel.classList.toggle("show", isNewBest);
        document.getElementById("overlay").style.display = "flex";
        document.getElementById("pauseMenu").style.display = "none";
        document.getElementById("gameOver").style.display = "flex";
    }

    /* ---- Keyboard pause ---- */
    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && gameRunning) {
            if (isPaused) window.resumeGame();
            else {
                isPaused = true;
                document.getElementById("overlay").style.display = "flex";
                document.getElementById("pauseMenu").style.display = "flex";
                document.getElementById("gameOver").style.display = "none";
            }
        }
    });

    updateLivesDisplay(false);

    // Wait for all images to load before starting the game loop
    // This prevents the ship from disappearing on load
    const allImages = [playerImg, ...asteroidImages];
    let loaded = 0;
    function onImageLoad() {
        loaded++;
        if (loaded >= allImages.length) {
            startSpawning();
            update();
        }
    }
    allImages.forEach(img => {
        if (img.complete && img.naturalWidth > 0) {
            onImageLoad();
        } else {
            img.addEventListener('load', onImageLoad);
            img.addEventListener('error', onImageLoad); // still start even if one image fails
        }
    });
}

/* =====================================================
    VISUAL EFFECTS (HOME PAGE)
===================================================== */
const title = document.querySelector(".heroTitle");
if (title) {
    let glow = 0;
    function glowTitle() {
        glow += 0.05;
        const intensity = (Math.sin(glow) + 1) * 15;
        title.style.textShadow = "0 0 " + intensity + "px rgb(111,0,255)";
        requestAnimationFrame(glowTitle);
    }
    glowTitle();
}

const buttons = document.querySelectorAll(".heroBtn");
buttons.forEach(btn => {
    btn.addEventListener("mouseenter", () => btn.style.transform = "scale(1.05)");
    btn.addEventListener("mouseleave", () => btn.style.transform = "scale(1)");
});