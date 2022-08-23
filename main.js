const app = document.getElementById('app');

let words = [];
let letters = [];

const wordOfTheDay = 'rapid';
const result = {
    guesses: 0,
    outcome: '',
}

const generateWordleBlocks = (rowId, wordLength) => {
    const row = document.createElement("section");
    row.classList.add(`row-${rowId}`);
    row.classList.add('row');
    for (let i = 0; i < wordLength; i++) {
        const block = document.createElement("span");
        block.classList.add(`block-${i + 1}`);
        block.classList.add('block');
        row.appendChild(block);
    }
    return row;
}


const renderWordlePanel = (wordLength, guesses) => {
    const wordleWrapper = document.querySelector('.wordle-wrapper');
    if (wordleWrapper) {
        wordleWrapper.remove();
    }
    const keyBoard = document.querySelector('.keyboard_wrapper');
    const container = document.createElement("div");
    container.classList.add('wordle-wrapper');
    for (let i = 0; i < guesses; i++) {
        const html = generateWordleBlocks(i + 1, wordLength);
        container.appendChild(html);
    }
    app.insertBefore(container, keyBoard);
}

const wordleRows = document.querySelectorAll('.wordle-wrapper .row');
const keyboardKeys = document.querySelectorAll('.keyboard_wrapper .key .row span');
const enterKey = document.querySelector('.keyboard_wrapper .key .row .enter-key');
const delKey = document.querySelector('.keyboard_wrapper .key .row .del-key');
const closeModal = document.querySelector('.modal__close');
const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal__content');


const showSuccessModal = () => {
    modal.style.visibility = 'visible';
    modal.style.opacity = 1;
    modalContent.querySelector('h1').textContent = 'Great Job!'
    modalContent.querySelector('p').textContent = 'You have cracked the game!'
}

const showFailureModal = () => {
    const modal = document.querySelector('.modal');
    modal.style.visibility = 'visible';
    modal.style.opacity = 1;
    modalContent.querySelector('h1').textContent = 'OOPS!'
    modalContent.querySelector('p').textContent = 'Better luck next time!'
}

const resetGame = () => {
    words = [];
    letters = [];
    renderWordlePanel(5, 6);

}

const paintDataToBlocks = (e) => {
    const data = e.target.dataset.key;
    if (letters.length < 5) {
        letters.push(data);
        const block = document.querySelector(`.row-${words.length + 1} .block-${letters.length}`);
        block.textContent = data;
        if (letters.length === 5) {
            words.push(letters.join(''));
        }
    }
}

const onEnter = () => {
    result.guesses++;
    let correctLetters = 0;
    letters.forEach((letter, idx) => {
        const block = document.querySelector(`.row-${words.length} .block-${idx + 1}`);
        if (wordOfTheDay.includes(letter) && wordOfTheDay.indexOf(letter) === idx) {
            block.classList.add('match-found');
            correctLetters++;
        } else if (wordOfTheDay.includes(letter) && wordOfTheDay.indexOf(letter) !== idx) {
            block.classList.add('letter-present');
        } else {
            block.classList.add('absent');
        }
        block.classList.add('traversed');
    });
    letters = [];
    if (result.guesses === 6) {
        result.outcome = 'failed';
        showFailureModal();
    } else if (correctLetters === 5) {
        result.outcome = 'success'
        showSuccessModal();
    }
};
const onDelete = () => {
    const block = document.querySelector(`.row-${words.length + 1} .block-${letters.length}`);
    block.textContent = '';
    letters.pop();
}

keyboardKeys.forEach((key) => {
    if (!result.outcome) {
        key.addEventListener('click', (e) => {
            if (e.target.classList.contains('enter-key')) {
                onEnter();
            } else if (e.target.classList.contains('del-key')) {
                onDelete();
            } else {
                paintDataToBlocks(e);
            }
        });
    }
});

closeModal.addEventListener('click', (e) => {
    resetGame();
    modal.style.visibility = 'hidden';
    modal.style.opacity = 0;
})

renderWordlePanel(5, 6);
