import AbstractView from '../framework/view/abstract-view.js';
import { SORT_TYPES } from '../consts.js';
import { capitalizeFirstLetter } from '../utils.js';

function createSortTemplate(sortType) {
  const sortList = SORT_TYPES.map((type) =>
    `<div class="trip-sort__item  trip-sort__item--${type}">
        <input id="sort-${type}" class="trip-sort__input  visually-hidden" data-sort-type = ${type} type="radio" name="trip-sort" value="sort-${type}" ${type === sortType ? 'checked' : ''} ${type === SORT_TYPES[1] || type === SORT_TYPES[4] ? 'disabled' : ''}>
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
    this.element.querySelector(`.trip-sort__item--${SORT_TYPES[0]}`).addEventListener('click', this.#handleSortTypeChange);
    this.element.querySelector(`.trip-sort__item--${SORT_TYPES[2]}`).addEventListener('click', this.#handleSortTypeChange);
    this.element.querySelector(`.trip-sort__item--${SORT_TYPES[3]}`).addEventListener('click', this.#handleSortTypeChange);
  }

  #handleSortTypeChange = (evt) => {
    evt.preventDefault();
    this.#onSortTypeChange(evt.target.parentElement.firstChild.nextSibling.dataset.sortType);
  };

  get template() {
    return createSortTemplate(this.#sortType);
  }
}
