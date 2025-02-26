import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import {render} from '../framework/render.js';

export default class RoutePresenter {
  listComponent = new PointListView();

  constructor({listContainer, pointModel}) {
    this.listContainer = listContainer;
    this.pointModel = pointModel;
  }

  init() {
    this.wayPoints = [...this.pointModel.getPoints()];
    if(this.wayPoints.length > 0){
      render(new SortView(), this.listContainer);
      render(this.listComponent, this.listContainer);
      this.wayPoints.forEach((point) => {
        const pointPresenter = new PointPresenter({listComponent: this.listComponent, point});
        pointPresenter.init();
      });
    }else{
      render(new EmptyListView(), this.listContainer);
    }
  }
}
