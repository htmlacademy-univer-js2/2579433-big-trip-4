const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const CITIES = ['Chamonix', 'Geneva', 'Amsterdam'];

const OFFERS = ['Order Uber', 'Add luggage', 'Switch to comfort', 'Rent a car', 'Add breakfast', 'Book tickets', 'Lunch in city'];

const SENTENSES = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Cras aliquet varius magna, non porta ligula feugiat eget.', 'Fusce tristique felis at fermentum pharetra.', 'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.', 'Nunc fermentum tortor ac porta dapibus.', 'In rutrum ac purus sit amet tempus.'];

const STUB = 'https://loremflickr.com/248/152?random=';

const FORMATS = {
  fullDate: 'DD/MM/YY HH:mm',
  shortDate: 'MMM DD',
  timeOnly: 'HH:mm'
};

const SORT_TYPES = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const FILTER_TYPES = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const ACTIONS = {
  UPDATE: 'UPDATE',
  ADD: 'ADD',
  DELETE: 'DELETE',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export {TYPES, CITIES, OFFERS, SENTENSES, STUB, FORMATS, SORT_TYPES, ACTIONS, UpdateType, FILTER_TYPES};
