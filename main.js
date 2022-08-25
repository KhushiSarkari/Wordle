const app = document.getElementById('app');

// Keyboard
const wordleRows = document.querySelectorAll('.wordle-wrapper .row');
const keyboardKeys = document.querySelectorAll('.keyboard_wrapper .key .row span');
const enterKey = document.querySelector('.keyboard_wrapper .key .row .enter-key');
const delKey = document.querySelector('.keyboard_wrapper .key .row .del-key');

// Modal
const modal = document.querySelector('.modal');
const modalContent = modal.querySelector('.modal__content');
const closeModal = modal.querySelector('.modal__close');
const modalHeading = modalContent.querySelector('h1');
const modalText = modalContent.querySelector('p');

// Tool Tip
const toolTip = document.querySelector('.tooltip');
const toolTipClose = document.querySelector('.tooltip .tooltip__close');

let wordList = ['about', 'place', 'globe', 'great', 'rapid', 'found', 'under', 'light', 'story', 'point', 'white', 'alone', 'plane', 'woman', 'watch', 'break'];

const wordGenerator = () => {
    return Math.floor(Math.random() * wordList.length);
}

let letters = [];
let words = [];
let wordOfTheDay = wordList[wordGenerator()];
const result = {
    guesses: 0,
    outcome: '',
}

const SuccessMessage = {
    1: 'Absolute Genious!!',
    2: 'Mind blowing!!',
    3: 'Excellant!!',
    4: 'Great job!!',
    5: 'Good job!!',
    6: 'Phew!!'
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

const setVisibleModal = () => {
    modal.style.visibility = 'visible';
    modal.style.opacity = 1;
}

const setModalData = (heading, textContent) => {
    modalHeading.textContent = heading;
    modalText.textContent = textContent;
}

const renderSuccessModal = () => {
    setVisibleModal();
    setModalData(SuccessMessage[result.guesses], 'You have succesfully completed this game!');
}

const renderFailureModal = () => {
    setVisibleModal();
    setModalData('OOPS!', 'Better luck next time!');
}


const resetGame = () => {
    words = [];
    letters = [];
    renderWordlePanel(5, 6);
    wordOfTheDay = wordList[wordGenerator()];

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
        renderFailureModal();
    } else if (correctLetters === 5) {
        result.outcome = 'success';
        renderSuccessModal();
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
            toolTip.style.visibility = 'hidden';
            if (e.target.classList.contains('enter-key')) {
                if (letters.length === 5)
                    onEnter();
                else
                    toolTip.style.visibility = 'visible';
            } else if (e.target.classList.contains('del-key')) {
                onDelete();
            } else {
                paintDataToBlocks(e);
            }
        });
    }
});

closeModal.addEventListener('click', () => {
    resetGame();
    modal.style.visibility = 'hidden';
    modal.style.opacity = 0;
});

toolTipClose.addEventListener('click', () => {
    toolTip.style.visibility = 'hidden';
});

renderWordlePanel(5, 6);
