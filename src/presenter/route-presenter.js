import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import PointCreationView from '../view/point-create-view.js';
import PointEditView from '../view/point-edit-view.js';
import SortView from '../view/sort-view.js';
import {render} from '../render.js';

export default class RoutePresenter {
  listComponent = new PointListView();

  constructor({listContainer, pointModel}) {
    this.listContainer = listContainer;
    this.pointModel = pointModel;
  }

  init() {
    this.wayPoints = [...this.pointModel.getPoints()];
    render(new SortView(), this.listContainer);
    render(this.listComponent, this.listContainer);
    render(new PointEditView(), this.listComponent.element);
    render(new PointCreationView(), this.listComponent.element);

    for (let i = 0; i < this.wayPoints.length; i++) {
      render(new PointView({point: this.wayPoints[i]}), this.listComponent.element);
    }
  }
}
