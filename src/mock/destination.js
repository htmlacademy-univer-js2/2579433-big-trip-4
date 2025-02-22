import { getRandomArrayElement, getRandomInt } from '../utils.js';
import { SENTENSES, STUB, CITIES } from '../consts';

function getRandomText(count){
  let text = getRandomArrayElement(SENTENSES);
  for(let i = 0; i < count; i++){
    text = text.concat(' ', getRandomArrayElement(SENTENSES));
  }
  return text;
}

function getPictures(count){
  const photos = [];
  for(let i = 0; i < count; i++){
    photos.push(STUB + getRandomInt(10000));
  }
  return photos;
}

function getDestination(){
  return CITIES.map((city, index) => ({
    id: index,
    description: getRandomText(getRandomInt(SENTENSES.length)),
    name: city,
    pictures: [{
      src: getPictures(getRandomInt(10)),
      description: getRandomArrayElement(SENTENSES)
    }]
  }));
}

export const destinations = getDestination();
