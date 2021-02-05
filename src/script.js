"use strict"
import './style.scss';

let MEMOJIAPP = MEMOJIAPP || {};

MEMOJIAPP.namespace = function(propsString) {
    let parent = MEMOJIAPP,
        parts = propsString.split('.'),
        i;

    if(parts[0] === 'MEMOJIAPP') {
        parts = parts.slice(1);
    }

    for(i = 0; i < parts.length; i++) {
        if(typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
}

class Card {
	constructor(id) {
		this.id = id;
    }
    getFlipperNode(flipper) {
        this.flipper = flipper;
    }

    getBackNode(back) {
        this.back = back;
    }
    getImageNode(image) {
        this.image = image;
    }
}

function startGameWindow() {
    let popupWindow = document.querySelector('.modalWindow .beforeGame'),
        modalWindow = document.querySelector('.modalWindow');
        i = 0;

    popupWindow.addEventListener('click', function(event) {
        if (event.target.closest('.button'))
        {
            putCardsOnTable();
            modalWindow.classList.remove('visible');
        }
    })
}

function rotate() {
    let currentCard = null,
        cardsContainer = MEMOJIAPP.cardsContainer,
        firstClick = MEMOJIAPP.flags.firstClick,
        cards = MEMOJIAPP.cards,
        openedCards = MEMOJIAPP.openedCards;
        

    cardsContainer.addEventListener('click', function(event) {
        let currentFlipper = null,
            timerId = MEMOJIAPP.timer.id,
            i;
        if(event.target.closest('.card__flipper'))
        {
            currentFlipper = event.target.closest('.card__flipper');
            if(MEMOJIAPP.flags.firstClick)
            {
                MEMOJIAPP.flags.firstClick = 0;
                MEMOJIAPP.timer.id = window.setInterval(() => decrTimer(),1000);
            }
        
            // сохранение индекса текущего элемента
            for(i = 0; i < cards.length;  i++)
            {
                if(cards[i].flipper === currentFlipper)
                {
                    currentCard = cards[i];
                }
            }
            // переворот карточки
            if(!(currentCard.back.classList.contains('correct') || currentCard.back.classList.contains('incorrect')) && !currentCard.flipper.classList.contains('rotate'))
            {
                openedCards.push(currentCard);
                currentCard.flipper.classList.add('rotate');
            }
            else if(!(currentCard.back.classList.contains('correct') || currentCard.back.classList.contains('incorrect')))
            {
                currentCard.flipper.classList.remove('rotate');
                openedCards.splice(0,1);
            }
        }
        if(openedCards.length > 1) compareCards();
        }, false);
}

/* 
    Функция перемешивает эмодзи в случайном порядке
*/
function mixEmojis () {
    let emojis = ['🐰', '🐰', '🐶', '🐶', '🐱', '🐱', '🐼', '🐼', '🐵', '🐵', '🐯','🐯'];

    emojis = emojis.sort(function(){
        return Math.random() - 0.5;
    });
    return emojis;
}

function putCardsOnTable() {
    let emojis,
        imgsArray = [],
        i,
        backs = MEMOJIAPP.backs,
        cards = MEMOJIAPP.cards,
        flippers = MEMOJIAPP.flippers;

    emojis = mixEmojis();

    for(i=0; i < emojis.length; i++)
    {
        imgsArray.push(document.createElement('div'));
        imgsArray[i].textContent = emojis[i];
        imgsArray[i].className = 'image_wrapper';
        backs[i].appendChild(imgsArray[i]);
        cards.push(new Card(i));
        cards[i].getFlipperNode(flippers[i]);
        cards[i].getBackNode(backs[i]);
        cards[i].getImageNode(imgsArray[i].textContent);
    }

}

function putNewCards() {
    let emojis,
        imgsArray = Array.from(document.querySelectorAll('.image_wrapper')),
        cards = MEMOJIAPP.cards;

    emojis = mixEmojis();
    for(let i =0; i < emojis.length; i++)
    {
        cards[i].image = emojis[i];
        imgsArray[i].textContent = emojis[i];
    }
}

function toDefault() {
    let timerObj = document.querySelector('.playground__timerWrapper'),
        cards = MEMOJIAPP.cards,
        openedCards = MEMOJIAPP.openedCards,
        firstClick = MEMOJIAPP.flags.firstClick,
        timer = MEMOJIAPP.timer.counter,
        i;

    for(i = 0; i < cards.length; i++)
    {
        cards[i].flipper.classList.remove('rotate');
        cards[i].back.classList.remove('correct'); 
        cards[i].back.classList.remove('incorrect');
    }
    openedCards.splice(0, openedCards.length);
    MEMOJIAPP.flags.firstClick = 1;
    MEMOJIAPP.timer.counter = 60;
    timerObj.textContent = '01:00';
    MEMOJIAPP.flags.lose = 0;
    MEMOJIAPP.flags.win = 0;
    putNewCards();

}
function endGame() {
    let popupButton = document.querySelector('.afterGame .button'),
        popupWindow = document.querySelector('.afterGame'),
        modalWindow = document.querySelector('.modalWindow'),
        timerId = MEMOJIAPP.timer.id;

    modalWindow.classList.add('visible');
    popupWindow.classList.add('visible');
    clearInterval(MEMOJIAPP.timer.id);
    //newGame();
    popupButton.addEventListener("mousedown", function() {
        if(this === popupButton)
        {
            //modalWindow.classList.remove('visible');
            popupButton.classList.add('pressed');
            popupButton.addEventListener("mouseup", function() {
                    popupButton.classList.remove('pressed');
                    modalWindow.classList.remove('visible');
                    popupWindow.classList.remove('visible');
                    toDefault();
            }, true);
            clearInterval(MEMOJIAPP.timer.id);
        }
    }, true)
    
}

function win() {
    let letter,
        win = 1,
        firstLetter = document.querySelector(".popupText span"),
        deleteLetter,
        popupText = document.querySelector(".popupText"),
        cards = MEMOJIAPP.cards,
        i;


    if(firstLetter.textContent === 'L')
    {
        for(i = 0; i < 4; i++)
        {
            deleteLetter = document.querySelector(".popupText span");
            popupText.removeChild(deleteLetter);
        }

        letter = document.createElement('span')
        letter.textContent ='W';
        letter.classList.add('letter1');
        popupText.appendChild(letter);
        letter = document.createElement('span')
        letter.textContent ='i';
        letter.classList.add('letter2');
        popupText.appendChild(letter);
        letter = document.createElement('span')
        letter.textContent = 'n';
        letter.classList.add('letter3');
        popupText.appendChild(letter);
    }

    for(i = 0; i < cards.length; i++)
    {
        if(!cards[i].back.classList.contains('correct')) win = 0;
    }
    if(win)
    {
        MEMOJIAPP.flags.win = 1;
        endGame();
    } 

}

function lose() {
    let firstLetter = document.querySelector(".popupText span"),
        popupText = document.querySelector(".popupText"),
        letter, deleteLetter, i;

    if(firstLetter.textContent === 'W')
    {
        for(i = 0; i < 3; i++)
        {
            deleteLetter = document.querySelector(".popupText span");
            popupText.removeChild(deleteLetter);
        }

        letter = document.createElement('span')
        letter.textContent ='L';
        letter.classList.add('letter1');
        popupText.appendChild(letter);
        letter = document.createElement('span')
        letter.textContent ='o';
        letter.classList.add('letter2');
        popupText.appendChild(letter);
        letter = document.createElement('span')
        letter.textContent = 's';
        letter.classList.add('letter3');
        popupText.appendChild(letter);
        letter = document.createElement('span')
        letter.textContent = 'e';
        letter.classList.add('letter4');
        popupText.appendChild(letter);
    }
    
    endGame();
}

function decrTimer() {
    let timerWrapper = document.querySelector('.playground__timerWrapper'),
        minutes, seconds,
        minutesStr, secondsStr,     // Значения минут и секунд записанные строкой 
        timer = MEMOJIAPP.timer.counter,
        timerId = MEMOJIAPP.timer.id;
    MEMOJIAPP.timer.counter--;
    minutes = Math.floor(MEMOJIAPP.timer.counter / 60);
    minutesStr = minutes.toString();
    if(minutes < 10) minutesStr = '0'+ minutesStr;
    seconds = MEMOJIAPP.timer.counter % 60;
    secondsStr =seconds.toString();
    if(seconds < 10) secondsStr = '0'+ secondsStr;
    timerWrapper.textContent = minutesStr+':'+secondsStr;

   if(!MEMOJIAPP.timer.counter)
   {
       clearInterval(MEMOJIAPP.timer.id);
       lose();
   }
}

function compareCards() {
    let correct = 1,
        openedCards = MEMOJIAPP.openedCards,
        cards = MEMOJIAPP.cards,
        i;
    switch(openedCards.length)
    {
        case 2:
            if(openedCards[0].image === openedCards[1].image)
            {
                openedCards[0].back.classList.add('correct');
                openedCards[1].back.classList.add('correct');
            }
            else
            {
                openedCards[0].back.classList.add('incorrect');
                openedCards[1].back.classList.add('incorrect');
            }
        break;
        case 3:
            //перевернуть карточки и сбросить цвет задника, если они угаданы неверно
            if(!(openedCards[0].back.classList.contains('correct') && openedCards[1].back.classList.contains('correct')))
            {
                openedCards[0].flipper.classList.remove('rotate');
                openedCards[1].flipper.classList.remove('rotate'); 
                openedCards[0].back.classList.remove('incorrect');
                openedCards[1].back.classList.remove('incorrect'); 
            }

            openedCards.splice(0, 2);
        break;
        default:
        break;
    }

    for(i = 0; i < cards.length; i++)
    {
        if(!cards[i].back.classList.contains('correct')) correct = 0;
    }
    if(correct) win();
        

    
}

function menuControl() {
    let menuList = document.querySelector(".menuBlock__list"),
        modalWindow = document.querySelector(".modalWindow"),
        pauseWindow = document.querySelector(".pauseWindow"),
        difficultyWindow = document.querySelector(".difficultyWindow"),
        htmlDocument = document.querySelector("html"),
        timerId = MEMOJIAPP.timer.id;

    
    htmlDocument.addEventListener('click', function(event) {
        if(!(MEMOJIAPP.flags.win || MEMOJIAPP.flags.lose)) {
            if(event.target.closest('.menuBlock__burgerButton')) {
                MEMOJIAPP.flags.menuOpened = 1;
                menuList.classList.add('visible');

            } else if (MEMOJIAPP.flags.menuOpened) {
                if(event.target.closest('#newGame')) {
                    toDefault();
                    clearInterval(MEMOJIAPP.timer.id);
            
                } else if (event.target.closest('#difficulty')) {
                    MEMOJIAPP.flags.difficultyWindowOpened = 1;
                    modalWindow.classList.add('visible');
                    difficultyWindow.classList.add('visible');

                } else if (event.target.closest('#recordsTable')) {
                    MEMOJIAPP.flags.recordsTableOpened = 1;
                    
                } 

                MEMOJIAPP.flags.menuOpened = 0;
                menuList.classList.remove('visible');
                
            } else if(event.target.closest('.menuBlock__pauseButton')) {   
                MEMOJIAPP.flags.pause = 1;
                modalWindow.classList.add('visible');
                pauseWindow.classList.add('visible');
                clearInterval(MEMOJIAPP.timer.id);

            } else if(event.target.closest('.pauseWindow .button')) {
                MEMOJIAPP.flags.pause = 0;
                modalWindow.classList.remove('visible');
                pauseWindow.classList.remove('visible');
                MEMOJIAPP.timer.id = window.setInterval(() => decrTimer(),1000);
            } else {
                if(!event.target.closest('.modalWindow__popupWindow')) {
                    MEMOJIAPP.flags.difficultyWindowOpened = 0;
                    if(!MEMOJIAPP.flags.pause) {
                        modalWindow.classList.remove('visible');
                    }
                    difficultyWindow.classList.remove('visible');
                }
                
            }

        }
            
    }, true);
    
   
}

(function startGame(){
    MEMOJIAPP.namespace('cards'); // Массив всех карточек на игровом поле
    MEMOJIAPP.cards = [];
    MEMOJIAPP.namespace('backs'); // Массив всех задников на игровом поле
    MEMOJIAPP.backs = Array.from(document.querySelectorAll('.card__wrapperBack'));
    MEMOJIAPP.namespace('flippers'); // Массив всех поворачивающихся элементов карт
    MEMOJIAPP.flippers = Array.from(document.querySelectorAll('.card__flipper'));
    MEMOJIAPP.namespace('cardsContainer'); // контейнер для карт на игровом поле
    MEMOJIAPP.cardsContainer = document.querySelector('.playground__cardsContainer');
    MEMOJIAPP.namespace('openedCards'); // перевернутые карты
    MEMOJIAPP.openedCards = [];
    MEMOJIAPP.namespace('flags.firstClick'); // флаг начала игры
    MEMOJIAPP.flags.firstClick = 1;
    MEMOJIAPP.namespace('flags.menuOpened'); // флаг открытия меню игры
    MEMOJIAPP.flags.menuOpened = 0;
    MEMOJIAPP.namespace('flags.difficultyWindowOpened'); // флаг открытия меню игры
    MEMOJIAPP.flags.difficultyWindowOpened = 0;
    MEMOJIAPP.namespace('flags.recordsTableOpened'); // флаг открытия меню игры
    MEMOJIAPP.flags.recordsTableOpened = 0;
    MEMOJIAPP.namespace('flags.pause'); // флаг паузы игры
    MEMOJIAPP.flags.pause = 0;
    MEMOJIAPP.namespace('flags.win'); // флаг победы в игре
    MEMOJIAPP.flags.win = 0;
    MEMOJIAPP.namespace('flags.lose'); // флаг поражения в игре
    MEMOJIAPP.flags.lose = 0;
    MEMOJIAPP.namespace('timer.counter'); // счетчик игрового таймера 
    MEMOJIAPP.timer.counter = 60;
    MEMOJIAPP.namespace('timer.id'); // идентификатор игрового таймера
    MEMOJIAPP.timer.id = 0;
    MEMOJIAPP.namespace('diffucultyLevel');
    MEMOJIAPP.difficultyLevel = 0;
    MEMOJIAPP.namespace('resultTable.playerName');
    MEMOJIAPP.namespace('resultTable.score');
    console.log('variables were set!');

    menuControl();
    //startGameWindow(); 
    putCardsOnTable();
    rotate();
    //cardsContainer.addEventListener('click', rotate(/*event*/), false);
})();