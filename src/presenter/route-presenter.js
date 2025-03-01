import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import {render} from '../framework/render.js';
import { updateItem } from '../utils.js';

export default class RoutePresenter {
  #listComponent = new PointListView();
  #pointPresenters = new Map();
  #wayPoints = null;
  #listContainer = null;
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
    if(this.#wayPoints.length > 0){
      render(new SortView(), this.#listContainer);
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

  #handleDataChange = (updatedPoint) => {
    this.#wayPoints = updateItem(this.#wayPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleViewChange = () => this.#pointPresenters.forEach((presenter) => presenter.resetView());
}
