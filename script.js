var backs = Array.from(document.querySelectorAll('.card_wrapper_back'));
var flippers = Array.from(document.querySelectorAll('.flipper'));
var cardsContainer = document.querySelector('.cards_container')
var cards = [];
var openedCards = [];
var firstClick = 1;
var timer = 60;
var timerId = 0;
let testVar;

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
    let currentCard = null;
    let currentFlipper = null;

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

function mixEmojis () {
    let emojis = ['🐰', '🐰', '🐶', '🐶', '🐱', '🐱', '🐼', '🐼', '🐵', '🐵', '🐯','🐯'];

    emojis = emojis.sort(function(){
        return Math.random() - 0.5;
    });
    return emojis;
}

function putCardsOnTable() {
    let emojis;
    let imgsArray = [];

    emojis = mixEmojis();

    for(let i=0; i < emojis.length; i++)
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
    let emojis;
    let imgsArray = Array.from(document.querySelectorAll('.image_wrapper'));

    emojis = mixEmojis();
    for(let i =0; i < emojis.length; i++)
    {
        cards[i].image = emojis[i];
        imgsArray[i].textContent = emojis[i];
    }
}

function toDefault() {
    let timerObj = document.querySelector('.timer_wrapper');

    for(let i = 0; i < cards.length; i++)
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
    let popupButton = document.querySelector(".popup_window .button");
    let modalWindow = document.querySelector(".modal_window");

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
    let letter;
    let win = 1;
    let firstLetter = document.querySelector(".popup_text span");
    let deleteLetter;
    let popupText = document.querySelector(".popup_text");


    if(firstLetter.textContent === 'L')
    {
        for(let i = 0; i < 4; i++)
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

    for(let i = 0; i < cards.length; i++)
    {
        if(!cards[i].back.classList.contains('correct')) win = 0;
    }
    if(win)
    {
        endGame();
    } 

}

function lose() {
    let firstLetter = document.querySelector(".popup_text span");
    let popupText = document.querySelector(".popup_text");
    let letter, deleteLetter;

    if(firstLetter.textContent === 'W')
    {
        for(let i = 0; i < 3; i++)
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
    let timerObj = document.querySelector('.timer_wrapper');
    let minutes, seconds;
    let minutesStr, secondsStr;
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
    let correct = 1;
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

    for(let i = 0; i < cards.length; i++)
    {
        if(!cards[i].back.classList.contains('correct')) correct = 0;
    }
    if(correct) win();
        

    
}

function startGame(){
    putCardsOnTable();
    rotate();
    //cardsContainer.addEventListener('click', rotate(/*event*/), false);
}