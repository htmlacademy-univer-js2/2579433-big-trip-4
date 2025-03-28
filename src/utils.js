import dayjs from 'dayjs';
import { FILTER_TYPES, FORMATS } from './consts';

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

function getDuration(start, end){
  if(dayjs(end).diff(dayjs(start)) < 1000 * 60 * 60 * 24){
    return humanizeDate(start, FORMATS.shortDate);
  }
  if(start.getMonth() === end.getMonth()){
    return `${humanizeDate(start, FORMATS.shortDate)}&nbsp;&mdash;&nbsp;${humanizeDate(end, FORMATS.day)}`;
  }else{
    return `${humanizeDate(start, FORMATS.shortDate)}&nbsp;&mdash;&nbsp;${humanizeDate(end, FORMATS.shortDate)}`;
  }
}

function isDatesEqual(dateA, dateB) {
  return dayjs(dateA).isSame(dateB, 'D');
}

function capitalizeFirstLetter(string) {
  return string.replace(/^./, string[0].toUpperCase());
}

function sortByDay(pointA, pointB){
  return dayjs(pointB.dateFrom).diff(dayjs(pointA.dateFrom));
}

function sortByPrice(pointA, pointB){
  return pointB.basePrice - pointA.basePrice;
}

function sortByDuration(pointA, pointB){
  return dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom)) - dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
}

const filterCount = {
  [FILTER_TYPES.EVERYTHING]: (points) => points,
  [FILTER_TYPES.FUTURE]: (points) => points.filter((point) => dayjs(point.dateFrom) > Date.now()),
  [FILTER_TYPES.PRESENT]: (points) => points.filter((point) => dayjs(point.dateFrom) < Date.now() && dayjs(point.dateTo) > Date.now()),
  [FILTER_TYPES.PAST]: (points) => points.filter((point) => dayjs(point.dateTo) < Date.now()),
};

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export {getRandomArrayElement, getRandomInt, getRandomDate, humanizeDate, humanizeDuration, isDatesEqual, capitalizeFirstLetter, sortByDay, sortByPrice, sortByDuration, filterCount, getNonce, getDuration};
