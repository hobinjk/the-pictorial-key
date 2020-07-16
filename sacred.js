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

function drawNoise(gfx) {
  let id = gfx.getImageData(0, 0, gfx.width, gfx.height);
  let gen = new SimplexNoise();

  for (let y = 0; y < gfx.height; y++) {
    for (let x = 0; x < gfx.width; x++) {
      let noise = gen.noise2D(x / 500, y / 500);
      // let val = Math.round((noise + 1) * 3) * 127 / 3;
      let k = 7;
      let val = Math.round((noise + 1) * k) * 127 / k;
      id.data[4 * (y * gfx.width + x) + 0] = val;
      id.data[4 * (y * gfx.width + x) + 1] = val;
      id.data[4 * (y * gfx.width + x) + 2] = val;
      id.data[4 * (y * gfx.width + x) + 3] = 255;
    }
  }

  gfx.putImageData(id, 0, 0);
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

  let cardPicture = document.querySelector('.card-picture');
  const rect = cardPicture.getBoundingClientRect();
  let gfx = cardPicture.getContext('2d');
  gfx.width = cardPicture.width = rect.width;
  gfx.height = cardPicture.height = rect.height;

  drawNoise(gfx);
}

run();

document.querySelector('.new').addEventListener('click', () => {
  window.location.reload();
});
