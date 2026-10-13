
/* ==========================================
   Assignment 9 - Laser Security System
   COP4813 Web Systems
========================================== */

const canvas = document.getElementById("laserCanvas");
const ctx = canvas.getContext("2d");

const message = document.getElementById("laserMessage");
const targetStatus = document.getElementById("targetStatus");
const resetButton = document.getElementById("resetButton");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// ------------------------------------------
// Target settings
// ------------------------------------------

const target = {
    x: 650,
    y: 320,
    radius: 11,
    dx: 2.2,
    dy: -1.6
};

// ------------------------------------------
// Laser source
// ------------------------------------------

const laserSource = {
    x: 35,
    y: 225
};

// ------------------------------------------
// Mirrors
// ------------------------------------------

function createMirrors() {
    return [
        { x: 250, y: 145, angle: Math.PI / 4, length: 65 },
        { x: 430, y: 280, angle: -Math.PI / 4, length: 65 },
        { x: 610, y: 130, angle: Math.PI / 4, length: 65 }
    ];
}

let mirrors = createMirrors();

// ------------------------------------------
// Draw the security chamber
// ------------------------------------------

function drawBackground() {
    ctx.fillStyle = "#080d18";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Background grid
    ctx.strokeStyle = "rgba(40, 130, 170, 0.13)";
    ctx.lineWidth = 1;

    for (let x = 0; x <= WIDTH; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
    }

    for (let y = 0; y <= HEIGHT; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
    }

    // Chamber boundary
    ctx.strokeStyle = "#24506a";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, WIDTH - 4, HEIGHT - 4);
}

// ------------------------------------------
// Get the endpoints of a mirror
// ------------------------------------------

function getMirrorEnds(mirror) {
    const half = mirror.length / 2;
    const dx = Math.cos(mirror.angle) * half;
    const dy = Math.sin(mirror.angle) * half;

    return {
        x1: mirror.x - dx,
        y1: mirror.y - dy,
        x2: mirror.x + dx,
        y2: mirror.y + dy
    };
}

// ------------------------------------------
// Draw the mirrors
// ------------------------------------------

function drawMirrors() {
    mirrors.forEach(function(mirror) {
        const ends = getMirrorEnds(mirror);

        ctx.save();

        // Outer cyan glow
        ctx.beginPath();
        ctx.moveTo(ends.x1, ends.y1);
        ctx.lineTo(ends.x2, ends.y2);
        ctx.strokeStyle = "rgba(0, 220, 255, 0.25)";
        ctx.lineWidth = 15;
        ctx.shadowColor = "#00d9ff";
        ctx.shadowBlur = 14;
        ctx.stroke();

        // Bright mirror surface
        ctx.beginPath();
        ctx.moveTo(ends.x1, ends.y1);
        ctx.lineTo(ends.x2, ends.y2);
        ctx.strokeStyle = "#56e6ff";
        ctx.lineWidth = 5;
        ctx.shadowBlur = 5;
        ctx.stroke();

        // Mirror center
        ctx.beginPath();
        ctx.arc(mirror.x, mirror.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.restore();
    });
}

// ------------------------------------------
// Find where a laser ray hits a mirror
// ------------------------------------------

function findMirrorIntersection(ox, oy, dx, dy, mirror) {
    const ends = getMirrorEnds(mirror);

    const sx = ends.x2 - ends.x1;
    const sy = ends.y2 - ends.y1;

    const denominator = dx * sy - dy * sx;

    if (Math.abs(denominator) < 0.000001) {
        return null;
    }

    const differenceX = ends.x1 - ox;
    const differenceY = ends.y1 - oy;

    const t = (differenceX * sy - differenceY * sx) / denominator;
    const u = (differenceX * dy - differenceY * dx) / denominator;

    if (t > 0.01 && u >= 0 && u <= 1) {
        return {
            x: ox + t * dx,
            y: oy + t * dy,
            distance: t
        };
    }

    return null;
}

// ------------------------------------------
// Find the nearest chamber wall
// ------------------------------------------

function findWallIntersection(ox, oy, dx, dy) {
    const candidates = [];

    if (dx > 0) {
        candidates.push((WIDTH - 4 - ox) / dx);
    } else if (dx < 0) {
        candidates.push((4 - ox) / dx);
    }

    if (dy > 0) {
        candidates.push((HEIGHT - 4 - oy) / dy);
    } else if (dy < 0) {
        candidates.push((4 - oy) / dy);
    }

    const distances = candidates.filter(function(distance) {
        return distance > 0.01;
    });

    if (distances.length === 0) {
        return null;
    }

    const distance = Math.min(...distances);

    return {
        x: ox + distance * dx,
        y: oy + distance * dy,
        distance: distance
    };
}

// ------------------------------------------
// Draw a glowing laser beam
// ------------------------------------------

function drawLaserSegment(x1, y1, x2, y2) {
    ctx.save();

    // Outer glow
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "rgba(255, 30, 75, 0.25)";
    ctx.lineWidth = 12;
    ctx.shadowColor = "#ff1744";
    ctx.shadowBlur = 16;
    ctx.stroke();

    // Main laser beam
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "#ff3158";
    ctx.lineWidth = 3;
    ctx.shadowBlur = 8;
    ctx.stroke();

    ctx.restore();
}

// ------------------------------------------
// Calculate and draw reflected laser beams
// ------------------------------------------

function drawLaserPath() {
    let ox = laserSource.x;
    let oy = laserSource.y;

    // Initial laser direction: horizontally right
    let dx = 1;
    let dy = 0;

    // Limit reflections to avoid an endless loop
    for (let bounce = 0; bounce < 10; bounce++) {
        const wallHit = findWallIntersection(ox, oy, dx, dy);

        if (!wallHit) {
            break;
        }

        let nearestHit = null;
        let hitMirror = null;

        mirrors.forEach(function(mirror) {
            const hit = findMirrorIntersection(
                ox, oy, dx, dy, mirror
            );

            if (hit && (!nearestHit ||
                hit.distance < nearestHit.distance)) {
                nearestHit = hit;
                hitMirror = mirror;
            }
        });

        // If no mirror is hit before the wall, stop at the wall
        if (!nearestHit ||
            nearestHit.distance >= wallHit.distance) {
            drawLaserSegment(ox, oy, wallHit.x, wallHit.y);
            break;
        }

        // Draw the beam up to the mirror
        drawLaserSegment(ox, oy, nearestHit.x, nearestHit.y);

        // Reflect the laser using the mirror's surface normal
        const normalX = -Math.sin(hitMirror.angle);
        const normalY = Math.cos(hitMirror.angle);

        const dot = dx * normalX + dy * normalY;

        dx = dx - 2 * dot * normalX;
        dy = dy - 2 * dot * normalY;

        // Normalize the direction
        const magnitude = Math.hypot(dx, dy);

        dx /= magnitude;
        dy /= magnitude;

        // Move a tiny distance beyond the mirror to avoid
        // detecting the same intersection again
        ox = nearestHit.x + dx * 0.5;
        oy = nearestHit.y + dy * 0.5;
    }
}

// ------------------------------------------
// Draw the laser emitter
// ------------------------------------------

function drawEmitter() {
    ctx.save();

    ctx.beginPath();
    ctx.arc(
        laserSource.x,
        laserSource.y,
        13,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ff3158";
    ctx.shadowColor = "#ff1744";
    ctx.shadowBlur = 18;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(
        laserSource.x,
        laserSource.y,
        5,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.restore();
}

// ------------------------------------------
// Move the target and bounce off the walls
// ------------------------------------------

function moveTarget() {
    target.x += target.dx;
    target.y += target.dy;

    // Bounce horizontally
    if (target.x + target.radius >= WIDTH - 5) {
        target.x = WIDTH - target.radius - 5;
        target.dx = -Math.abs(target.dx);
    } else if (target.x - target.radius <= 5) {
        target.x = target.radius + 5;
        target.dx = Math.abs(target.dx);
    }

    // Bounce vertically
    if (target.y + target.radius >= HEIGHT - 5) {
        target.y = HEIGHT - target.radius - 5;
        target.dy = -Math.abs(target.dy);
    } else if (target.y - target.radius <= 5) {
        target.y = target.radius + 5;
        target.dy = Math.abs(target.dy);
    }
}

// ------------------------------------------
// Draw the moving target
// ------------------------------------------

function drawTarget() {
    ctx.save();

    // Outer target ring
    ctx.beginPath();
    ctx.arc(
        target.x,
        target.y,
        target.radius + 7,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle = "rgba(255, 49, 88, 0.45)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Target body
    ctx.beginPath();
    ctx.arc(
        target.x,
        target.y,
        target.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ff3158";
    ctx.shadowColor = "#ff1744";
    ctx.shadowBlur = 18;
    ctx.fill();

    // Target center
    ctx.beginPath();
    ctx.arc(
        target.x,
        target.y,
        3,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.restore();
}

// ------------------------------------------
// Main animation loop
// ------------------------------------------

function animate() {
    drawBackground();
    drawLaserPath();
    drawEmitter();
    drawMirrors();
    drawTarget();

    moveTarget();

    requestAnimationFrame(animate);
}

// ------------------------------------------
// Mouse-click interaction
// ------------------------------------------

canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();

    // Convert browser coordinates to canvas coordinates
    const mouseX = (event.clientX - rect.left) *
        (canvas.width / rect.width);

    const mouseY = (event.clientY - rect.top) *
        (canvas.height / rect.height);

    let selectedMirror = null;

    mirrors.forEach(function(mirror) {
        const ends = getMirrorEnds(mirror);

        // Find the closest point on the mirror segment
        const vx = ends.x2 - ends.x1;
        const vy = ends.y2 - ends.y1;

        const lengthSquared = vx * vx + vy * vy;

        let t = (
            (mouseX - ends.x1) * vx +
            (mouseY - ends.y1) * vy
        ) / lengthSquared;

        t = Math.max(0, Math.min(1, t));

        const closestX = ends.x1 + t * vx;
        const closestY = ends.y1 + t * vy;

        const distance = Math.hypot(
            mouseX - closestX,
            mouseY - closestY
        );

        if (distance < 15) {
            selectedMirror = mirror;
        }
    });

    if (selectedMirror) {
        // Rotate mirror 45 degrees
        selectedMirror.angle += Math.PI / 4;

        message.textContent =
            "MIRROR ROTATED - LASER PATH UPDATED";

        targetStatus.textContent = "MIRROR ADJUSTED";
    } else {
        message.textContent =
            "CLICK A CYAN MIRROR TO REDIRECT THE LASER";
    }
});

// ------------------------------------------
// Reset the system
// ------------------------------------------

resetButton.addEventListener("click", function() {
    mirrors = createMirrors();

    target.x = 650;
    target.y = 320;
    target.dx = 2.2;
    target.dy = -1.6;

    message.textContent =
        "SYSTEM RESET - SECURITY CHAMBER ONLINE";

    targetStatus.textContent = "TARGET SCANNING";
});

// ------------------------------------------
// Start the animation
// ------------------------------------------

animate();
