import dayjs from 'dayjs';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomDate(start, mult){
  return new Date(start.getTime() + (Math.random() + mult) * 1000 * 60 * 60 * 24 * 30);
}

function humanizeDate(date, format){
  return date ? dayjs(date).format(format) : '';
}

function humanizeDuration(start, end){
  const diffMs = dayjs(end).diff(dayjs(start));

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  const formatted = [];
  if(days > 0){
    formatted.push(`${String(days).padStart(2, '0')}D`);
  }
  if(hours > 0 || days > 0){
    formatted.push(`${String(hours).padStart(2, '0')}H`);
  }
  formatted.push(`${String(mins).padStart(2, '0')}M`);

  return formatted.join(' ');
}

function capitalizeFirstLetter(string) {
  return string.replace(/^./, string[0].toUpperCase());
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function getWeightForNullProperty(propA, propB) {
  if (propA === null && propB === null) {
    return 0;
  }

  if (propA === null) {
    return 1;
  }

  if (propB === null) {
    return -1;
  }

  return null;
}

function sortByDay(pointA, pointB){
  const weight = getWeightForNullProperty(pointA.dateFrom, pointB.dateFrom);

  return weight ?? dayjs(pointB.dateFrom).diff(dayjs(pointA.dateFrom));
}

function sortByPrice(pointA, pointB){
  const weight = getWeightForNullProperty(pointA.basePrice, pointB.basePrice);

  return weight ?? pointB.basePrice - pointA.basePrice;
}

function sortByDuration(pointA, pointB){
  const weightFrom = getWeightForNullProperty(pointA.dateFrom, pointB.dateFrom);
  const weightTo = getWeightForNullProperty(pointA.dateTo, pointB.dateTo);

  if(weightFrom || weightTo){
    return 0;
  }else{
    const diffA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
    const diffB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
    return diffB - diffA;
  }
}

export {getRandomArrayElement, getRandomInt, getRandomDate, humanizeDate, humanizeDuration, updateItem, capitalizeFirstLetter, sortByDay, sortByPrice, sortByDuration};
