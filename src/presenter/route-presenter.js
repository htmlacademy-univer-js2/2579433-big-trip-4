import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import {render, remove} from '../framework/render.js';
import { sortByDuration, sortByDay, sortByPrice, updateItem } from '../utils.js';
import { SORT_TYPES } from '../consts.js';

export default class RoutePresenter {
  #listComponent = new PointListView();
  #sortComponent = null;
  #pointPresenters = new Map();
  #wayPoints = null;
  #listContainer = null;
  #currentSortType = SORT_TYPES[0];
  #pointModel = null;

  constructor({listContainer, pointModel}) {
    this.#listContainer = listContainer;
    this.#pointModel = pointModel;
  }

  updatePoint(updatedPoint){
    this.wayPoints = this.wayPoints.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
    this.#pointPresenters.get(updatedPoint.id).update(updatedPoint);
  }

  init() {
    this.#wayPoints = [...this.#pointModel.getPoints()];
    this.#renderPointList();
  }

  #renderPointList(){
    if(this.#wayPoints.length > 0){
      this.#sortComponent = new SortView({ sortType: this.#currentSortType, onSortTypeChange: this.#handleSortTypeChange });
      this.#sortWaypoints();
      render(this.#sortComponent, this.#listContainer);
      render(this.#listComponent, this.#listContainer);
      this.#wayPoints.forEach((point) => {
        const pointPresenter = new PointPresenter({
          listComponent: this.#listComponent.element,
          onChangeClick: this.#handleDataChange,
          onViewChange: this.#handleViewChange
        });
        pointPresenter.init(point);
        this.#pointPresenters.set(point.id, pointPresenter);
      });
    }else{
      render(new EmptyListView(), this.#listContainer);
    }
  }

  #sortWaypoints(){
    switch (this.#currentSortType) {
      case SORT_TYPES[0]:
        this.#wayPoints.sort(sortByDay);
        break;
      case SORT_TYPES[2]:
        this.#wayPoints.sort(sortByDuration);
        break;
      case SORT_TYPES[3]:
        this.#wayPoints.sort(sortByPrice);
        break;
      default:
        throw new Error('Incorrect sortType');
    }
  }

  #clearListView() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#sortComponent);
    remove(this.#listComponent);
  }

  #handleDataChange = (updatedPoint) => {
    this.#wayPoints = updateItem(this.#wayPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleViewChange = () => this.#pointPresenters.forEach((presenter) => presenter.resetView());

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortWaypoints();
    this.#currentSortType = sortType;
    this.#clearListView();
    this.#renderPointList();
  };
}
