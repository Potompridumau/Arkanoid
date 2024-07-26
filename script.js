const CANVAS_NODE = document.querySelector('#arkanoid'),
    CTX = CANVAS_NODE.getContext('2d'),
    BALL_RADIUS = 10,
    PADDLE_WIDTH = 75,
    PADDLE_HEIGHT = 10,
    BRICK_ROW_COUNT = 5,
    BRICK_COLUMN_COUNT = 3,
    BRICK_WIDTH = 75,
    BRICK_HEIGHT = 20,
    BRICK_PADDING = 10,
    BRICK_OFFSET = 30;

let ballX = CANVAS_NODE.width / 2,
    ballY = CANVAS_NODE.height - 30,
    dx = 2,
    dy = -2,
    paddleX = (CANVAS_NODE.width - PADDLE_WIDTH) / 2,
    score = 0,
    lives = 3;

const bricks = []

CTX.fillStyle = '#0095dd';
CTX.font = '16px Arial';

for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
    bricks[c] = [];

    for (let r = 0; r < BRICK_ROW_COUNT; r++) { // проходимся по элементам внутри строк
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1
        }
    }
}

function drawBall() {
    CTX.beginPath();
    CTX.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    CTX.fill();
    CTX.closePath();
}

function drawPaddle() {
    CTX.beginPath();
    CTX.rect(paddleX, CANVAS_NODE.height - PADDLE_HEIGHT,
        PADDLE_WIDTH,
        PADDLE_HEIGHT); // создаем прямоугольник
    CTX.fill();
    CTX.closePath();
}

function drawBricks() {
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
            if (bricks[c][r].status === 1) { // выводим кирпичи со статусом 1

                const BRICK_X = r * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET;
                const BRICK_Y = c * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET;

                bricks[c][r].x = BRICK_X;
                bricks[c][r].y = BRICK_Y;

                CTX.beginPath();
                CTX.rect(BRICK_X, BRICK_Y, BRICK_WIDTH, BRICK_HEIGHT);
                CTX.fill();
                CTX.closePath();

            }
        }
    }
}

function drawScore() { // счёт
    CTX.fillText("Счёт:" + score, 8, 20);
}

function drawLives() { // жизни
    CTX.fillText("Жизней:" + lives, CANVAS_NODE.width - 85, 20);
}

function detectCollision() { // определение столкновения
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
            let brick = bricks[c][r];

            if (brick.status === 1) {

                const isCollisionTrue =
                    ballX > brick.x &&
                    ballX < brick.x + BRICK_WIDTH &&
                    ballY > brick.y &&
                    ballY < brick.y + BRICK_HEIGHT;

                if (isCollisionTrue) {
                    dy = -dy;
                    brick.status = 0;

                    score++;

                    if (score === BRICK_ROW_COUNT * BRICK_COLUMN_COUNT) {
                        alert('Вы победили!');
                        document.location.reload();
                    }
                }

            }
        }
    }
}

document.addEventListener('mousemove', handleMouseMove);

function handleMouseMove(e) { // управление мышью

    const RELATIVE_X = e.clientX - CANVAS_NODE.offsetLeft;

    if (RELATIVE_X > 0 && RELATIVE_X < CANVAS_NODE.width) {
        paddleX = RELATIVE_X - PADDLE_WIDTH / 2;
    }

}


function draw() {
    CTX.clearRect(0, 0, CANVAS_NODE.width, CANVAS_NODE.height); // очищаем кадры
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    detectCollision();

    if (ballX + dx < BALL_RADIUS || ballX + dx > CANVAS_NODE.width - BALL_RADIUS) { // отскакивание мяча от краев
        dx = -dx;
    }

    if (ballY + dy < BALL_RADIUS) {
        dy = -dy;
    }

    if (ballY + dy > CANVAS_NODE.height - BALL_RADIUS) {
        if (ballY > paddleX && ballX < paddleX + PADDLE_WIDTH) { // столкновение мяча с платформой
            dy = -dy;
        } else {
            lives--;

            if (lives === 0) {
                alert('Игра закончена');
                document.location.reload();
            } else {
                ballX = CANVAS_NODE.width / 2;
                ballY = CANVAS_NODE.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (CANVAS_NODE.width - PADDLE_WIDTH) / 2;
            }
        }
    }

    ballX += dx;
    ballY += dy;

    requestAnimationFrame(draw); // зацикливаем анимацию
}

draw();