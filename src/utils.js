import dayjs from 'dayjs';

const DATE_FORMAT = 'DD/MM/YY HH:mm';
const SHORT_DATE_FORMAT = 'MMM DD';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomDate(start, mult){
  return new Date(start.getTime() + (Math.random() + mult) * 1000 * 60 * 60 * 24 * 30);
}

function humanizeDate(date){
  return date ? dayjs(date).format(DATE_FORMAT) : '';
}

function getShortDate(date){
  return date ? dayjs(date).format(SHORT_DATE_FORMAT) : '';
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

export {getRandomArrayElement, getRandomInt, getRandomDate, getShortDate, humanizeDate, humanizeDuration};
