import { getRandomInt } from '../utils';
import { OFFERS } from '../consts';

function getOffers(count){
  return OFFERS.slice(0, count).map((type, index) => ({
    id: index,
    type: type,
    price:getRandomInt(100)
  }));
}

export const offers = getOffers(OFFERS.length);
