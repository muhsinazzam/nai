// Growing Garden Animation (Based on reference)
const canvas = document.getElementById('flower-canvas');
const ctx = canvas.getContext('2d');

let cw = canvas.width;
let ch = canvas.height;

// Resize handling
function resizeFlowerCanvas() {
    if (canvas.parentElement) {
        cw = canvas.width = canvas.parentElement.clientWidth;
        ch = canvas.height = canvas.parentElement.clientHeight;
    }
}

// Helper: Random Range
const random = (min, max) => Math.random() * (max - min) + min;

// --- classes ---

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Branch {
    constructor(x, y, angle, depth, maxDepth) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.depth = depth;
        this.maxDepth = maxDepth;
        this.len = 0;
        this.maxLen = random(10, 20); // Length of segment
        this.speed = 0.5;
        this.thickness = (maxDepth - depth) * 0.8 + 1;
        this.finished = false;
        this.shrunk = false;

        // Color: Cyan/Neon Blue to match reference
        this.color = `hsl(${180 + random(-10, 10)}, 100%, 70%)`; // Cyan

        this.child = null;
        this.flower = null;
        this.leaves = [];
    }

    update() {
        if (this.len < this.maxLen) {
            this.len += this.speed;
        } else if (!this.finished) {
            this.finished = true;

            // Spawn next branch or flower
            if (this.depth < this.maxDepth) {
                // Chance to split? For now just straight growth with wiggle
                let nextX = this.x + Math.cos(this.angle) * this.maxLen;
                let nextY = this.y + Math.sin(this.angle) * this.maxLen;
                let wiggle = random(-0.3, 0.3);

                this.child = new Branch(nextX, nextY, this.angle + wiggle, this.depth + 1, this.maxDepth);

                // Add Leaves occasionally
                if (Math.random() < 0.4) {
                    this.leaves.push(new Leaf(nextX, nextY, this.angle + Math.PI / 4));
                }
                if (Math.random() < 0.4) {
                    this.leaves.push(new Leaf(nextX, nextY, this.angle - Math.PI / 4));
                }

            } else {
                // Bloom Flower at tip
                let tipX = this.x + Math.cos(this.angle) * this.maxLen;
                let tipY = this.y + Math.sin(this.angle) * this.maxLen;
                this.flower = new Flower(tipX, tipY);
            }
        }

        if (this.child) this.child.update();
        if (this.flower) this.flower.update();
        this.leaves.forEach(l => l.update());
    }

    draw(ctx) {
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);

        let endX = this.x + Math.cos(this.angle) * this.len;
        let endY = this.y + Math.sin(this.angle) * this.len;

        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();

        this.leaves.forEach(l => l.draw(ctx));
        if (this.child) this.child.draw(ctx);
        if (this.flower) this.flower.draw(ctx);
    }
}

class Leaf {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.len = 0;
        this.maxLen = random(8, 15); // Longer leaves
        this.growth = 0.3;
        this.color = 'rgba(255, 105, 180, 0.7)'; // Pink semi-transparent
    }
    update() {
        if (this.len < this.maxLen) this.len += this.growth;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'pink';
        ctx.fillStyle = this.color;

        ctx.beginPath();
        // Pointed Oval Leaf
        ctx.ellipse(this.len / 2, 0, this.len / 2, this.len / 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Flower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 0;
        this.maxSize = random(12, 18);
        this.growth = 0.2;
        this.petals = 5;
        this.color = '#ff69b4'; // Pink
        this.centerColor = '#FFFFE0'; // Light Yellow
    }
    update() {
        if (this.size < this.maxSize) this.size += this.growth;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;

        // Petals (Glowing Pink)
        ctx.fillStyle = this.color;
        for (let i = 0; i < this.petals; i++) {
            ctx.rotate(Math.PI * 2 / this.petals);
            ctx.beginPath();
            // Rounded petals
            ctx.ellipse(0, this.size / 1.5, this.size / 3, this.size, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Center (Glowing Yellow)
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'yellow';
        ctx.fillStyle = this.centerColor;
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

class Grass {
    constructor(x, y, angle, len) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.maxLen = len;
        this.len = 0;
        this.color = 'hsl(330, 80%, 60%)'; // Pinkish/Purple grass
    }
    update() {
        if (this.len < this.maxLen) this.len += 0.5;
    }
    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        // Curve
        let cX = this.x + Math.cos(this.angle) * (this.len / 2);
        let cY = this.y + Math.sin(this.angle) * (this.len / 2);
        ctx.quadraticCurveTo(cX - 10, cY, this.x + Math.cos(this.angle) * this.len, this.y + Math.sin(this.angle) * this.len);
        ctx.stroke();
        ctx.restore();
    }
}

// Manager
let stems = [];
let grasses = [];

function startGrowing() {
    resizeFlowerCanvas();
    stems = [];
    grasses = [];
    ctx.clearRect(0, 0, cw, ch);

    // Create 3 stems (Cyan)
    stems.push(new Branch(cw / 2, ch, -Math.PI / 2, 0, 12)); // Center
    stems.push(new Branch(cw / 2 - 30, ch, -Math.PI / 2 - 0.2, 0, 10)); // Left
    stems.push(new Branch(cw / 2 + 30, ch, -Math.PI / 2 + 0.2, 0, 10)); // Right

    // Add Grass (Pink)
    for (let i = 0; i < 6; i++) {
        let x = cw / 2 + random(-60, 60);
        let ang = -Math.PI / 2 + random(-0.5, 0.5);
        let len = random(30, 60);
        grasses.push(new Grass(x, ch, ang, len));
    }

    animate();
}

function animate() {
    ctx.clearRect(0, 0, cw, ch);

    grasses.forEach(g => {
        g.update();
        g.draw(ctx);
    });

    stems.forEach(stem => {
        stem.update();
        stem.draw(ctx);
    });

    requestAnimationFrame(animate);
}

// Export
window.startFlower = startGrowing;
