import { getRandomInt } from '../utils';
import { OFFERS, TYPES } from '../consts';

function getOffers(){
  return TYPES.map((type) => ({
    type: type,
    offers: OFFERS.map((title, index) => ({
      id: index,
      title: title,
      price: getRandomInt(1000)
    }))
  }));
}

export const offerArray = getOffers();
