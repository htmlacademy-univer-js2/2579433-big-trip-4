import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import { sortByDuration, sortByDay, sortByPrice, filterCount } from '../utils.js';
import { SORT_TYPES, ACTIONS, UpdateType, FILTER_TYPES } from '../consts.js';

export default class RoutePresenter {
  #listComponent = new PointListView();
  #loadingComponent = new LoadingView();
  #sortComponent = null;
  #stubComponent = null;
  #newPointPresenter = null;
  #pointPresenters = new Map();
  #listContainer = null;
  #currentSortType = SORT_TYPES.DAY;
  #currentFilterType = FILTER_TYPES.EVERYTHING;
  #isLoading = true;
  #pointModel = null;
  #filterModel = null;

  constructor({listContainer, pointModel, filterModel, onNewPointDestroy}) {
    this.#listContainer = listContainer;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;
    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newPointPresenter = new NewPointPresenter({
      listComponent: this.#listComponent.element,
      onChangeClick: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });
  }

  get points(){
    this.#currentFilterType = this.#filterModel.filter;
    const filteredPoints = filterCount[this.#currentFilterType](this.#pointModel.points);

    switch(this.#currentSortType){
      case SORT_TYPES.DAY:
        return filteredPoints.sort(sortByDay);
      case SORT_TYPES.TIME:
        return filteredPoints.sort(sortByDuration);
      case SORT_TYPES.PRICE:
        return filteredPoints.sort(sortByPrice);
      default:
        throw new Error('Incorrect sortType');
    }
  }

  createPoint() {
    this.#currentSortType = SORT_TYPES.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FILTER_TYPES.EVERYTHING);
    this.#newPointPresenter.init(this.#pointModel.destinations, this.#pointModel.offers);
  }

  updatePoint(updatedPoint){
    this.wayPoints = this.wayPoints.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
    this.#pointPresenters.get(updatedPoint.id).update(updatedPoint);
  }

  init() {
    this.#renderPointList();
  }

  #renderPointList(){
    if (this.#isLoading) {
      render(this.#loadingComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
      return;
    }
    if(this.points.length > 0){
      this.#sortComponent = new SortView({ sortType: this.#currentSortType, onSortTypeChange: this.#handleSortTypeChange });
      this.#newPointPresenter.listComponent = this.#listComponent.element;
      render(this.#sortComponent, this.#listContainer);
      render(this.#listComponent, this.#listContainer);
      this.points.forEach((point) => {
        const pointPresenter = new PointPresenter({
          listComponent: this.#listComponent.element,
          onChangeClick: this.#handleViewAction,
          onViewChange: this.#handleViewChange
        });
        pointPresenter.init(point, this.#pointModel.destinations, this.#pointModel.offers);
        this.#pointPresenters.set(point.id, pointPresenter);
      });
    }else{
      this.#stubComponent = new EmptyListView({filterType: this.#currentFilterType});
      render(this.#stubComponent, this.#listContainer);
    }
  }

  #clearListView() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#newPointPresenter.destroy();
    remove(this.#sortComponent);
    remove(this.#listComponent);
    remove(this.#loadingComponent);
    if(this.#stubComponent){
      remove(this.#stubComponent);
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case ACTIONS.UPDATE:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case ACTIONS.ADD:
        this.#pointModel.addPoint(updateType, update);
        break;
      case ACTIONS.DELETE:
        this.#pointModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearListView();
        this.#renderPointList();
        break;
      case UpdateType.MAJOR:
        this.#clearListView();
        this.#renderPointList();
        this.#currentSortType = SORT_TYPES.DAY;
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderPointList();
        break;
    }
  };

  #handleViewChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearListView();
    this.#renderPointList();
  };
}
