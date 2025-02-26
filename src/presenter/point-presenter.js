import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import {render, replace} from '../framework/render.js';

export default class PointPresenter {
  constructor({listComponent, point}) {
    this.listComponent = listComponent;
    this.point = point;
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

  init(){
    this.#renderPoint(this.point);
  }
}
