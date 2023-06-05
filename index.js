/*
    PROGRAM :  Blackjack Game
    AUTHOR  :  Laura Purcell-Gates
    EMAIL   :  <laurapurcellgates@gmail.com>

    Created as part of Altcademy Full Stack Web Development bootcamp.

    This Blackjack game supports one player playing against the bot dealer, with bets and replays.  */

// create global variable for player bet
var bet = 100;

// create object to store all game properties that will reset on replay
var game = {
  // create properties for scores
  playerScore: 0,
  dealerScore: 0,

  // create properties for ace count
  playerAces: 0,
  dealerAces: 0,

  // create Black Jack boolean property
  playerBlackJack: false,
  dealerBlackJack: false,

  // create properties for cards dealt
  card: '',
  hiddenCard: '',

  // create array properties for player & dealer hands
  playerHand: [],
  dealerHand: [],

  // create bool property for player turn
  playerTurn: false,

  // create deck array property
  deck: []
}

// create reset function
function reset () {
  game.playerScore = 0;
  game.dealerScore = 0;
  game.playerAces = 0;
  game.dealerAces = 0;
  game.playerBlackJack = false;
  game.dealerBlackJack = false;
  game.card = '';
  game.hiddenCard = '';
  game.playerHand = [];
  game.dealerHand = [];
  game.playerTurn = false;
  game.deck = [];
}

// define play function to call game functions
function play () {
  createDeck();
  shuffleDeck();
  deal();
}

// define createDeck function
function createDeck () {
  let valuesArr = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let suitsArr = ['C', 'S', 'D', 'H'];
  
  for (let i = 0, n = suitsArr.length; i < n; i++) {
    for (let j = 0, n = valuesArr.length; j < n; j++) {
      game.deck.push(valuesArr[j] + '-' + suitsArr[i]);
    }
  }
  return game.deck;
}

// define shuffleDeck function
function shuffleDeck () {
  for (let i = 0, n = game.deck.length; i < n; i++) {
    let j = Math.floor(Math.random() * game.deck.length);
    let tmp = game.deck[i];
    game.deck[i] = game.deck[j];
    game.deck[j] = tmp;
  }
}

// define function to deal 2 cards at beginning of game, 1 card thereafter
function deal () {
  
  // first round - 2 cards for player & for dealer
  if (game.playerScore == 0) {
    game.playerTurn = true;
    alert('Your current bet is $' + bet + '\n');
    dealCard();
    dealCard();
    // player first deal alert
    alert('Your first hand:\n' + game.playerHand + '\nYour total card value: ' + game.playerScore);
    game.playerTurn = false;

    // dealer first deal
    dealCard();
    game.hiddenCard = game.deck.pop();
    alert('\nDealer\'s first hand:\n' + game.dealerHand + ', ' + '(Face-down)' + '\nDealer\'s visible card value: ' + game.dealerScore);
    game.dealerHand.push(game.hiddenCard);
    game.dealerScore += cardValue(game.hiddenCard);
    aces();

    // run checks
    if (checks() === true) {
      return;
    }
    
  } else {
    
    // player one card round
    game.playerTurn = true;
    dealCard();
    alert('\nYour deal:\n' + game.card + '\nYour current hand: ' + game.playerHand + '\nYour total card value: ' + game.playerScore);
    game.playerTurn = false;

    // run checks
    if (checks() === true) {
      return;
    }

    // dealer hits if 16 points or less

    if (game.dealerScore <= 16) {
      dealCard();
      
      // run checks
      if (checks() === true) {
      return;
      } 
    }  
  }
  // ask player whether wants to hit or stand
  let hit = confirm('\nDo you want to hit?');

  if (hit) {
    deal();
  } else {
    calculateScores();
    }
}

// define dealCard function for player
function dealCard () {
  game.card = game.deck.pop();
  if (game.playerTurn == true) {
    game.playerHand.push(game.card);
    game.playerScore += cardValue(game.card);
  } else {
    game.dealerHand.push(game.card);
    game.dealerScore += cardValue(game.card);
  }
  aces();
}

// define function that calculates card value; str = card
function cardValue (str) {
  let cardDigit = str.split('-');
  let value = cardDigit[0];
  
  if (isNaN(value)) {
    if (value === 'A') {
      if (game.playerTurn == true) {
        game.playerAces += 1; 
      } else {
        game.dealerAces += 1;
      }
      return 11;
    } 
    return 10;
  } else {
    return parseInt(value);
  }
}

// define function to recalculate Aces for scores over 21
function aces() {
  if (game.playerScore > 21 && game.playerAces > 0) {
      game.playerScore -= 10;
      game.playerAces -= 1;
    }
  while (game.dealerScore > 21 && game.dealerAces > 0) {
    game.dealerScore -= 10;
    game.dealerAces -= 1;
  }
} 

// define checks function
function checks() {
  if (endGameCheck() === true && playAgain() === false) {
    return true;
  }
}

// define function that checks current tally and returns game over if blackjack or bust
function endGameCheck () {
  
  // check for Black Jack Ace + face card
  game.playerBlackJack = blackJackCheck(game.playerScore, game.playerHand);
  game.dealerBlackJack = blackJackCheck(game.dealerScore, game.dealerHand);
  
  // define Black Jack check function
  function blackJackCheck (int, arr) {
    if (int == 21) {
      // check for Black Jack of Ace + face card
      if (arr.length == 2) {
        return true;
      }
      return false;
    }
  }
  
  if (game.playerBlackJack == true || game.dealerBlackJack == true || game.playerScore >= 21 || game.dealerScore >= 21) {
    
    // check for Black Jack or bust
    if ((game.playerBlackJack == true && game.dealerBlackJack == true) || (game.playerScore == 21 && game.dealerScore == 21)) {
      alert('\nGame over, it\'s a push - you and the dealer both have Black Jack!\n\nYou still have $' + bet);
    } else if (game.playerBlackJack == true) {
      betWin();
      alert('\nGame over, you\'ve won with Black Jack!\n\nYou now have $' + bet);
      } else if (game.dealerBlackJack == true) {
        betLose();
        alert('\nGame over, the dealer has won with Black Jack.\n\nYou now have $' + bet);
        } else if (game.playerScore == 21) {
          betWin();
          alert('\nGame over, you\'ve won with Black Jack!\n\nYou now have $' + bet)
          } else if (game.dealerScore == 21) {
              betLose();
              alert('\nGame over, the dealer has won with Black Jack.\n\nYou now have $' + bet);
            } else if (game.playerScore > 21) {
                betLose();
                alert('\nGame over, you\'ve busted!\n\nYou now have $' + bet);
              } else {
                  betWin();
                  alert('\nGame over, the dealer has busted - you\'ve won!\n\nYou now have $' + bet);
                } 
    
    // alert hands and scores
    alert('\nYour final hand: ' + game.playerHand + '\nYour final score: ' + game.playerScore + '\n\nDealer\'s final hand: ' + game.dealerHand + '\nDealer\'s final score: ' + game.dealerScore + '\n');
    return true;
  }
  return false;
}

// define function that calculates scores when player stands
function calculateScores () {
  alert('\nYour final hand is ' + game.playerHand + '\nYour final score is ' + game.playerScore + '\n\nDealer\'s final hand is ' + game.dealerHand + '\nDealer\'s final score is ' + game.dealerScore);
  
  if (game.playerScore == game.dealerScore) {
    alert('\nIt\'s a push!\n\nYou still have $' + bet);
  }
  else if (game.playerScore > game.dealerScore) {
    betWin();
    alert('\nCongratulations, you\'ve won!\n\nYou now have $' + bet + '\n');
  } else {
    betLose();
    alert('\nThe dealer has won.\n\nYou now have $' + bet + '\n');
  }
  playAgain();
}

// define bet win function
function betWin () {
  bet *= 2;
}

// define bet lose function 
function betLose () {
  bet = 0;
}

// define playAgain function
function playAgain () {
  // ask if wants to play again
  let repeat = confirm('Do you want to play again?');

  if (repeat) {
    // ask for new bet
    let num = prompt('\nHow much would you like to add to your bet, minimum $10?\nPlease enter an increment of 10: ');
    
    num = parseInt(num);

    while (num % 10 != 0) {
      // if player cancels the prompt, stop the while loop
      if (num === null) {
        break;
      }
      num = prompt('Please enter an increment of 10: ');
    }
    
    bet += num;
    // call reset game object & play functions
    reset();
    alert('\n');
    play();
    
  } else {
    alert('\nThank you for playing!');
    return(false);
  }
}

// call play function to start the game
play();