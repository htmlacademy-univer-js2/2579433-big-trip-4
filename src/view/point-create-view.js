import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { TYPES, FORMATS } from '../consts';
import { getRandomArrayElement, capitalizeFirstLetter, humanizeDate } from '../utils';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const blankPoint = {
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: '',
  isFavorite: false,
  offers: [],
  type: getRandomArrayElement(TYPES)
};

function createPointCreationTemplate(point, destinations, offerArray, isSaving) {
  const { basePrice, dateFrom, dateTo, destination, offers, type } = point;
  const destinationInfo = destinations.find((d) => d.id === destination);
  const isSubmitDisabled = dayjs(dateFrom) > dayjs(dateTo) || basePrice < 0 || isNaN(basePrice) || destination === '';

  const typeList = TYPES.map((eventType) =>
    `<div class="event__type-item">
      <input id="event-type-${eventType.toLowerCase()}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${eventType.toLowerCase()}" ${eventType === type ? 'checked' : ''}>
      <label class="event__type-label event__type-label--${eventType.toLowerCase()}" for="event-type-${eventType.toLowerCase()}-1">${eventType.charAt(0).toUpperCase() + eventType.slice(1)}</label>
    </div>`).join('\n');

  const filteredOffers = offerArray.find((o) => o.type === type);
  const offerList = filteredOffers.offers.map((offer) =>
    `<div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden" data-offer-id="${offer.id}" id="event-offer-${offer.title.toLowerCase().replace(' ', '-')}-1" type="checkbox" name="event-offer-${offer.title.toLowerCase().replace(' ', '-')}" ${offers.includes(offer.id) ? 'checked' : ''} ${ isSaving ? 'disabled' : ''}>
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
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${ isSaving ? 'disabled' : ''}>

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${typeList}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${capitalizeFirstLetter(type)}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationInfo ? destinationInfo.name : ''}" list="destination-list-1" ${ isSaving ? 'disabled' : ''}>
                    <datalist id="destination-list-1">
                      <option value="Amsterdam"></option>
                      <option value="Geneva"></option>
                      <option value="Chamonix"></option>
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom, FORMATS.fullDate)}" ${ isSaving ? 'disabled' : ''}>
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo, FORMATS.fullDate)}" ${ isSaving ? 'disabled' : ''}>
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" ${ isSaving ? 'disabled' : ''}>
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit" ${ isSubmitDisabled || isSaving ? 'disabled' : '' }>${ isSaving ? 'Saving...' : 'Save'}</button>
                  <button class="event__reset-btn" type="reset" ${ isSaving ? 'disabled' : ''}>Cancel</button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    ${offerList ? `<h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                    ${offerList}
                    </div>` : ''}
                  </section>

                  <section class="event__section  event__section--destination">
                    ${destinationInfo ? `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destinationInfo.description}</p>

                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                        ${destinationInfo.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('\n')}
                      </div>
                    </div>` : ''}
                  </section>
                </section>
              </form>
            </li>`
  );
}

export default class PointCreationView extends AbstractStatefulView{
  #destinations = null;
  #offerArray = null;
  #isSaving = false;
  #fromDatepicker = null;
  #toDatepicker = null;
  #onSubmit = null;
  #onDelete = null;

  constructor({ destinations, offerArray, onSubmit, onDelete }) {
    super();
    this._setState({...blankPoint});
    this.#destinations = destinations;
    this.#offerArray = offerArray;
    this.#onSubmit = onSubmit;
    this.#onDelete = onDelete;

    this._restoreHandlers();
  }

  _restoreHandlers(){
    this.element.querySelector('form').addEventListener('submit', this.#handleSubmit);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#handleTypeChange);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#handleDestinationChange);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#handlePriceChange);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#handleOffersChange);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#handleDeletePoint);
    this.#setDatepicker();
  }

  get template() {
    return createPointCreationTemplate(this._state, this.#destinations, this.#offerArray, this.#isSaving);
  }

  get isSaving(){
    return this.#isSaving;
  }

  set isSaving(saving){
    this.#isSaving = saving;
  }

  removeElement() {
    super.removeElement();

    if (this.#fromDatepicker && this.#toDatepicker) {
      this.#fromDatepicker.destroy();
      this.#toDatepicker.destroy();
      this.#fromDatepicker = null;
      this.#toDatepicker = null;
    }
  }

  #setDatepicker() {
    this.#fromDatepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/Y H:i',
        defaultDate: this._state.dateFrom,
        onChange: this.#handleFromDateChange,
      },
    );
    this.#toDatepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/Y H:i',
        defaultDate: this._state.dateTo,
        onChange: this.#handleToDateChange,
      },
    );
  }

  #handleSubmit = (evt) => {
    evt.preventDefault();
    this.#onSubmit({...this._state});
  };

  #handleTypeChange = (evt) => {
    evt.preventDefault();
    this.updateElement({type: evt.target.value, offers: []});
  };

  #handleDestinationChange = (evt) => {
    evt.preventDefault();
    const destination = this.#destinations.find((d) => d.name === evt.target.value);
    if(destination){
      this.updateElement({destination: destination.id});
    }else{
      this.updateElement({destination: ''});
    }
  };

  #handlePriceChange = (evt) => {
    evt.preventDefault();
    this.updateElement({basePrice: evt.target.value});
  };

  #handleOffersChange = (evt) => {
    evt.preventDefault();
    const offerId = evt.target.dataset.offerId;
    this.updateElement({
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

  #handleDeletePoint = (evt) => {
    evt.preventDefault();
    this.#onDelete();
  };
}
