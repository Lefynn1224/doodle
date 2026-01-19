:root {
    --bg-color: #fcfcfc;
    --grid-line: #e0e0e0;
    --primary-color: #6bcf63;
    /* Doodler Green */
    --accent-color: #ff4757;
    --text-color: #2d3436;
    --font-hand: 'Patrick Hand', cursive;
    --font-ui: 'Inter', sans-serif;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    user-select: none;
}

body {
    background-color: #2c3e50;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: var(--font-ui);
    overflow: hidden;
}

#app {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

#game-container {
    position: relative;
    width: 400px;
    /* Classic mobile aspect ratio width */
    height: 100vh;
    max-height: 700px;
    background-color: var(--bg-color);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    overflow: hidden;

    /* Graph Paper Effect */
    background-image:
        linear-gradient(var(--grid-line) 1px, transparent 1px),
        linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
    background-size: 20px 20px;
}

canvas {
    display: block;
    width: 100%;
    height: 100%;
    cursor: crosshair;
    will-change: transform;
}

#ui-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    /* Let clicks pass through to canvas if needed, but screens catch them */
}

.screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(252, 252, 252, 0.85);
    /* Glassy backdrop */
    backdrop-filter: blur(5px);
    transition: opacity 0.3s ease;
    opacity: 0;
    pointer-events: none;
}

.screen.active {
    opacity: 1;
    pointer-events: auto;
}

.hidden {
    display: none !important;
    /* Helper to fully hide if needed */
}

/* Typography */
h1.title {
    font-family: var(--font-hand);
    font-size: 3.5rem;
    color: var(--text-color);
    line-height: 1;
    text-align: center;
    margin-bottom: 20px;
    transform: rotate(-5deg);
    text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
}

h2 {
    font-family: var(--font-hand);
    font-size: 3rem;
    color: var(--accent-color);
    margin-bottom: 20px;
}

/* Buttons */
button {
    font-family: var(--font-hand);
    font-size: 1.5rem;
    padding: 10px 30px;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s;
    margin: 10px;
    text-transform: uppercase;
    font-weight: bold;
    letter-spacing: 1px;
}

.primary-btn {
    background-color: var(--primary-color);
    color: white;
    box-shadow: 0 4px 0 #58b050;
    /* Button 3D effect */
}

.primary-btn:active {
    transform: translateY(4px);
    box-shadow: 0 0 0 #58b050;
}

.secondary-btn {
    background-color: #dfe6e9;
    color: var(--text-color);
    box-shadow: 0 4px 0 #b2bec3;
}

.secondary-btn:active {
    transform: translateY(4px);
    box-shadow: 0 0 0 #b2bec3;
}

/* Score */
#score-display {
    position: absolute;
    top: 20px;
    left: 20px;
    font-family: var(--font-hand);
    font-size: 2rem;
    font-weight: bold;
    color: var(--text-color);
    background: rgba(255, 255, 255, 0.8);
    padding: 5px 15px;
    border-radius: 20px;
    display: block;
    /* Overrides hidden if removed class */
}

#score-display.hidden {
    display: none;
}

/* Difficulty Bar */
#difficulty-container {
    position: absolute;
    top: 70px;
    /* Below score */
    left: 20px;
    width: 150px;
    background: rgba(255, 255, 255, 0.8);
    padding: 8px 12px;
    border-radius: 12px;
    font-family: var(--font-ui);
    display: flex;
    flex-direction: column;
    gap: 4px;
}

#difficulty-container.hidden {
    display: none !important;
}

#difficulty-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

#difficulty-bar-bg {
    width: 100%;
    height: 8px;
    background: #dfe6e9;
    border-radius: 4px;
    overflow: hidden;
}

#difficulty-bar-fill {
    width: 0%;
    height: 100%;
    background: var(--accent-color);
    transition: width 0.3s ease;
}

#currency-display {
    position: absolute;
    top: 20px;
    right: 20px;
    font-family: var(--font-hand);
    font-size: 1.5rem;
    font-weight: bold;
    color: #f1c40f;
    background: rgba(255, 255, 255, 0.8);
    padding: 5px 15px;
    border-radius: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

#coin-pop-anim {
    color: #2ecc71;
    /* Green */
    font-weight: 800;
    margin-left: 8px;
    display: inline-block;
    opacity: 0;
}

@keyframes coinHeaderAnim {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }

    10% {
        opacity: 1;
        transform: translateY(0);
    }

    80% {
        opacity: 1;
        transform: translateY(0);
    }

    100% {
        opacity: 0;
        transform: translateY(-10px);
    }
}

/* Back Button Style */
.back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    background: white;
    color: var(--text-color);
    border: 3px solid #ddd;
    border-radius: 15px;
    padding: 8px 15px;
    font-family: var(--font-hand);
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 0 #ccc;
    transition: all 0.1s;
    z-index: 1000;
}

.back-btn:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 6px 0 #ccc;
}

.back-btn:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #ccc;
}

#shop-screen,
#wardrobe-screen {
    justify-content: flex-start;
    padding-top: 80px;
    padding-bottom: 40px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--primary-color) #f0f0f0;
}

#shop-screen::-webkit-scrollbar,
#wardrobe-screen::-webkit-scrollbar {
    width: 6px;
}

#shop-screen::-webkit-scrollbar-thumb,
#wardrobe-screen::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 10px;
}

#wardrobe-items-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    width: 95%;
    padding: 10px;
}

.char-card {
    background: white;
    padding: 15px;
    border-radius: 20px;
    border: 3px solid #ddd;
    box-shadow: 0 6px 0 #ccc;
    width: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.char-card.selected {
    border-color: var(--primary-color);
    box-shadow: 0 8px 0 #58b050;
    transform: scale(1.05);
}

.char-card.locked {
    filter: grayscale(1);
    opacity: 0.7;
}

.char-preview-box {
    width: 80px;
    height: 80px;
    background: #f8f9fa;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed #ddd;
    position: relative;
    overflow: hidden;
}

.char-name {
    font-family: var(--font-hand);
    font-size: 1.4rem;
    color: var(--text-color);
    font-weight: bold;
}

.char-ability {
    font-size: 0.75rem;
    color: #636e72;
    text-align: center;
    font-weight: 600;
}

.char-buy-btn {
    font-family: var(--font-ui);
    padding: 6px 15px;
    font-size: 0.9rem;
    background: #f1c40f;
    color: #000;
    box-shadow: 0 3px 0 #b7950b;
    border-radius: 15px;
    width: 100%;
    margin: 0;
}

.char-buy-btn.equipped {
    background: var(--primary-color);
    color: white;
    box-shadow: 0 3px 0 #4a9e43;
    pointer-events: none;
}

/* Difficulty UI Updates */
#difficulty-container {
    height: auto;
    gap: 2px;
}

#difficulty-level-val {
    font-size: 0.9rem;
    font-weight: 800;
    color: var(--accent-color);
}

#multiplier-display {
    font-size: 0.7rem;
    text-align: right;
    color: #636e72;
    font-weight: 600;
}

/* Shop Styles */
#shop-items-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    width: 90%;
    margin-bottom: 30px;
}

.shop-item {
    background: #fff;
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 120px;
}

.shop-item span {
    font-weight: bold;
    color: var(--text-color);
}

.buy-btn {
    font-family: var(--font-ui);
    padding: 5px 12px;
    font-size: 0.9rem;
    background: #f1c40f;
    color: #000;
    box-shadow: 0 3px 0 #b7950b;
    margin: 0;
}

.buy-btn:active {
    transform: translateY(3px);
    box-shadow: none;
}

.buy-btn.owned {
    background: #bdc3c7;
    box-shadow: none;
    cursor: default;
    color: #ecf0f1;
}

.run-coins {
    font-family: var(--font-ui);
    font-size: 1.2rem;
    color: #f1c40f;
    margin-bottom: 10px;
    font-weight: 800;
    background: rgba(0, 0, 0, 0.5);
    padding: 5px 15px;
    border-radius: 15px;
}



/* Biome Selector */
#biome-selector {
    margin-top: 15px;
    text-align: center;
    width: 100%;
}

#biome-selector h3 {
    font-family: var(--font-hand);
    color: var(--text-color);
    margin-bottom: 8px;
    font-size: 1.3rem;
    text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
}

.biome-wheel-container {
    padding: 20px 0;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -ms-overflow-style: none;
    width: 100%;
    margin: 0 auto;
    position: relative;
    cursor: grab;
    /* Masking gradient for scroll hints */
    -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}

.biome-wheel-container:active {
    cursor: grabbing;
}

.biome-wheel-container::-webkit-scrollbar {
    display: none;
}

.biome-wheel {
    display: flex;
    gap: 20px;
    padding: 0 50%;
    /* Allows starting item to be centered exactly */
    transform: translateX(-50px);
    /* Offset half card width to center first item */
}

.biome-card {
    flex: 0 0 100px;
    height: 130px;
    background: #fff;
    border: 3px solid #ddd;
    border-radius: 20px;
    cursor: pointer;
    font-family: var(--font-hand);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    scroll-snap-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 0 #ccc;
    position: relative;
}

.biome-card.selected {
    background: var(--primary-color) !important;
    color: #fff !important;
    border-color: #58b050 !important;
    box-shadow: 0 8px 0 #4a9e43 !important;
    transform: scale(1.1);
}

.biome-card.locked {
    background: #dfe6e9 !important;
    color: #636e72 !important;
    border-color: #b2bec3 !important;
    box-shadow: 0 6px 0 #95a5a6 !important;
}

.biome-name {
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
}

.biome-reqs {
    font-size: 0.7rem;
    font-family: var(--font-ui);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    margin-top: 5px;
}

.biome-lock {
    position: absolute;
    top: -10px;
    right: -10px;
    background: #ff4757;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.8rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Extra Actions */
.main-menu-btns {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.extra-actions {
    margin-top: 10px;
}

.icon-btn {
    background: #34495e;
    color: white;
    padding: 8px 15px;
    font-size: 1.1rem;
    border-radius: 15px;
    box-shadow: 0 4px 0 #2c3e50;
}

.icon-btn:active {
    transform: translateY(4px);
    box-shadow: none;
}

/* Shop Category Headers */
.shop-category {
    width: 100%;
    font-family: var(--font-hand);
    color: var(--text-color);
    font-size: 1.8rem;
    margin: 20px 0 10px 0;
    text-align: center;
    border-bottom: 2px dashed #ccc;
    padding-bottom: 5px;
}

/* Upgrade Item Specifics */
.shop-item .item-info {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.item-level {
    font-size: 0.8rem;
    color: var(--primary-color);
    font-weight: 800;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.item-bonus {
    font-size: 0.65rem;
    color: #636e72;
    font-weight: 600;
    margin-top: 2px;
}

.upgrade-btn {
    font-family: var(--font-ui);
    padding: 6px 12px;
    font-size: 0.85rem;
    background: #3498db;
    color: #fff;
    box-shadow: 0 3px 0 #2980b9;
    margin: 0;
    border-radius: 15px;
}

.upgrade-btn:active {
    transform: translateY(3px);
    box-shadow: none;
}

.upgrade-btn.maxed {
    background: #27ae60;
    box-shadow: none;
    cursor: default;
}

/* Biome Requirement Tooltip / Hint Style (Dynamic) */
.biome-btn.locked::after {
    content: attr(data-hint);
    position: absolute;
    bottom: 110%;
    left: 50%;
    transform: translateX(-50%);
    background: #2d3436;
    color: white;
    padding: 5px 10px;
    border-radius: 8px;
    font-size: 0.7rem;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
    z-index: 100;
}

.biome-btn.locked:hover::after {
    opacity: 1;
}
