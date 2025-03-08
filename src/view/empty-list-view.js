import AbstractView from '../framework/view/abstract-view.js';
import { FILTER_TYPES } from '../consts.js';

const emptyListText = {
  [FILTER_TYPES.EVERYTHING]: 'Click New Event to create your first point',
  [FILTER_TYPES.FUTURE]: 'There are no future events now',
  [FILTER_TYPES.PRESENT]: 'There are no present events now',
  [FILTER_TYPES.PAST]: 'There are no past events now'
};

function createEmptyListTemplate(filterType) {
  return `<p class="trip-events__msg">${emptyListText[filterType]}</p>`;
}

export default class EmptyListView extends AbstractView{
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}
