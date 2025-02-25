import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import {render, replace} from '../framework/render.js';

export default class RoutePresenter {
  listComponent = new PointListView();

  constructor({listContainer, pointModel}) {
    this.listContainer = listContainer;
    this.pointModel = pointModel;
  }

  #replaceFormToPoint(formComponent, pointComponent){
    replace(pointComponent, formComponent);
  }

  #replacePointToForm(pointComponent){
    const point = pointComponent.point;
    const editComponent = new PointEditView({
      point,
      onSubmit: () => this.#replaceFormToPoint(editComponent, pointComponent),
      onClick: () => this.#replaceFormToPoint(editComponent, pointComponent)
    });

    replace(editComponent, pointComponent);

    const onEscDown = (evt) => {
      if(evt.key === 'Escape'){
        this.#replaceFormToPoint(editComponent, pointComponent);
        document.removeEventListener('keydown', onEscDown);
      }
    };

    document.addEventListener('keydown', onEscDown);
  }

  #renderPoint(point){
    const pointComponent = new PointView({
      point,
      onClick: () => this.#replacePointToForm(pointComponent)
    });

    render(pointComponent, this.listComponent.element);
  }

  init() {
    this.wayPoints = [...this.pointModel.getPoints()];
    if(this.wayPoints.length > 0){
      render(new SortView(), this.listContainer);
      render(this.listComponent, this.listContainer);
    }else{
      render(new EmptyListView(), this.listContainer);
    }

    this.wayPoints.forEach((point) => this.#renderPoint(point));
  }
}
