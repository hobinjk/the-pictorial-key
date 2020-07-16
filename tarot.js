const majorArcana = [
  'The Fool',
  'The Magician',
  'The High Priestess',
  'The Empress',
  'The Emperor',
  'The Hierophant',
  'The Lovers',
  'The Chariot',
  'Strength',
  'The Hermit',
  'Wheel of Fortune',
  'Justice',
  'The Hanged Man',
  'Death',
  'Temperance',
  'The Devil',
  'The Tower',
  'The Star',
  'The Moon',
  'The Sun',
  'Judgement',
  'The World',
];

const minorArcanaNumbers = [
  'Ace',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Page',
  'Knight',
  'Queen',
  'King',
];

const minorArcanaSuits = [
  'Wands',
  'Pentacles',
  'Cups',
  'Swords',
];

let nCards = 22 + 14 * 4;

function reversed() {
  if (Math.random() < 0.5) {
    return '';
    // return ' (Reversed)';
  }
  return '';
}

function draw() {
  let i = Math.floor(Math.random() * nCards);
  if (i < 22) {
    return majorArcana[i] + reversed();
  }
  i -= 22;
  let suit = minorArcanaSuits[Math.floor(i / minorArcanaNumbers.length)];
  let number = minorArcanaNumbers[i % minorArcanaNumbers.length];

  return `${number} of ${suit}` + reversed();
}

let name = draw();
document.querySelectorAll('.name').forEach(elt => {
  elt.textContent = name;
});
