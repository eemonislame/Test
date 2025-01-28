const player = document.getElementById('player');
const gameContainer = document.querySelector('.game-container');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');

let playerX = 50; // Player's horizontal position
let score = 0;
let gameOver = false;

// Move player with arrow keys
// Touch controls for mobile devices
let touchStartX = 0;
let touchOffsetX = 0;

player.addEventListener('touchstart', (e) => {
  if (gameOver) return;
  touchStartX = e.touches[0].clientX; // Record the initial touch position
});

player.addEventListener('touchmove', (e) => {
  if (gameOver) return;
  e.preventDefault(); // Prevent default touch behavior (e.g., scrolling)
  const touchCurrentX = e.touches[0].clientX;
  touchOffsetX = touchCurrentX - touchStartX; // Calculate the movement offset
  playerX += (touchOffsetX / window.innerWidth) * 100; // Convert to percentage
  playerX = Math.max(0, Math.min(95, playerX)); // Keep the player within bounds
  player.style.left = `${playerX}%`;
  touchStartX = touchCurrentX; // Update the touch start position
});
document.addEventListener('keydown', (e) => {
  if (gameOver) return;
  if (e.key === 'ArrowLeft' && playerX > 0) {
    playerX -= 10;
  } else if (e.key === 'ArrowRight' && playerX < 95) {
    playerX += 10;
  } else if (e.key === ' ') {
    shoot();
  }
  player.style.left = `${playerX}%`;
});

// Shoot bullets
function shoot() {
  const bullet = document.createElement('div');
  bullet.classList.add('bullet');
  bullet.style.left = `${playerX + 2.5}%`;
  bullet.style.bottom = '70px';
  gameContainer.appendChild(bullet);

  const bulletInterval = setInterval(() => {
    const bulletY = parseFloat(bullet.style.bottom);
    if (bulletY > window.innerHeight) {
      bullet.remove();
      clearInterval(bulletInterval);
    } else {
      bullet.style.bottom = `${bulletY + 10}px`;
    }

    // Check for collisions with enemies
    document.querySelectorAll('.enemy').forEach(enemy => {
      if (checkCollision(bullet, enemy)) {
        enemy.remove();
        bullet.remove();
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
      }
    });
  }, 20);
}

// Spawn enemies
function spawnEnemy() {
  if (gameOver) return;
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');
  enemy.style.left = `${Math.random() * 90}%`;
  enemy.style.top = '0';
  gameContainer.appendChild(enemy);

  const enemyInterval = setInterval(() => {
    const enemyY = parseFloat(enemy.style.top);
    if (enemyY > window.innerHeight - 50) {
      enemy.remove();
      clearInterval(enemyInterval);
      gameOver = true;
      gameOverDisplay.style.display = 'block';
    } else {
      enemy.style.top = `${enemyY + 2}px`;
    }

    // Check for collisions with player
    if (checkCollision(player, enemy)) {
      gameOver = true;
      gameOverDisplay.style.display = 'block';
    }
  }, 50);
}

// Check collision between two elements
function checkCollision(a, b) {
  const rectA = a.getBoundingClientRect();
  const rectB = b.getBoundingClientRect();
  return !(
    rectA.bottom < rectB.top ||
    rectA.top > rectB.bottom ||
    rectA.right < rectB.left ||
    rectA.left > rectB.right
  );
}

// Game loop
setInterval(spawnEnemy, 1000);
