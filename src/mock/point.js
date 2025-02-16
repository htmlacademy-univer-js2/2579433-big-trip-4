import { getRandomArrayElement, getRandomInt, getRandomDate, getOffers, getDestination } from '../utils';
import { TYPES, OFFERS } from '../consts';

const mockPoints = [
  {
    type: getRandomArrayElement(TYPES),
    destination: getDestination(),
    eventStart: getRandomDate(new Date()),
    eventEnd: getRandomDate(new Date()),
    price: getRandomInt(10000),
    offers: getOffers(getRandomInt(OFFERS.length))
  },
];

function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}

export {getRandomPoint};
