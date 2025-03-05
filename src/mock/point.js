import { getRandomArrayElement, getRandomInt, getRandomDate } from '../utils.js';
import { CITIES, TYPES } from '../consts';

const mockPoints = [
  {
    id: getRandomInt(10000),
    basePrice: getRandomInt(10000),
    dateFrom: getRandomDate(new Date(), 0),
    dateTo: getRandomDate(new Date(), 1),
    destination: [ getRandomInt(CITIES.length).toString() ],
    isFavorite: false,
    offers: ['0', '1', '2'],
    type: getRandomArrayElement(TYPES)
  },
  {
    id: getRandomInt(10000),
    basePrice: getRandomInt(10000),
    dateFrom: getRandomDate(new Date(), 0),
    dateTo: getRandomDate(new Date(), 1),
    destination: [ getRandomInt(CITIES.length).toString() ],
    isFavorite: true,
    offers: ['0', '1'],
    type: getRandomArrayElement(TYPES)
  },
  {
    id: getRandomInt(10000),
    basePrice: getRandomInt(10000),
    dateFrom: getRandomDate(new Date(), 0),
    dateTo: getRandomDate(new Date(), 1),
    destination: [ getRandomInt(CITIES.length).toString() ],
    isFavorite: false,
    offers: ['1', '2', '3'],
    type: getRandomArrayElement(TYPES)
  },
  {
    id: getRandomInt(10000),
    basePrice: getRandomInt(10000),
    dateFrom: getRandomDate(new Date(), 0),
    dateTo: getRandomDate(new Date(), 1),
    destination: [ getRandomInt(CITIES.length).toString() ],
    isFavorite: true,
    offers: ['1', '3', '4', '6'],
    type: getRandomArrayElement(TYPES)
  },
  {
    id: getRandomInt(10000),
    basePrice: getRandomInt(10000),
    dateFrom: getRandomDate(new Date(), 0),
    dateTo: getRandomDate(new Date(), 1),
    destination: [ getRandomInt(CITIES.length).toString() ],
    isFavorite: false,
    offers: ['2', '5', '6', '4'],
    type: getRandomArrayElement(TYPES)
  },
];

function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}

export {getRandomPoint};
