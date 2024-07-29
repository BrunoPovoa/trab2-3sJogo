const cardsArray = [
    { name: 'Bayle', img: './imagem/bayle.jpeg' },
    { name: 'Igon', img: './imagem/igon.jpeg' },
    { name: 'CURSEYOUBAYLE', img: './imagem/curseyoubayle.jpeg' },
    { name: 'IgonGigaChad', img: './imagem/igongigachad.jpeg' },
    { name: 'IgonRage', img: './imagem/igonrage.jpeg' },
    { name: 'IgonScream', img: './imagem/igonscream.jpeg' },
    { name: 'IHEREBYVOW', img: './imagem/iherebyvow.jpeg' },
    { name: 'RageAgainstBayle', img: './imagem/rageagainstbayle.jpeg' }
];

let gameBoard = document.getElementById('gameBoard');
let startButton = document.getElementById('startButton');
let restartButton = document.getElementById('restartButton');
let messageCard = document.getElementById('messageCard');
let scoreBoard = document.getElementById('scoreBoard');
let firstCard, secondCard;
let lockBoard = false;
let matches = 0;
let score = 0;

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
});

function startGame() {
    startButton.style.display = 'none';
    restartButton.style.display = 'block';
    gameBoard.innerHTML = '';
    messageCard.style.display = 'none';
    matches = 0;
    score = 0;
    updateScore();
    let shuffledArray = [...cardsArray, ...cardsArray].sort(() => 0.5 - Math.random());
    shuffledArray.forEach(item => {
        let card = document.createElement('div');
        card.classList.add('card');
        card.dataset.name = item.name;
        card.innerHTML = `<img src="${item.img}" alt="${item.name}">`;
        card.addEventListener('click', function(){
            const audio = document.querySelector('audio')
            audio.play()
        })
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    matches++;
    score += 1;
    updateScore();
    if (matches === cardsArray.length) {
        showMessage('Você venceu!');
        saveGameState();
    }
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function restartGame() {
    startButton.style.display = 'block';
    restartButton.style.display = 'none';
    gameBoard.innerHTML = '';
    messageCard.style.display = 'none';
    score = 0;
    updateScore();
}

function showMessage(message) {
    messageCard.textContent = message;
    messageCard.style.display = 'block';
}

function updateScore() {
    scoreBoard.textContent = `Pontos: ${score}`;
}

function saveGameState() {
    localStorage.setItem('gameResult', JSON.stringify({ score: score, message: messageCard.textContent }));
}

function loadGameState() {
    const savedState = localStorage.getItem('gameResult');
    if (savedState) {
        const { score, message } = JSON.parse(savedState);
        scoreBoard.textContent = `Pontos: ${score}`;
        showMessage(message);
    }
}