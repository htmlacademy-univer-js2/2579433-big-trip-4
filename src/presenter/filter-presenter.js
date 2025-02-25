import {render} from '../framework/render.js';
import FilterView from '../view/filter-view.js';

export default class FilterPresenter {
  constructor({filterContainer}) {
    this.filterContainer = filterContainer;
  }

  init(){
    render(new FilterView(), this.filterContainer);
  }
}
