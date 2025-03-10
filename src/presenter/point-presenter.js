import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import {render, replace, remove} from '../framework/render.js';
import { ACTIONS, UpdateType } from '../consts.js';
import { isDatesEqual } from '../utils.js';

export default class PointPresenter {
  #listComponent = null;
  #point = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #handleDataChange = null;
  #handleViewChange = null;
  #editMode = false;

  constructor({listComponent, onChangeClick, onViewChange}) {
    this.#listComponent = listComponent;
    this.#handleDataChange = onChangeClick;
    this.#handleViewChange = onViewChange;
  }

  #replaceFormToPoint(){
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#handleEscDown);
    this.#editMode = false;
  }

  #replacePointToForm(){
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#handleEscDown);
    this.#handleViewChange();
    this.#editMode = true;
  }

  destroy(){
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if(this.#editMode) {
      this.#replaceFormToPoint();
      this.#pointEditComponent.reset(this.#point);
    }
  }

  init(point){
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      onRollupClick: this.#handlePointToForm,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      onCloseClick: this.#handleFormToPoint,
      onSubmit: this.#handleFormSubmit,
      onDelete: this.#handleDeletePoint
    });

    if(prevPointComponent === null || prevPointEditComponent === null){
      render(this.#pointComponent, this.#listComponent);
      return;
    }

    if(!this.#editMode) {
      replace(this.#pointComponent, prevPointComponent);
    }else{
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  #handlePointToForm = () => this.#replacePointToForm(this.#pointComponent);

  #handleFavoriteClick = () => {
    this.#handleDataChange(ACTIONS.UPDATE, UpdateType.MINOR, {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleFormToPoint = () => this.#replaceFormToPoint();

  #handleFormSubmit = (point) => {
    const isMinor = this.#point.basePrice === point.basePrice || isDatesEqual(this.#point.dateFrom, point.dateFrom)
    || isDatesEqual(this.#point.dateTo, point.dateTo);

    this.#handleDataChange(ACTIONS.UPDATE, isMinor ? UpdateType.MINOR : UpdateType.PATCH, point);
    this.#replaceFormToPoint();
  };

  #handleEscDown = (evt) => {
    if(evt.key === 'Escape'){
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #handleDeletePoint = (point) => {
    this.#handleDataChange(ACTIONS.DELETE, UpdateType.MINOR, point);
  };
}
