import { getRandomArrayElement, getRandomInt, getRandomDate } from '../utils.js';
import { TYPES, SENTENSES, STUB, CITIES } from '../consts';

function getRandomText(count){
  let text = getRandomArrayElement(SENTENSES);
  for(let i = 0; i < count; i++){
    text = text.concat(' ', getRandomArrayElement(SENTENSES));
  }
  return text;
}

function getPhotos(count){
  const photos = [];
  for(let i = 0; i < count; i++){
    photos.push(STUB + getRandomInt(10000));
  }
  return photos;
}

function getDestination(){
  return {
    description: getRandomText(getRandomInt(SENTENSES.length)),
    city: getRandomArrayElement(CITIES),
    photos: getPhotos(getRandomInt(10))
  };
}

const mockPoints = [
  {
    type: getRandomArrayElement(TYPES),
    destination: getDestination(),
    eventStart: getRandomDate(new Date(), 0),
    eventEnd: getRandomDate(new Date(), 1),
    price: getRandomInt(10000),
    offersID: [0, 1]
  },
  {
    type: getRandomArrayElement(TYPES),
    destination: getDestination(),
    eventStart: getRandomDate(new Date(), 0),
    eventEnd: getRandomDate(new Date(), 1),
    price: getRandomInt(10000),
    offersID: [1, 2, 3]
  },
  {
    type: getRandomArrayElement(TYPES),
    destination: getDestination(),
    eventStart: getRandomDate(new Date(), 0),
    eventEnd: getRandomDate(new Date(), 1),
    price: getRandomInt(10000),
    offersID: [1, 3, 4, 6]
  },
  {
    type: getRandomArrayElement(TYPES),
    destination: getDestination(),
    eventStart: getRandomDate(new Date(), 0),
    eventEnd: getRandomDate(new Date(), 1),
    price: getRandomInt(10000),
    offersID: [2, 5, 6, 4]
  },
];

function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}

export {getRandomPoint};
