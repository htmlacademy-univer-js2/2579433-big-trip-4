import AbstractView from '../framework/view/abstract-view.js';
import { getDuration } from '../utils.js';

function createTripInfoTemplate(startPoint, finishPoint, finalPrice, middlePoint, destinations) {
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${destinations.find((d) => startPoint.destination === d.id).name} &mdash; ${ middlePoint ? `${middlePoint} &mdash;` : ''} ${destinations.find((d) => finishPoint.destination === d.id).name}</h1>
        <p class="trip-info__dates">${getDuration(startPoint.dateFrom, finishPoint.dateTo)}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${finalPrice}</span>
      </p>
      </section>`
  );
}

export default class TripInfoView extends AbstractView {
  #startPoint = null;
  #finishPoint = null;
  #finalPrice = null;
  #destinations = null;

  constructor({ startPoint, finishPoint, finalPrice, destinations}){
    super();
    this.#startPoint = startPoint;
    this.#finishPoint = finishPoint;
    this.#finalPrice = finalPrice;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate(this.#startPoint, this.#finishPoint, this.#finalPrice, this.#getMiddlePoint(), this.#destinations);
  }

  #getMiddlePoint(){
    switch (this.#destinations.length){
      case 0:
      case 1:
      case 2:
        return null;
      case 3:
        return this.#destinations.find((d) => d.id !== this.#startPoint.destination && d.id !== this.#finishPoint.destination).name;
      default:
        return '...';
    }
  }
}
