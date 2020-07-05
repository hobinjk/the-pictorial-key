let n = 2;
let markov = {};

function initState() {
  let state = [];
  for (let i = 0; i < n - 1; i++) {
    state.push('');
  }
  state.push('__START');
  return state;
}

function stateToKey(state) {
  return state.join('_SEP_');
}

function keyToWord(key) {
  let parts = key.split('_SEP_');
  return parts.pop();
}

function processPassage(passage) {
  passage = passage.replace(/"/g, '');
  passage = passage.replace(/--/g, ' ');
  passage = passage.replace(/\(\d\)/g, '');
  passage = passage.replace(/\([a-z]\)/g, '');

  passage = passage.replace(/([.,:;])/, ' $1');

  let words = passage.split(/ +/g);
  words.push('__END');

  let prevState = initState();
  for (let word of words) {
    let newState = prevState.concat([word]);
    newState.shift();
    let prevKey = stateToKey(prevState);
    let newKey = stateToKey(newState);
    if (!markov[prevKey]) {
      markov[prevKey] = {};
    }
    if (!markov[prevKey][newKey]) {
      markov[prevKey][newKey] = 0;
    }
    markov[prevKey][newKey] += 1;;
    prevState = newState;
  }
}

function generatePassage() {
  let stateKey = stateToKey(initState());

  let passage = [];

  while (true) {
    let choices = markov[stateKey];
    let total = 0;
    for (let nextKey in choices) {
      total += choices[nextKey];
    }
    let choice = Math.random() * total;
    for (let nextKey in choices) {
      if (choice < choices[nextKey]) {
        chosenNextKey = nextKey;
        break;
      }
      choice -= choices[nextKey];
    }
    let word = keyToWord(chosenNextKey);
    if (word === '__END') {
      break;
    }
    passage.push(word);
    stateKey = chosenNextKey;
  }

  let formatted = passage.join(' ');
  formatted = formatted.replace(/ ([.,:;])/g, '$1');
  return formatted;
}

async function run() {
  let res = await fetch('./text/cards.json');
  const cardsData = await res.json();

  for (let card of cardsData.cards) {
    processPassage(card.desc);
  }

  console.log(cardsData);
  console.log(markov);

  let desc = generatePassage();
  document.querySelector('.desc').textContent = desc;
}

run();

document.querySelector('.new').addEventListener('click', () => {
  window.location.reload();
});
