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


function rotate() {
    let currentCard = null,
        currentFlipper = null,
        cardsContainer = MEMOJIAPP.cardsContainer,
        firstClick = MEMOJIAPP.flags.firstClick,
        cards = MEMOJIAPP.cards,
        openedCards = MEMOJIAPP.openedCards,
        timerId = MEMOJIAPP.timer.id;

    cardsContainer.addEventListener('click', function(event){
        if(event.target.closest('.flipper'))
        {
            currentFlipper = event.target.closest('.flipper');
          if(firstClick)
            {
                firstClick = 0;
                timerId = window.setInterval(() => decrTimer(),1000);
            }
        
            // сохранение индекса текущего элемента
            for(var i = 0; i < cards.length;  i++)
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
        imgsArray = Array.from(document.querySelectorAll('.image_wrapper'));
        cards = MEMOJIAPP.cards;

    emojis = mixEmojis();
    for(let i =0; i < emojis.length; i++)
    {
        cards[i].image = emojis[i];
        imgsArray[i].textContent = emojis[i];
    }
}

function toDefault() {
    let timerObj = document.querySelector('.timer_wrapper'),
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
    firstClick = 1;
    timer = 60;
    timerObj.textContent = '01:00';
    putNewCards();

}
function endGame() {
    let popupButton = document.querySelector(".popup_window .button"),
        modalWindow = document.querySelector(".modal_window"),
        timerId = MEMOJIAPP.timer.id;

    modalWindow.classList.add('visible');
    clearInterval(timerId);
    //newGame();
    popupButton.addEventListener("mousedown", function() {
        if(this === popupButton)
        {
            //modalWindow.classList.remove('visible');
            popupButton.classList.add('pressed');
            popupButton.addEventListener("mouseup", function() {
                    popupButton.classList.remove('pressed');
                    modalWindow.classList.remove('visible');
                    toDefault();
            }, true);
            clearInterval(timerId);
        }
    }, true)
    
}

function win() {
    let letter,
        win = 1,
        firstLetter = document.querySelector(".popup_text span"),
        deleteLetter,
        popupText = document.querySelector(".popup_text"),
        cards = MEMOJIAPP.cards,
        i;


    if(firstLetter.textContent === 'L')
    {
        for(i = 0; i < 4; i++)
        {
            deleteLetter = document.querySelector(".popup_text span");
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
        endGame();
    } 

}

function lose() {
    let firstLetter = document.querySelector(".popup_text span"),
        popupText = document.querySelector(".popup_text"),
        letter, deleteLetter, i;

    if(firstLetter.textContent === 'W')
    {
        for(i = 0; i < 3; i++)
        {
            deleteLetter = document.querySelector(".popup_text span");
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
    let timerObj = document.querySelector('.timer_wrapper'),
        minutes, seconds,
        minutesStr, secondsStr,
        timer = MEMOJIAPP.timer.counter;
    timer--;
    minutes = Math.floor(timer / 60);
    minutesStr = minutes.toString();
    if(minutes < 10) minutesStr = '0'+ minutesStr;
    seconds = timer % 60;
    secondsStr =seconds.toString();
    if(seconds < 10) secondsStr = '0'+ secondsStr;
    timerObj.textContent = minutesStr+':'+secondsStr;

   if(!timer)
   {
       clearInterval(timerId);
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

(function startGame(){
    MEMOJIAPP.namespace('cards');
    MEMOJIAPP.cards = [];
    MEMOJIAPP.namespace('backs');
    MEMOJIAPP.backs = Array.from(document.querySelectorAll('.card_wrapper_back'));
    MEMOJIAPP.namespace('flippers');
    MEMOJIAPP.flippers = Array.from(document.querySelectorAll('.flipper'));
    MEMOJIAPP.namespace('cardsContainer');
    MEMOJIAPP.cardsContainer = document.querySelector('.cards_container')
    MEMOJIAPP.namespace('openedCards')
    MEMOJIAPP.openedCards = [];
    MEMOJIAPP.namespace('flags.firstClick')
    MEMOJIAPP.flags.firstClick = 1;
    MEMOJIAPP.namespace('timer.counter');
    MEMOJIAPP.timer.counter = 60;
    MEMOJIAPP.namespace('timer.id');
    MEMOJIAPP.timer.id = 0;

    putCardsOnTable();
    rotate();
    //cardsContainer.addEventListener('click', rotate(/*event*/), false);
})();