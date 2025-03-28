import AbstractView from '../framework/view/abstract-view.js';
import { FILTER_TYPES } from '../consts.js';
import { capitalizeFirstLetter } from '../utils.js';

function createFilterTemplate(currentFilterType, filterActivity){
  const filterList = Object.values(FILTER_TYPES).map((type) =>
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${currentFilterType === type ? 'checked' : ''} ${filterActivity.get(type) ? '' : 'disabled'}>
      <label class="trip-filters__filter-label" for="filter-${type}">${capitalizeFirstLetter(type)}</label>
    </div>`
  ).join('\n');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterList}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FilterView extends AbstractView{
  #currentFilter = null;
  #filterActivity = null;
  #onFilterTypeChange = null;

  constructor({currentFilterType, filterActivity, onFilterTypeChange}){
    super();
    this.#currentFilter = currentFilterType;
    this.#filterActivity = filterActivity;
    this.#onFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#handleFilterTypeChange);
  }

  get template() {
    return createFilterTemplate(this.#currentFilter, this.#filterActivity);
  }

  #handleFilterTypeChange = (evt) => {
    evt.preventDefault();
    this.#onFilterTypeChange(evt.target.value);
  };
}
