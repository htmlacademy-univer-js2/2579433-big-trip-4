import { CITIES, OFFERS, SENTENSES, STUB } from './consts';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomDate(start){
  return new Date(start.getTime() + Math.random() * 1000 * 60 * 60 * 24 * 30);
}

function getRandomText(count){
  const text = getRandomArrayElement(SENTENSES);
  for(let i = 0; i < count; i++){
    text.concat(' ', getRandomArrayElement(SENTENSES));
  }
  return text;
}

function getOffers(count){
  const offers = [];
  for(let i = 0; i < count; i++){
    const offer = {
      type: getRandomArrayElement(OFFERS),
      price: getRandomInt(100)
    };
    offers.push(offer);
  }
  return offers;
}

function getPhotoes(count){
  const photoes = [];
  for(let i = 0; i < count; i++){
    photoes.push(STUB + getRandomInt(10000));
  }
  return photoes;
}

function getDestination(){
  return {
    description: getRandomText(getRandomInt(SENTENSES.length)),
    city: getRandomArrayElement(CITIES),
    photoes: getPhotoes(getRandomInt(10))
  };
}

export {getRandomArrayElement, getRandomInt, getRandomDate, getOffers, getDestination};
