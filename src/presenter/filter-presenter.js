import {render, replace, remove} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import { UpdateType, FILTER_TYPES } from '../consts.js';
import { filterCount } from '../utils.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointModel = null;
  #filterComponent = null;

  constructor({filterContainer, filterModel, pointModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointModel = pointModel;

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointModel.points;
    const activity = new Map();
    Object.values(FILTER_TYPES).forEach((type) => activity.set(type, filterCount[type](points).length !== 0));
    return activity;
  }

  init(){
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      currentFilterType: this.#filterModel.filter,
      filterActivity: this.filters,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
    }else{
      replace(this.#filterComponent, prevFilterComponent);
      remove(prevFilterComponent);
    }
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
