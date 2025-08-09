const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const PADDLE_MARGIN = 10;
const PLAYER_COLOR = '#4CAF50';
const AI_COLOR = '#F44336';
const BALL_COLOR = '#FFD600';
const NET_COLOR = '#fff';

// Game objects
const player = {
    x: PADDLE_MARGIN,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: PLAYER_COLOR
};

const ai = {
    x: canvas.width - PADDLE_WIDTH - PADDLE_MARGIN,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: AI_COLOR,
    speed: 4
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: BALL_RADIUS,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: BALL_COLOR
};

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    for (let i = 0; i < canvas.height; i += 25) {
        drawRect(canvas.width / 2 - 1, i, 2, 15, NET_COLOR);
    }
}

// Render everything
function render() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, '#222');

    // Draw net
    drawNet();

    // Draw paddles and ball
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Update game logic
function update() {
    // Move ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Ball collision with top/bottom
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    // Ball collision with player paddle
    if (collides(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);
        let angle = collidePoint * Math.PI / 4;
        let direction = 1;
        ball.velocityX = direction * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);
        ball.speed += 0.2;
    }

    // Ball collision with AI paddle
    if (collides(ball, ai)) {
        let collidePoint = (ball.y - (ai.y + ai.height / 2));
        collidePoint = collidePoint / (ai.height / 2);
        let angle = collidePoint * Math.PI / 4;
        let direction = -1;
        ball.velocityX = direction * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);
        ball.speed += 0.2;
    }

    // Reset ball if out of bounds
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        resetBall();
    }

    // AI movement (simple tracking)
    let aiCenter = ai.y + ai.height / 2;
    if (ball.y < aiCenter - 20) {
        ai.y -= ai.speed;
    } else if (ball.y > aiCenter + 20) {
        ai.y += ai.speed;
    }
    // Limit AI paddle within canvas
    ai.y = Math.max(0, Math.min(canvas.height - ai.height, ai.y));
}

// Collision detection
function collides(ball, paddle) {
    return (
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.x + ball.radius > paddle.x &&
        ball.y + ball.radius > paddle.y &&
        ball.y - ball.radius < paddle.y + paddle.height
    );
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    // Ball goes in opposite direction
    ball.velocityX = -ball.velocityX;
    ball.velocityY = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
}

// Player paddle follows mouse
canvas.addEventListener('mousemove', function(evt) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    // Constrain within canvas
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
});

// Game loop
function game() {
    update();
    render();
    requestAnimationFrame(game);
}

// Start game
game();
