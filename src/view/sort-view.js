import AbstractView from '../framework/view/abstract-view.js';
import { SORT_TYPES } from '../consts.js';
import { capitalizeFirstLetter } from '../utils.js';

function createSortTemplate(sortType) {
  const sortList = Object.values(SORT_TYPES).map((type) =>
    `<div class="trip-sort__item  trip-sort__item--${type}">
        <input id="sort-${type}" class="trip-sort__input  visually-hidden" data-sort-type = ${type} type="radio" name="trip-sort" value="sort-${type}" ${type === sortType ? 'checked' : ''} ${type === SORT_TYPES.EVENT || type === SORT_TYPES.OFFERS ? 'disabled' : ''}>
        <label class="trip-sort__btn" for="sort-${type}">${capitalizeFirstLetter(type)}</label>
    </div>`
  ).join('\n');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortList}
    </form>`
  );
}

export default class SortView extends AbstractView{
  #sortType = null;
  #onSortTypeChange = null;

  constructor({sortType, onSortTypeChange}) {
    super();
    this.#sortType = sortType;
    this.#onSortTypeChange = onSortTypeChange;
    this.element.addEventListener('change', this.#handleSortTypeChange);
  }

  #handleSortTypeChange = (evt) => {
    evt.preventDefault();
    this.#onSortTypeChange(evt.target.dataset.sortType);
  };

  get template() {
    return createSortTemplate(this.#sortType);
  }
}
