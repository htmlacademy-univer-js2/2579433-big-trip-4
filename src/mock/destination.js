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
    photos.push({src: STUB + getRandomInt(10000), description: getRandomArrayElement(SENTENSES)});
  }
  return photos;
}

function getDestination(){
  return CITIES.map((city, index) => ({
    id: index.toString(),
    description: getRandomText(getRandomInt(SENTENSES.length)),
    name: city,
    pictures: getPictures(getRandomInt(10))
  }));
}

export const destinations = getDestination();
