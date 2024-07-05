let health = 3;

document.addEventListener('DOMContentLoaded', (event) => {
    const movable = document.getElementById('movable');
    const movable2 = document.getElementById('movable2');
    const container = document.getElementById('container');
    let side;

    let topPosition = 225;
    let leftPosition = 225;

    const step = 5;
    let moveInterval;
    function startWalking(movable) {
        movable.style.backgroundImage = "url('./Gangsters_1/Walk.png')";
        movable.classList.add("walk");
    }

    function stopWalking() {
        movable.style.backgroundImage = "url('./Gangsters_1/Idle.png')";
        movable.classList.remove("walk");
    }

    function moveAndCheckCollision() {
        movable.style.top = `${topPosition}px`;
        movable.style.left = `${leftPosition}px`;

    }

    function updatePosition(direction) {
        switch (direction) {
            case 'left':
                if (leftPosition > 0) {
                    transformSide(movable, -1);
                    side = "LEFT";
                    leftPosition -= step;
                }
                break;
            case 'up':
                if (topPosition > 0) {
                    topPosition -= step;
                }
                break;
            case 'right':
                if (leftPosition < (container.clientWidth - movable.clientWidth)) {
                    transformSide(movable, 1);
                    side = "RIGHT";
                    leftPosition += step;
                }
                break;
            case 'down':
                if (topPosition < (container.clientHeight - movable.clientHeight)) {
                    topPosition += step;
                }
                break;
        }

        moveAndCheckCollision();
    }

    window.addEventListener('keydown', (event) => {
        switch (event.keyCode) {
            case 37: // Arrow Left
                startWalking(movable);
                updatePosition('left');
                break;
            case 38: // Arrow Up
                startWalking(movable);
                updatePosition('up');
                break;
            case 39: // Arrow Right
                startWalking(movable);
                updatePosition('right');
                break;
            case 40: // Arrow Down
                startWalking(movable);
                updatePosition('down');
                break;
            case 32: // Space
                movable.style.backgroundImage = "url('./Gangsters_1/Shot.png')";
                setTimeout(() => {
                    movable.style.backgroundImage = "url('./Gangsters_1/Walk.png')";
                }, 2000);
                shoot(topPosition, leftPosition, container, movable2, side);
                break;
        }

        clearInterval(moveInterval);
    });

    window.addEventListener('keyup', (event) => {
        stopWalking(movable);
    });
});

function shoot(topPosition, leftPosition, container, movable2, direction) {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');

    if (direction === 'LEFT') {
        bullet.style.top = `${topPosition + 90}px`;
        bullet.style.left = `${leftPosition}px`;
    } else {
        bullet.style.top = `${topPosition + 90}px`;
        bullet.style.left = `${leftPosition + 50}px`;
    }

    container.appendChild(bullet);

    const bulletSpeed = 5;
    const bulletInterval = setInterval(() => {
        let currentLeft = parseInt(bullet.style.left);

        if (direction === 'LEFT') {
            if (currentLeft < 0) {
                bullet.remove();
                clearInterval(bulletInterval);
            } else {
                bullet.style.left = `${currentLeft - bulletSpeed}px`;
            }
        } else {
            if (currentLeft > container.clientWidth) {
                bullet.remove();
                clearInterval(bulletInterval);
            } else {
                bullet.style.left = `${currentLeft + bulletSpeed}px`;
            }
        }

        if (checkCollision(bullet, movable2)) {
            movable2.style.backgroundImage = "url('./Gangsters_1/Hurt.png')";
            movable2.classList.add("hurt");
            setTimeout(() => {
                movable2.classList.remove("hurt");
            }, 500);
            health--;
            bullet.remove();
            clearInterval(bulletInterval);
            if (health <= 0) {
                movable2.style.backgroundImage = "url('./Gangsters_1/Dead.png')";
                movable2.classList.add('death');
            }
        }
    }, 10);
}


function checkCollision(bullet, target) {
    const bulletRect = bullet.getBoundingClientRect();
    let targetRect = target.getBoundingClientRect();

    return ((targetRect.right - bulletRect.left < 78 && targetRect.right - bulletRect.left > 53) 
    && ((targetRect.top + 90) - bulletRect.top <= 30) && ((targetRect.top + 90) - bulletRect.top >= -35));
}

function transformSide(movable, value) {
    movable.style.transform = `scaleX(${value})`;
}
