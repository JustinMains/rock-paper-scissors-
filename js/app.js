const choices = document.querySelectorAll('.choice');
const scores = document.getElementById('scores');
const result = document.getElementById('result');
const restart = document.getElementById('restart');
const modal = document.querySelector('.modal');
const scoreboard = {
    player: 0,
    computer: 0,
    bestOf: 5, // Default best of 5
    gameOver: false
}

// Add this to track game status
let gameStatus = document.createElement('div');
gameStatus.className = 'game-status';
document.querySelector('.title').appendChild(gameStatus);
updateGameStatus();

// Hide restart button initially
restart.style.display = 'none';

function updateGameStatus() {
    const remaining = scoreboard.bestOf - Math.max(scoreboard.player, scoreboard.computer);
    if (scoreboard.gameOver) {
        const winner = scoreboard.player > scoreboard.computer ? 'Player' : 'Computer';
        gameStatus.innerHTML = `<p class="best-of-status">Game Over! ${winner} wins best of ${scoreboard.bestOf}!</p>`;
        // Show restart button when game is over
        restart.style.display = 'inline-block';
    } else {
        gameStatus.innerHTML = `<p class="best-of-status">Playing best of ${scoreboard.bestOf} - First to ${Math.ceil(scoreboard.bestOf/2)} wins</p>`;
        // Hide restart button during game
        restart.style.display = 'none';
    }
}

function play(e) {
    // Don't allow play if game is over
    if (scoreboard.gameOver) {
        modal.style.display = 'block';
        result.innerHTML = `<h2>Game Over!</h2>
        <p>Please restart to play again</p>`;
        return;
    }

    const playerChoice = e.target.id;
    const computerChoice = getComputerChoice();
    const winner = getWinner(playerChoice, computerChoice);
    showWinner(winner, computerChoice);
    
    // Check if game is over
    checkGameOver();
}

function checkGameOver() {
    const winTarget = Math.ceil(scoreboard.bestOf/2);
    if (scoreboard.player >= winTarget || scoreboard.computer >= winTarget) {
        scoreboard.gameOver = true;
        updateGameStatus();
        
        // Show final result
        const winner = scoreboard.player > scoreboard.computer ? 'Player' : 'Computer';
        setTimeout(() => {
            modal.style.display = 'block';
            result.innerHTML = `<h2 class="${winner === 'Player' ? 'win-text' : 'lose-text'}">Game Over!</h2>
            <p>${winner} wins best of ${scoreboard.bestOf}!</p>
            <p>Final Score: Player ${scoreboard.player} - Computer ${scoreboard.computer}</p>`;
        }, 1000);
    }
}

function getComputerChoice() {
    const rand = Math.random();
    if(rand < 0.34) {
        return 'rock';
    } else if(rand <= 0.67) {
        return 'paper';
    } else {
        return 'scissors';
    }
}

function getWinner(player, computer) {
    if(player === computer){
        return 'draw';
    } else if(player === 'rock') {
        if(computer === 'paper') {
            return 'computer';
        } else {
            return 'player';
        }
    } else if(player === 'paper') {
        if(computer === 'scissors') {
            return 'computer'
        } else {
            return 'player'
        }
    } else if (player === 'scissors') {
        if(computer === 'rock') {
            return 'computer';
        }else {
            return 'player'
        }
    }
}

function showWinner(winner, computerChoice) {
    if(winner === 'player') {
        scoreboard.player++;
        result.innerHTML = `<h2 class="win-text">You Win</h2>
        <i class="fas fa-hand-${computerChoice} fa-10x"></i>
        <p>Computer Chose <strong>${computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1)}</strong></p>
        `;
    } else if (winner === 'computer') {
        scoreboard.computer++;
        result.innerHTML = `<h2 class="lose-text">You Lose</h2>
        <i class="fas fa-hand-${computerChoice} fa-10x"></i>
        <p>Computer chose <strong>${computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1)}</strong></p>
        `;
    } else { 
        result.innerHTML = `<h2 class="draw-text">It's A Draw</h2>
        <i class="fas fa-hand-${computerChoice} fa-10x"></i>
        <p>Computer Chose <strong>${computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1)}</strong></p>
        `;
    }
    scores.innerHTML = `
    <p>Player: ${scoreboard.player}</p>
    <p>Computer: ${scoreboard.computer}</p>
    `;
    modal.style.display = 'block';
}
  
function restartGame() {
    scoreboard.player = 0;
    scoreboard.computer = 0;
    scoreboard.gameOver = false;
    scores.innerHTML = `
    <p>Player: 0</p>
    <p>Computer: 0</p>
    `;
    updateGameStatus();
}


function setBestOf(number) {
    scoreboard.bestOf = number;
    restartGame();
}

function clearModal(e) {
    if(e.target === modal) {
        modal.style.display = 'none';
    }
}


function addBestOfSelectors() {
    const bestOfContainer = document.createElement('div');
    bestOfContainer.className = 'best-of-container';
    bestOfContainer.innerHTML = `
        <p>Best of:</p>
        <button class="best-of-btn" onclick="setBestOf(3)">3</button>
        <button class="best-of-btn" onclick="setBestOf(5)">5</button>
        <button class="best-of-btn" onclick="setBestOf(7)">7</button>
    `;
    document.querySelector('.title').appendChild(bestOfContainer);
}


addBestOfSelectors();

choices.forEach(choice => choice.addEventListener('click', play));
window.addEventListener('click', clearModal);
restart.addEventListener('click', restartGame);