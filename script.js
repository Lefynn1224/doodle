const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const uiLayer = document.getElementById('ui-layer');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const shopScreen = document.getElementById('shop-screen');

const scoreDisplay = document.getElementById('score-display');
const difficultyContainer = document.getElementById('difficulty-container');
const difficultyFill = document.getElementById('difficulty-bar-fill');
const difficultyLevelVal = document.getElementById('difficulty-level-val');
const multiplierVal = document.getElementById('multiplier-val');

const finalScoreVal = document.getElementById('final-score-val');
const highScoreVal = document.getElementById('high-score-val');
const runCoinsVal = document.getElementById('run-coins-val');
const coinCountVal = document.getElementById('coin-count');
const coinPopAnim = document.getElementById('coin-pop-anim');

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const homeBtn = document.getElementById('home-btn');
const shopBtn = document.getElementById('shop-btn');
const closeShopBtn = document.getElementById('close-shop-btn');


// Game Constants
// Game Constants
let GRAVITY = 0.4;
let JUMP_FORCE = -12;
const ALIEN_WIDTH = 40;
const ALIEN_HEIGHT = 40;
const PLATFORM_WIDTH = 60;
const PLATFORM_HEIGHT = 15;
let PLATFORM_COUNT = 9;
const GAME_WIDTH = 400; // Designed width
let GAME_HEIGHT = 700; // Dynamic

const BIOMES = {
    normal: {
        gravity: 0.4,
        jumpForce: -12,
        platformCount: 9,
        monsterSpawnMulti: 0.03,
        colors: {
            bgTop: '#fcfcfc', // Match CSS
            bgBottom: '#fcfcfc',
            platformNormal: '#74b816',
            platformMoving: '#4cc9f0',
            platformBreak: '#55efc4', // Light green-ish
            doodler: '#6bcf63',
            doodlerLegs: '#3a9e32',
            bgGrid: '#e0e0e0'
        }
    },
    space: {
        gravity: 0.15,
        jumpForce: -12,
        platformCount: 6,
        monsterSpawnMulti: 0.03,
        colors: {
            bgTop: '#0b0c2a',
            bgBottom: '#2d3436',
            platformNormal: '#e056fd', // Neon Purple
            platformMoving: '#00cec9', // Neon Cyan
            platformBreak: '#ff7675', // Neon Red/Pink
            doodler: '#81ecec', // Cyan alien
            doodlerLegs: '#00cec9',
            bgGrid: 'rgba(255,255,255,0.1)'
        }
    },
    underwater: {
        gravity: 0.2,
        jumpForce: -7,
        platformCount: 13,
        monsterSpawnMulti: 0.2,
        colors: {
            bgTop: '#1e3799',
            bgBottom: '#4a69bd',
            platformNormal: '#f6b93b', // Sand
            platformMoving: '#78e08f', // Seaweed
            platformBreak: '#e55039', // Coral
            doodler: '#fab1a0', // Coral/Pinkish
            doodlerLegs: '#e17055',
            bgGrid: 'rgba(255,255,255,0.1)'
        }
    },
    sun: {
        gravity: 0.8,
        jumpForce: -14,
        platformCount: 10,
        monsterSpawnMulti: 0.01,
        colors: {
            bgTop: '#ff9f43',
            bgBottom: '#ee5253',
            platformNormal: '#ffdd59',
            platformMoving: '#f368e0',
            platformBreak: '#576574',
            doodler: '#feca57',
            doodlerLegs: '#ff9f43',
            bgGrid: 'rgba(255, 255, 255, 0.1)'
        }
    },
    dark_forest: {
        gravity: 0.45,
        jumpForce: -12,
        platformCount: 9,
        monsterSpawnMulti: 0.12, // More dangerous
        colors: {
            bgTop: '#050a05',
            bgBottom: '#102010',
            platformNormal: '#1e3d1e',
            platformMoving: '#2e5d2e',
            platformBreak: '#3d2b1f',
            doodler: '#27ae60',
            doodlerLegs: '#1e8449',
            bgGrid: 'rgba(0, 0, 0, 0.2)'
        }
    },
    cyberpunk: {
        gravity: 0.4,
        jumpForce: -12,
        platformCount: 9,
        monsterSpawnMulti: 0.05,
        colors: {
            bgTop: '#0d0221',
            bgBottom: '#240b36',
            platformNormal: '#00f2ff',
            platformMoving: '#ff00ff',
            platformBreak: '#ffcc00',
            doodler: '#39ff14',
            doodlerLegs: '#00cc00',
            bgGrid: 'rgba(57, 255, 20, 0.1)'
        }
    },
    glacial_cave: {
        gravity: 0.4,
        jumpForce: -12,
        platformCount: 9,
        monsterSpawnMulti: 0.04,
        colors: {
            bgTop: '#0d1b2a',
            bgBottom: '#1b263b',
            platformNormal: '#e0e1dd',
            platformMoving: '#a2d2ff',
            platformBreak: '#778da9',
            doodler: '#00acc1',
            doodlerLegs: '#00838f',
            bgGrid: 'rgba(255, 255, 255, 0.1)'
        }
    },
    dream: {
        gravity: 0.25, // Very floaty
        jumpForce: -10,
        platformCount: 10,
        monsterSpawnMulti: 0.02,
        colors: {
            bgTop: '#6a11cb',
            bgBottom: '#2575fc',
            platformNormal: '#ffffff',
            platformMoving: '#fbc2eb',
            platformBreak: '#a18cd1',
            doodler: '#ffffff',
            doodlerLegs: '#cfd9df',
            bgGrid: 'rgba(255, 255, 255, 0.05)'
        }
    }
};

let currentBiome = 'normal';
let forestOffset = 0;

// Assets (simulated with drawing)
let COLORS = {
    ...BIOMES.normal.colors,
    monster: '#a55eea',
    spring: '#fab1a0',
    propeller: '#0984e3',
    jetpack: '#e17055',
    projectile: '#d63031',
    saver: '#f1c40f', // Gold
    boots: '#8e44ad', // Purple
    cloud: '#ffffff'  // Pure White
};

// State
let gameLoopId;
let score = 0;
let maxScore = 0;
let platforms = [];
let monsters = [];
let projectiles = [];
let meteors = []; // New state for Space biome
let icicles = []; // New state for Glacial Cave biome
let cloudActive = 0; // New state for Dream biome
let underwaterTimer = 0; // State for underwater current
let doodler;
let keys = { ArrowLeft: false, ArrowRight: false, a: false, d: false };
let cameraY = 0;
let gameState = 'MENU'; // MENU, PLAYING, GAMEOVER
let difficultyLevel = 1;

// Coin Tracking
let coins = parseInt(localStorage.getItem('doodleCoins')) || 0;
let runCoins = 0;
let lastCoinThreshold = 0;
let multiplier = 1.0;

// High Score from LocalStorage
let highScore = localStorage.getItem('doodleHighScore') || 0;
highScoreVal.innerText = highScore;
coinCountVal.innerText = coins;

// Resize handling
function resize() {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    GAME_HEIGHT = canvas.height;
}
window.addEventListener('resize', resize);
resize();

// Input Logic
document.addEventListener('keydown', (e) => {
    if (e.key in keys || e.key.toLowerCase() in keys) {
        keys[e.key] = true;
        if (e.key === 'a') keys['ArrowLeft'] = true;
        if (e.key === 'd') keys['ArrowRight'] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key in keys || e.key.toLowerCase() in keys) {
        keys[e.key] = false;
        if (e.key === 'a') keys['ArrowLeft'] = false;
        if (e.key === 'd') keys['ArrowRight'] = false;
    }
});

// Shooting Logic
function shoot(clientX, clientY) {
    if (gameState === 'PLAYING') {
        const rect = canvas.getBoundingClientRect();
        const clickX = clientX - rect.left;
        const clickY = clientY - rect.top;

        const dx = clickX - (doodler.x + doodler.width / 2);
        const dy = clickY - (doodler.y + doodler.height / 2);

        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return;

        const vx = (dx / dist) * 10;
        const vy = (dy / dist) * 10;

        projectiles.push(new Projectile(doodler.x + doodler.width / 2, doodler.y, vx, vy));
    }
}

canvas.addEventListener('mousedown', (e) => {
    shoot(e.clientX, e.clientY);
});

// Touch Movement Control
function handleTouch(touches) {
    let left = false;
    let right = false;
    const halfWidth = window.innerWidth / 2;

    for (let i = 0; i < touches.length; i++) {
        const t = touches[i];
        if (t.clientX < halfWidth) {
            left = true;
        } else {
            right = true;
        }
    }

    keys['ArrowLeft'] = left;
    keys['ArrowRight'] = right;
}

document.addEventListener('touchstart', (e) => {
    if (e.target.tagName === 'BUTTON') return;
    if (e.target.closest('#shop-items-container')) return; // Allow shop scrolling
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
        shoot(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
    }
    handleTouch(e.touches);
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (e.target.tagName === 'BUTTON') return;
    if (e.target.closest('#shop-items-container')) return;
    e.preventDefault();
    handleTouch(e.touches);
}, { passive: false });

document.addEventListener('touchend', (e) => {
    if (e.target.tagName === 'BUTTON') return;
    handleTouch(e.touches);
});

// Classes
class Projectile {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.r = 6;
        this.vx = vx;
        this.vy = vy;
    }

    draw() {
        ctx.fillStyle = COLORS.projectile;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
}

class Monster {
    constructor(x, y) {
        this.width = 50;
        this.height = 40;
        this.x = x;
        this.y = y;
        this.vx = Math.random() > 0.5 ? 1 : -1;
        this.range = 50;
        this.startX = x;
    }

    draw() {
        ctx.fillStyle = COLORS.monster;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height);
        ctx.quadraticCurveTo(this.x + this.width / 2, this.y - 10, this.x + this.width, this.y + this.height);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + 15, 6, 0, Math.PI * 2);
        ctx.arc(this.x + 35, this.y + 15, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + 15, 2, 0, Math.PI * 2);
        ctx.arc(this.x + 35, this.y + 15, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + 15, this.y + 30);
        ctx.lineTo(this.x + 35, this.y + 30);
        ctx.stroke();
    }

    update() {
        this.x += this.vx;
        if (this.x > this.startX + this.range || this.x < this.startX - this.range) {
            this.vx *= -1;
        }
    }
}

class Doodler {
    constructor() {
        this.width = ALIEN_WIDTH;
        this.height = ALIEN_HEIGHT;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - 150;
        this.vx = 0;
        this.vy = 0;
        this.facingRight = true;
        this.isInvincible = false;
        this.equipment = null;
        this.equipmentTime = 0;
        this.hasSaver = true;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        if (!this.facingRight) ctx.scale(-1, 1);

        // Saver Visual (Halo)
        if (this.hasSaver) {
            ctx.save();
            ctx.fillStyle = 'rgba(241, 196, 15, 0.4)';
            ctx.beginPath();
            ctx.arc(0, 0, 35, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = COLORS.saver;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }

        // Draw Legs
        ctx.fillStyle = this.equipment === 'boots' ? COLORS.boots : COLORS.doodlerLegs;
        ctx.fillRect(-15, 10, 10, 15);
        ctx.fillRect(5, 10, 10, 15);

        // Draw Body - Check shop skin?
        // Simple implementation: Check if 'suit_red' is owned/active (TODO: Proper inventory system)
        // For now, default
        ctx.fillStyle = COLORS.doodler;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();

        // Draw Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(10, -5, 5, 0, Math.PI * 2);
        ctx.arc(-5, -5, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(12, -5, 2, 0, Math.PI * 2);
        ctx.arc(-3, -5, 2, 0, Math.PI * 2);
        ctx.fill();

        // Equipment Draw
        if (this.equipment === 'propeller') {
            ctx.fillStyle = COLORS.propeller;
            ctx.fillRect(-10, -30, 20, 5);
            ctx.fillRect(-2, -35, 4, 15);
            ctx.save();
            ctx.translate(0, -35);
            ctx.scale(Math.sin(Date.now() / 50), 1);
            ctx.fillRect(-20, -2, 40, 4);
            ctx.restore();
        } else if (this.equipment === 'jetpack') {
            ctx.fillStyle = COLORS.jetpack;
            ctx.fillRect(-25, -10, 10, 30);
            ctx.fillStyle = 'orange'; // flame
            ctx.beginPath();
            ctx.moveTo(-25, 20);
            ctx.lineTo(-20, 20 + Math.random() * 15);
            ctx.lineTo(-15, 20);
            ctx.fill();
        }

        ctx.restore();
    }

    update() {
        if (this.equipment) {
            this.equipmentTime--;
            if (this.equipmentTime <= 0) {
                this.equipment = null;
                this.isInvincible = false;
            } else {
                if (this.equipment === 'propeller') this.vy = -15;
                if (this.equipment === 'jetpack') this.vy = -30;
            }
        }

        if (cloudActive > 0) {
            cloudActive--;
        }

        if (currentBiome === 'glacial_cave') {
            const accel = 0.4;
            const friction = 0.92;
            if (keys['ArrowLeft']) {
                this.vx -= accel;
                this.facingRight = false;
            } else if (keys['ArrowRight']) {
                this.vx += accel;
                this.facingRight = true;
            } else {
                this.vx *= friction;
            }
            if (this.vx > 8) this.vx = 8;
            if (this.vx < -8) this.vx = -8;
        } else {
            if (keys['ArrowLeft']) {
                this.vx = -5;
                this.facingRight = false;
            } else if (keys['ArrowRight']) {
                this.vx = 5;
                this.facingRight = true;
            } else {
                this.vx = 0;
            }
        }

        if (currentBiome === 'underwater') {
            underwaterTimer++;
            // Every 20s (1200 frames), current lasts for 4s (240 frames)
            let cycle = underwaterTimer % 1200;
            if (cycle < 240) {
                // Alternating direction every cycle
                let dir = (Math.floor(underwaterTimer / 1200) % 2 === 0) ? 1 : -1;
                this.x += dir * 1.5; // Current force
            }
        }

        this.x += this.vx;

        if (this.x + this.width < 0) {
            this.x = canvas.width;
        } else if (this.x > canvas.width) {
            this.x = -this.width;
        }

        this.vy += GRAVITY;
        this.y += this.vy;

        if (this.vy > 0 && !(this.equipment === 'propeller' || this.equipment === 'jetpack')) {
            platforms.forEach(platform => {
                if (
                    this.y + this.height >= platform.y &&
                    this.y + this.height <= platform.y + platform.height + this.vy &&
                    this.x + this.width > platform.x &&
                    this.x < platform.x + platform.width
                ) {
                    // Check if broken
                    if (platform.type === 'break' && platform.broken) return;

                    let jumpForce = JUMP_FORCE;

                    if (this.equipment === 'boots') {
                        jumpForce = JUMP_FORCE * 1.6;
                    }

                    if (platform.type === 'break') {
                        platform.broken = true;
                        // Play a sound or particles?
                    }

                    if (platform.item) {
                        if (platform.item === 'spring') {
                            this.vy = -20;
                        } else if (platform.item === 'propeller') {
                            this.equipment = 'propeller';
                            this.equipmentTime = 300;
                            this.isInvincible = true;
                            platform.item = null;
                        } else if (platform.item === 'jetpack') {
                            this.equipment = 'jetpack';
                            this.equipmentTime = 150;
                            this.isInvincible = true;
                            platform.item = null;
                        } else if (platform.item === 'boots') {
                            this.equipment = 'boots';
                            this.equipmentTime = 600;
                            this.isInvincible = false;
                            platform.item = null;
                            this.vy = jumpForce;
                        } else if (platform.item === 'saver') {
                            this.hasSaver = true;
                            platform.item = null;
                            this.vy = jumpForce;
                        } else if (platform.item === 'cloud') {
                            cloudActive = 600; // 10 seconds
                            platform.item = null;
                            this.vy = jumpForce;
                        } else {
                            this.vy = jumpForce;
                        }
                    } else {
                        this.vy = jumpForce;
                    }
                }
            });
        }

        // Cloud Strike Logic (Dream)
        if (cloudActive > 0 && this.y + this.height >= canvas.height - 20) {
            this.vy = -20; // Bounce like a spring
            this.y = canvas.height - 20 - this.height;
        }

        if (!this.isInvincible) {
            monsters.forEach((monster, index) => {
                if (
                    this.x < monster.x + monster.width &&
                    this.x + this.width > monster.x &&
                    this.y < monster.y + monster.height &&
                    this.y + this.height > monster.y
                ) {
                    if (this.vy > 0 && this.y + this.height < monster.y + monster.height / 2) {
                        monsters.splice(index, 1);
                        this.vy = JUMP_FORCE;
                    } else {
                        if (this.hasSaver) {
                            this.hasSaver = false;
                            this.vy = -20;
                            monsters.splice(index, 1);
                        } else {
                            gameOver();
                        }
                    }
                }
            });
        }
    }
}

class Platform {
    constructor(y) {
        this.width = PLATFORM_WIDTH;
        this.height = PLATFORM_HEIGHT;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = y;
        this.type = 'normal';
        this.item = null;
        this.broken = false;

        // Platform Types based on biome and score
        let movingChance = 0.05 + (score / 100000);
        if (movingChance > 0.4) movingChance = 0.4;

        let breakChance = 0.02 + (score / 50000); // Start small
        if (difficultyLevel > 5) breakChance += 0.05;
        if (breakChance > 0.25) breakChance = 0.25;

        // Space biome: less moving, maybe? Or more?
        // Underwater: more platforms, maybe less special ones?

        const r = Math.random();

        if (r < movingChance) {
            this.type = 'moving';
            this.vx = (Math.random() > 0.5 ? 2 : -2) * (1 + score / 500000);
        } else if (currentBiome === 'dream' && r < movingChance + 0.1) {
            this.type = 'v-moving';
            this.vy = (Math.random() > 0.5 ? 2 : -2);
            this.startY = y;
            this.rangeY = 50;
        } else if (r < movingChance + breakChance) {
            this.type = 'break';
        }

        if (this.type !== 'break' && Math.random() < 0.3) {
            const rItem = Math.random();
            if (rItem < 0.85) this.item = 'spring';
            else if (currentBiome === 'dream' && rItem < 0.92) this.item = 'cloud';
            else if (rItem < 0.94) this.item = 'propeller';
            else if (rItem < 0.96) this.item = 'jetpack';
            else if (rItem < 0.98) this.item = 'boots';
            else this.item = 'saver';
        }
    }

    draw() {
        if (this.broken) return; // Don't draw if broken (or maybe draw falling debris later)

        // Cyberpunk Flicker Logic
        if (currentBiome === 'cyberpunk') {
            // Flicker every 2 seconds for 0.4 seconds
            if ((Date.now() % 2000) > 1600) return;
        }

        if (this.type === 'moving') ctx.fillStyle = COLORS.platformMoving;
        else if (this.type === 'break') ctx.fillStyle = COLORS.platformBreak;
        else ctx.fillStyle = COLORS.platformNormal;

        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 5);
        ctx.fill();

        // Cracks for breaking platforms
        if (this.type === 'break') {
            ctx.strokeStyle = 'rgba(0,0,0,0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x + 10, this.y);
            ctx.lineTo(this.x + 20, this.y + 10);
            ctx.lineTo(this.x + 15, this.y + 15);

            ctx.moveTo(this.x + 40, this.y);
            ctx.lineTo(this.x + 35, this.y + 8);
            ctx.lineTo(this.x + 45, this.y + 15);
            ctx.stroke();
        }

        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(this.x + 5, this.y + 3, this.width - 10, this.height / 2);

        if (this.item === 'spring') {
            ctx.fillStyle = COLORS.spring;
            ctx.fillRect(this.x + 10, this.y - 10, 20, 10);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x + 10, this.y);
            ctx.lineTo(this.x + 15, this.y - 10);
            ctx.lineTo(this.x + 20, this.y);
            ctx.lineTo(this.x + 25, this.y - 10);
            ctx.lineTo(this.x + 30, this.y);
            ctx.stroke();
        } else if (this.item === 'propeller') {
            ctx.fillStyle = COLORS.propeller;
            ctx.fillRect(this.x + 15, this.y - 15, 20, 15);
            ctx.fillRect(this.x + 22, this.y - 20, 6, 5);
            ctx.fillRect(this.x + 10, this.y - 22, 30, 3);
        } else if (this.item === 'jetpack') {
            ctx.fillStyle = COLORS.jetpack;
            ctx.fillRect(this.x + 15, this.y - 25, 15, 25);
        } else if (this.item === 'boots') {
            ctx.fillStyle = COLORS.boots;
            ctx.fillRect(this.x + 10, this.y - 15, 10, 15);
            ctx.fillRect(this.x + 25, this.y - 15, 10, 15);
        } else if (this.item === 'saver') {
            ctx.fillStyle = COLORS.saver;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y - 15, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#fff';
            ctx.fillRect(this.x + this.width / 2 - 2, this.y - 20, 4, 10);
            ctx.fillRect(this.x + this.width / 2 - 5, this.y - 17, 10, 4);
        } else if (this.item === 'cloud') {
            ctx.fillStyle = COLORS.cloud;
            ctx.beginPath();
            ctx.arc(this.x + 15, this.y - 12, 10, 0, Math.PI * 2);
            ctx.arc(this.x + 30, this.y - 15, 12, 0, Math.PI * 2);
            ctx.arc(this.x + 45, this.y - 12, 10, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    update() {
        if (this.type === 'moving') {
            this.x += this.vx;
            if (currentBiome === 'dream') {
                if (this.x + this.width < 0) this.x = canvas.width;
                else if (this.x > canvas.width) this.x = -this.width;
            } else if (currentBiome === 'glacial_cave') {
                if (this.x <= 0 || this.x + this.width >= canvas.width) {
                    this.vx *= -1;
                }
            } else {
                if (this.x <= 0 || this.x + this.width >= canvas.width) {
                    this.vx *= -1;
                }
            }
        } else if (this.type === 'v-moving') {
            this.y += this.vy;
            if (this.y > this.startY + this.rangeY || this.y < this.startY - this.rangeY) {
                this.vy *= -1;
            }
        }
    }
}

class Meteor {
    constructor() {
        this.width = 60;
        this.height = 80;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -500; // Start way above
        this.vy = 12;
        this.timer = 600; // 10 seconds at 60fps
    }

    update() {
        if (this.timer > 0) {
            this.timer--;
        } else {
            this.y += this.vy;
        }
    }

    draw() {
        if (this.timer > 0) {
            // Draw Warning
            ctx.fillStyle = 'rgba(255, 0, 0, ' + (Math.sin(Date.now() / 100) * 0.5 + 0.5) + ')';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`METEOR IN ${Math.ceil(this.timer / 60)}s`, canvas.width / 2, 200);

            // Draw tracking line
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(this.x, 0, this.width, canvas.height);
            ctx.setLineDash([]);
        } else {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;

            // Tail/Flame
            const tailGrad = ctx.createLinearGradient(centerX, this.y + this.height, centerX, this.y - 120);
            tailGrad.addColorStop(0, 'rgba(255, 69, 0, 0.8)');
            tailGrad.addColorStop(0.5, 'rgba(255, 140, 0, 0.4)');
            tailGrad.addColorStop(1, 'rgba(255, 255, 0, 0)');

            ctx.fillStyle = tailGrad;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + 20);
            ctx.lineTo(this.x + this.width, this.y + 20);
            ctx.lineTo(centerX, this.y - 150);
            ctx.fill();

            // Asteroid Body
            ctx.fillStyle = '#5d5d5d';
            ctx.beginPath();
            ctx.roundRect(this.x, this.y, this.width, this.height, 20);
            ctx.fill();

            // Craters
            ctx.fillStyle = '#3d3d3d';
            const craterPositions = [
                { x: 15, y: 15, r: 8 },
                { x: 40, y: 25, r: 12 },
                { x: 20, y: 50, r: 10 },
                { x: 45, y: 60, r: 6 }
            ];
            craterPositions.forEach(c => {
                ctx.beginPath();
                ctx.arc(this.x + c.x, this.y + c.y, c.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // Glow
            ctx.strokeStyle = 'rgba(255, 100, 0, 0.5)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.roundRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10, 25);
            ctx.stroke();
        }
    }
}

class Icicle {
    constructor() {
        this.width = 15;
        this.height = 45;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -100;
        this.vy = 7 + Math.random() * 5;
    }

    update() {
        this.y += this.vy;
    }

    draw() {
        ctx.fillStyle = '#f0faff';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.fill();

        // Shine line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + 4, this.y + 5);
        ctx.lineTo(this.x + 4, this.y + this.height * 0.7);
        ctx.stroke();
    }
}


// Game Logic Functions

function showCoinPopup(amount) {
    coinPopAnim.innerText = `+${amount}`;
    coinPopAnim.classList.remove('hidden');

    // Restart animation
    coinPopAnim.style.animation = 'none';
    coinPopAnim.offsetHeight; /* trigger reflow */
    coinPopAnim.style.animation = 'coinHeaderAnim 1s ease-out forwards';
}

function initGame() {
    doodler = new Doodler();
    platforms = [];
    monsters = [];
    projectiles = [];
    score = 0;
    maxScore = 0;
    difficultyLevel = 1;
    runCoins = 0;
    lastCoinThreshold = 0;
    multiplier = 1.0;
    forestOffset = 0;
    meteors = [];
    icicles = [];
    cloudActive = 0;
    underwaterTimer = 0;

    // Apply Headstart
    const headStart = localStorage.getItem('doodleHeadStart');
    if (headStart) {
        if (headStart === 'saver') {
            doodler.hasSaver = true;
        } else if (headStart === 'boots') {
            doodler.equipment = 'boots';
            doodler.equipmentTime = 600;
        } else if (headStart === 'propeller') {
            doodler.equipment = 'propeller';
            doodler.equipmentTime = 300;
            doodler.isInvincible = true;
        } else if (headStart === 'jetpack') {
            doodler.equipment = 'jetpack';
            doodler.equipmentTime = 100; // Shorter than pickup? or same
            doodler.isInvincible = true;
        }

        // Consume it
        localStorage.removeItem('doodleHeadStart');
    }

    // Set Biome Settings
    const biome = BIOMES[currentBiome];
    GRAVITY = biome.gravity;
    JUMP_FORCE = biome.jumpForce;
    PLATFORM_COUNT = biome.platformCount;

    // Update Colors
    COLORS = {
        ...biome.colors,
        monster: '#a55eea',
        spring: '#fab1a0',
        propeller: '#0984e3',
        jetpack: '#e17055',
        projectile: '#d63031',
        saver: '#f1c40f',
        boots: '#8e44ad'
    };


    // Create initial platforms
    platforms = []; // Clear array
    for (let i = 0; i < PLATFORM_COUNT; i++) {
        let gap = canvas.height / PLATFORM_COUNT;
        let pY = canvas.height - 100 - i * gap;
        let p = new Platform(pY);
        if (i === 0) {
            p.x = canvas.width / 2 - PLATFORM_WIDTH / 2;
            p.type = 'normal';
            p.item = null;
        }
        platforms.push(p);
    }

    scoreDisplay.innerText = 0;
    scoreDisplay.classList.remove('hidden');
    difficultyContainer.classList.remove('hidden');
    startScreen.classList.remove('active');
    gameOverScreen.classList.add('hidden');
    gameOverScreen.classList.remove('active');

    gameState = 'PLAYING';
    gameLoop();
}

// Biome Selection Logic
document.querySelectorAll('.biome-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Update UI
        document.querySelectorAll('.biome-btn').forEach(b => b.classList.remove('selected'));
        e.target.classList.add('selected');

        // Update State
        currentBiome = e.target.dataset.biome;

        // Preview Colors?
        const biome = BIOMES[currentBiome];
        document.getElementById('game-container').style.background =
            `linear-gradient(to bottom, ${biome.colors.bgTop}, ${biome.colors.bgBottom})`;
    });
});


function gameOver() {
    gameState = 'GAMEOVER';
    cancelAnimationFrame(gameLoopId);

    finalScoreVal.innerText = maxScore;
    runCoinsVal.innerText = runCoins; // Update UI

    // Save Data
    if (maxScore > highScore) {
        highScore = maxScore;
        localStorage.setItem('doodleHighScore', highScore);
        highScoreVal.innerText = highScore;
    }

    // Add run coins to persistent storage
    coins += runCoins;
    localStorage.setItem('doodleCoins', coins);
    coinCountVal.innerText = coins;

    scoreDisplay.classList.add('hidden');
    difficultyContainer.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    setTimeout(() => gameOverScreen.classList.add('active'), 10);

    // Refresh Shop UI
    updateShopUI();
}

// Shop Costs Mapping
const ITEM_COSTS = {
    'propeller': 20,
    'jetpack': 60,
    'boots': 15,
    'saver': 100
    //'permanentjetpack': 100
};

// Shop Logic
function updateShopUI() {
    const activeHeadStart = localStorage.getItem('doodleHeadStart');
    document.querySelectorAll('.buy-btn').forEach(btn => {
        const item = btn.dataset.item;
        const cost = parseInt(btn.dataset.cost);

        // Reset state
        btn.classList.remove('owned');
        btn.disabled = false;
        btn.innerText = `${cost} Coins`;

        if (activeHeadStart === item) {
            btn.classList.add('owned');
            btn.innerText = "Equipped";
            // btn.disabled = true; // Optional
        }
    });
}

function toggleShop() {
    startScreen.classList.toggle('active');
    shopScreen.classList.toggle('hidden');
    shopScreen.classList.toggle('active');
    if (shopScreen.classList.contains('active')) {
        updateShopUI();
    }
}

shopBtn.addEventListener('click', toggleShop);
closeShopBtn.addEventListener('click', toggleShop);

// Buy Logic (One Consumable at a time)
document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const cost = parseInt(e.target.dataset.cost);
        const item = e.target.dataset.item;

        // If already equipped, do nothing
        if (e.target.classList.contains('owned')) return;

        // Calculate if we can afford it (including refund of current item)
        const currentItem = localStorage.getItem('doodleHeadStart');
        let refund = 0;
        if (currentItem && ITEM_COSTS[currentItem]) {
            refund = ITEM_COSTS[currentItem];
        }

        if (coins + refund >= cost) {
            // Apply Refund
            coins += refund;
            // Apply Cost
            coins -= cost;

            localStorage.setItem('doodleCoins', coins);
            coinCountVal.innerText = coins;

            // Set new headstart
            localStorage.setItem('doodleHeadStart', item);

            updateShopUI();
        } else {
            // Not enough coins visual feedback
            let oldText = e.target.innerText;
            e.target.innerText = "No Coins!";
            setTimeout(() => e.target.innerText = oldText, 1000);
        }
    });
});

function checkDifficulty() {
    const step = 2000;
    let progress = (maxScore % step) / step;

    // Calculate new difficulty level
    let newLevel = 1 + Math.floor(maxScore / step);

    if (newLevel > difficultyLevel) {
        difficultyLevel = newLevel;
        // Maybe trigger a "Level Up" UI effect?
    }

    // Multiplier Logic: 1.0 + (Level-1)*0.5 -> Level 1=1x, Level 2=1.5x, etc.
    multiplier = 1 + (difficultyLevel - 1) * 0.5;

    // Update UI
    difficultyFill.style.width = `${progress * 100}%`;
    difficultyLevelVal.innerText = `Lvl ${difficultyLevel}`;
    multiplierVal.innerText = multiplier.toFixed(1);
}

function updateCoins() {
    // Check if we passed a 1000 point threshold
    if (maxScore >= lastCoinThreshold + 1000) {
        // Calculate how many chunks of 1000 we passed (usually 1)
        let diff = maxScore - lastCoinThreshold;
        let coinsEarned = Math.floor(diff / 1000);

        lastCoinThreshold += coinsEarned * 1000;

        // Apply Multiplier
        let amount = Math.floor(coinsEarned * multiplier);
        if (amount < 1) amount = 1; // Safety

        runCoins += amount;
        showCoinPopup(amount);
    }
}

function update() {
    doodler.update();

    // Death Check
    if (doodler.y > canvas.height) {
        if (doodler.hasSaver) {
            // SAVER BOOST
            doodler.vy = -45; // Massive boost upwards
            doodler.hasSaver = false;
        } else {
            gameOver();
            return;
        }
    }

    // Camera / Scrolling Logic
    let threshold = canvas.height / 2;
    if (doodler.y < threshold) {
        let diff = threshold - doodler.y;
        doodler.y = threshold;
        platforms.forEach(p => {
            p.y += diff;
            if (p.type === 'v-moving') p.startY += diff;
        });
        monsters.forEach(m => m.y += diff);
        forestOffset += diff;
        score += Math.floor(diff);
        if (score > maxScore) maxScore = score;
        scoreDisplay.innerText = maxScore;

        // Update Difficulty
        checkDifficulty();
        updateCoins();
    }

    platforms.forEach(p => p.update());
    monsters.forEach(m => m.update());
    projectiles.forEach((p, index) => {
        p.update();
        if (p.y < 0) projectiles.splice(index, 1);
        else {
            monsters.forEach((m, mIndex) => {
                if (
                    p.x > m.x && p.x < m.x + m.width &&
                    p.y > m.y && p.y < m.y + m.height
                ) {
                    monsters.splice(mIndex, 1);
                    projectiles.splice(index, 1);
                }
            });
        }
    });



    platforms = platforms.filter(p => p.y < canvas.height && !p.broken);
    monsters = monsters.filter(m => m.y < canvas.height);

    while (platforms.length < PLATFORM_COUNT) {
        let highestP = platforms.reduce((prev, curr) => prev.y < curr.y ? prev : curr);
        let gap = 100 + Math.random() * 40;
        if (currentBiome === 'space') gap = 150 + Math.random() * 150;
        if (currentBiome === 'underwater') gap = 20 + Math.random() * 50;
        if (currentBiome === 'sun') gap = 50 + Math.random() * 50;
        if (currentBiome === 'dark_forest') gap = 120 + Math.random() * 60;

        let newY = highestP.y - gap;
        platforms.push(new Platform(newY));

        // Spawn monsters based on difficulty and biome
        let spawnRate = (0.05 + (difficultyLevel * 0.01)) * BIOMES[currentBiome].monsterSpawnMulti;
        if (Math.random() < spawnRate && score > 200) {
            monsters.push(new Monster(Math.random() * (canvas.width - 50), newY - 50));
        }
    }

    // Space Meteor Logic
    if (currentBiome === 'space' && meteors.length === 0 && Math.random() < 0.001) {
        meteors.push(new Meteor());
    }

    meteors.forEach((m, index) => {
        m.update();
        if (m.y > canvas.height) meteors.splice(index, 1);

        // Collision with Doodler
        if (m.timer <= 0) {
            if (
                doodler.x < m.x + m.width &&
                doodler.x + doodler.width > m.x &&
                doodler.y < m.y + m.height &&
                doodler.y + doodler.height > m.y
            ) {
                gameOver();
            }
        }
    });

    // Glacial Icicle Logic
    if (currentBiome === 'glacial_cave' && Math.random() < 0.006) {
        icicles.push(new Icicle());
    }

    icicles.forEach((i, index) => {
        i.update();
        if (i.y > canvas.height) icicles.splice(index, 1);

        // Collision with Doodler
        if (
            doodler.x < i.x + i.width &&
            doodler.x + doodler.width > i.x &&
            doodler.y < i.y + i.height &&
            doodler.y + doodler.height > i.y
        ) {
            gameOver();
        }
    });
}

function draw() {
    // Dynamic background
    const bg = BIOMES[currentBiome].colors;
    // Create gradient
    let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, bg.bgTop);
    grad.addColorStop(1, bg.bgBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (if needed, make it subtle)
    // ctx.strokeStyle = COLORS.bgGrid;
    // ...

    platforms.forEach(p => p.draw());

    // Environment Effects
    if (currentBiome === 'space') {
        ctx.fillStyle = 'white';
        for (let i = 0; i < 20; i++) {
            let x = (Math.sin(i * 1234.5) * 0.5 + 0.5) * canvas.width;
            let y = ((Math.cos(i * 5432.1) * 0.5 + 0.5) * canvas.height + Date.now() / 50) % canvas.height;
            let size = Math.random() * 2;
            ctx.fillRect(x, y, size, size);
        }
    } else if (currentBiome === 'underwater') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 15; i++) {
            let x = (Math.sin(i * 987.6) * 0.5 + 0.5) * canvas.width + Math.sin(Date.now() / 1000 + i) * 20;
            let y = ((Math.cos(i * 654.3) * 0.5 + 0.5) * canvas.height - Date.now() / 100) % canvas.height;
            if (y < 0) y += canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 5 + Math.sin(i) * 3, 0, Math.PI * 2);
            ctx.stroke();
        }
    } else if (currentBiome === 'sun') {
        // Heat embers
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        for (let i = 0; i < 20; i++) {
            let x = (Math.sin(i * 456.7) * 0.5 + 0.5) * canvas.width + Math.sin(Date.now() / 500 + i) * 10;
            let y = ((Math.cos(i * 123.4) * 0.5 + 0.5) * canvas.height - Date.now() / 30) % canvas.height;
            if (y < 0) y += canvas.height;
            let size = 2 + Math.random() * 4;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (currentBiome === 'dark_forest') {
        // Background layer trees (far away)
        ctx.fillStyle = 'rgba(5, 15, 5, 0.4)';
        for (let i = 0; i < 4; i++) {
            let x = 60 + (i * 100);
            let yPos = (forestOffset * 0.4 + i * 250) % (canvas.height + 400) - 200;
            ctx.fillRect(x, yPos, 15, 400);
        }
    } else if (currentBiome === 'cyberpunk') {
        // Neon grid lines
        ctx.strokeStyle = 'rgba(0, 242, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            let x = (i * canvas.width / 10);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
            let y = (i * canvas.height / 10 + Date.now() / 20) % canvas.height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Glitch Effect
        if (Math.random() < 0.05) {
            ctx.fillStyle = 'rgba(255, 0, 255, 0.2)';
            let gy = Math.random() * canvas.height;
            ctx.fillRect(0, gy, canvas.width, Math.random() * 10);
            ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
            ctx.fillRect(Math.random() * 20 - 10, gy + 5, canvas.width, 2);
        }
    } else if (currentBiome === 'glacial_cave') {
        // Cave Texture (Stalagmites/Stalactites static in background)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        for (let i = 0; i < canvas.width; i += 60) {
            // Stalactites (Top)
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i + 30, 0);
            ctx.lineTo(i + 15, 40 + Math.sin(i) * 20);
            ctx.fill();

            // Stalagmites (Bottom)
            ctx.beginPath();
            ctx.moveTo(i, canvas.height);
            ctx.lineTo(i + 30, canvas.height);
            ctx.lineTo(i + 15, canvas.height - (40 + Math.cos(i) * 20));
            ctx.fill();
        }

        // Snowflakes
        ctx.fillStyle = 'white';
        for (let i = 0; i < 20; i++) {
            let x = (Math.sin(i * 123) * 0.5 + 0.5) * canvas.width + Math.sin(Date.now() / 1000 + i) * 20;
            let y = (i * 50 + Date.now() / 10) % canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (currentBiome === 'dream') {
        // Soft floating clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 6; i++) {
            let x = (Math.sin(i * 999) * 0.5 + 0.5) * canvas.width + Math.sin(Date.now() / 2000 + i) * 50;
            let y = (i * 150 + Date.now() / 50) % canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI * 2);
            ctx.arc(x - 20, y + 10, 20, 0, Math.PI * 2);
            ctx.arc(x + 20, y + 10, 20, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    meteors.forEach(m => m.draw());
    icicles.forEach(i => i.draw());

    if (cloudActive > 0) {
        let y = canvas.height - 30;

        // Shadow/Base
        ctx.fillStyle = 'rgba(200, 230, 255, 0.4)';
        ctx.beginPath();
        for (let i = -20; i < canvas.width + 40; i += 50) {
            ctx.arc(i, y + 10, 30, 0, Math.PI * 2);
        }
        ctx.fill();

        // Main Cloud Stripe
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        for (let i = -20; i < canvas.width + 40; i += 40) {
            let floatY = Math.sin(Date.now() / 500 + i) * 5;
            ctx.arc(i, y + floatY, 25, 0, Math.PI * 2);
        }
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.beginPath();
        for (let i = -10; i < canvas.width + 40; i += 60) {
            let floatY = Math.sin(Date.now() / 500 + i) * 3;
            ctx.arc(i, y - 5 + floatY, 15, 0, Math.PI * 2);
        }
        ctx.fill();
    }

    monsters.forEach(m => m.draw());
    projectiles.forEach(p => p.draw());
    doodler.draw();

    // Foreground / Overlay Effects
    if (currentBiome === 'dark_forest') {
        // Side Trees (Trunks)
        ctx.fillStyle = '#050a05';
        ctx.fillRect(0, 0, 40, canvas.height);
        ctx.fillRect(canvas.width - 40, 0, 40, canvas.height);

        // Parallax Branches
        ctx.strokeStyle = '#050a05';
        ctx.lineCap = 'round';
        for (let i = -2; i < 8; i++) {
            let yBase = (forestOffset * 1.5 + i * 200) % (canvas.height + 400) - 200;

            // Left Branch
            ctx.lineWidth = 12;
            ctx.beginPath();
            ctx.moveTo(40, yBase);
            ctx.quadraticCurveTo(70, yBase + 10, 100 + Math.sin(i) * 30, yBase + 40);
            ctx.stroke();

            // Right Branch
            ctx.beginPath();
            ctx.moveTo(canvas.width - 40, yBase + 100);
            ctx.quadraticCurveTo(canvas.width - 70, yBase + 110, canvas.width - (100 + Math.cos(i) * 30), yBase + 140);
            ctx.stroke();
        }

        // Top Fog Overlay
        let fog = ctx.createLinearGradient(0, 0, 0, 300);
        fog.addColorStop(0, 'rgba(0, 10, 0, 1)');
        fog.addColorStop(0.4, 'rgba(0, 5, 0, 0.8)');
        fog.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = fog;
        ctx.fillRect(0, 0, canvas.width, 350);
    } else if (currentBiome === 'underwater') {
        // Deep Sea Fog
        let fog = ctx.createLinearGradient(0, 0, 0, 350);
        fog.addColorStop(0, 'rgba(0, 20, 50, 1)');
        fog.addColorStop(0.5, 'rgba(0, 40, 100, 0.8)');
        fog.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = fog;
        ctx.fillRect(0, 0, canvas.width, 400);

        // Warning for Current
        let cycle = underwaterTimer % 1200;
        if (cycle < 240) {
            ctx.fillStyle = 'rgba(255, 255, 255, ' + (Math.sin(Date.now() / 200) * 0.3 + 0.3) + ')';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            let dirText = (Math.floor(underwaterTimer / 1200) % 2 === 0) ? "RIGHT" : "LEFT";
            ctx.fillText(`⚠️ STRONG CURRENT: ${dirText}`, canvas.width / 2, 250);
        }
    }
}

function gameLoop() {
    if (gameState !== 'PLAYING') return;

    update();
    if (gameState === 'PLAYING') {
        draw();
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

// Event Listeners for UI
startBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', initGame);
homeBtn.addEventListener('click', () => {
    gameOverScreen.classList.remove('active');
    setTimeout(() => {
        gameOverScreen.classList.add('hidden');
        startScreen.classList.add('active');
    }, 300);
    gameState = 'MENU';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Initial Render
resize();
function attractMode() {
    if (gameState === 'MENU') {
        requestAnimationFrame(attractMode);
    }
}
attractMode();
