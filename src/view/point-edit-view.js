import { TYPES, FORMATS, CITIES } from '../consts.js';
import { humanizeDate, capitalizeFirstLetter } from '../utils.js';
import { offerArray } from '../mock/offer.js';
import { destinations } from '../mock/destination.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';


function createPointEditTemplate(point) {
  const { basePrice, dateFrom, dateTo, offers, type, destinationInfo, filteredOffers } = point;

  const isSubmitDisabled = dayjs(dateFrom) > dayjs(dateTo) || basePrice < 0 || !CITIES.includes(destinationInfo.name);
  const typeList = TYPES.map((eventType) =>
    `<div class="event__type-item">
      <input id="event-type-${eventType.toLowerCase()}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${eventType.toLowerCase()}" ${eventType.toLowerCase() === type ? 'checked' : ''}>
      <label class="event__type-label event__type-label--${eventType.toLowerCase()}" for="event-type-${eventType.toLowerCase()}-1">${capitalizeFirstLetter(eventType)}</label>
    </div>`).join('\n');

  const offerList = filteredOffers.offers.map((offer) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" data-offer-id="${offer.id}" id="event-offer-${offer.title.toLowerCase().replace(' ', '-')}-1" type="checkbox" name="event-offer-${offer.title.toLowerCase().replace(' ', '-')}" ${offers.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.title.toLowerCase().replace(' ', '-')}-1">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
</div>`).join('\n');

  return (
    `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${typeList}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationInfo.name}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      <option value="Amsterdam"></option>
                      <option value="Geneva"></option>
                      <option value="Chamonix"></option>
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom, FORMATS.fullDate)}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo, FORMATS.fullDate)}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${basePrice}>
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit" ${ isSubmitDisabled ? 'disabled' : '' }>Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                      ${offerList}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destinationInfo.description}</p>
                  </section>
                </section>
              </form>
            </li>`
  );
}


export default class PointEditView extends AbstractStatefulView{
  #datepicker = null;
  #onSubmit = null;
  #onCloseClick = null;

  constructor({ point, onCloseClick, onSubmit }) {
    super();
    this._setState(PointEditView.parsePointToState(point));
    this.#onSubmit = onSubmit;
    this.#onCloseClick = onCloseClick;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate(this._state);
  }

  _restoreHandlers(){
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#handleClick);
    this.element.querySelector('form').addEventListener('submit', this.#handleSubmit);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#handleTypeChange);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#handleDestinationChange);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#handlePriceChange);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#handleOffersChange);
    this.#setFromDatepicker();
    this.#setToDatepicker();
  }

  reset(point) {
    this.updateElement(
      PointEditView.parseTaskToState(point),
    );
  }

  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  #setFromDatepicker() {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'j F',
        defaultDate: this._state.dueDate,
        onChange: this.#handleFromDateChange,
      },
    );
  }

  #setToDatepicker() {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'j F',
        defaultDate: this._state.dueDate,
        onChange: this.#handleFromDateChange,
      },
    );
  }

  #handleSubmit = (evt) => {
    evt.preventDefault();
    this.#onSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #handleClick = () => this.#onCloseClick();

  #handleTypeChange = (evt) => {
    evt.preventDefault();
    this.updateElement({type: evt.target.value, offers: [], filteredOffers: offerArray.find((o) => o.type === evt.target.value)});
  };

  #handleDestinationChange = (evt) => {
    evt.preventDefault();
    const destination = destinations.find((d) => d.name === evt.target.value);

    if(destination){
      this._setState({ destinationInfo: destinations.find((d) => d.name === evt.target.value)});
      this._setState({destination: [destination.id]});
    }else{
      this._setState({ destinationInfo: {
        id: -1,
        description: '',
        name: evt.target.value,
        pictures: []
      }});
    }
  };

  #handlePriceChange = (evt) => {
    evt.preventDefault();
    this._setState({basePrice: evt.target.value});
  };

  #handleOffersChange = (evt) => {
    evt.preventDefault();
    const offerId = evt.target.dataset.offerId;
    this._setState({
      offers: this._state.offers.includes(offerId)
        ? this._state.offers.filter((id) => id !== offerId)
        : [...this._state.offers, offerId]
    });
  };

  #handleFromDateChange = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #handleToDateChange = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  static parsePointToState(point) {
    return {...point,
      destinationInfo: destinations.find((d) => d.id === point.destination[0]),
      filteredOffers: offerArray.find((o) => o.type === point.type)
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.destinationInfo;
    delete point.filteredOffers;

    return point;
  }
}
