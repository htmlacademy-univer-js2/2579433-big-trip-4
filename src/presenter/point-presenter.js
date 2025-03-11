import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import {render, replace, remove} from '../framework/render.js';
import { ACTIONS, UpdateType } from '../consts.js';
import { isDatesEqual } from '../utils.js';

export default class PointPresenter {
  #listComponent = null;
  #point = null;
  #destinations = null;
  #offers = null;
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

  setSaving() {
    if (this.#editMode) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#editMode) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (!this.#editMode) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  init(point, destinations, offers){
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      destinations: this.#destinations,
      offerArray: this.#offers,
      onRollupClick: this.#handlePointToForm,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      destinations: this.#destinations,
      offerArray: this.#offers,
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
      replace(this.#pointComponent, prevPointEditComponent);
      this.#editMode = false;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  #handlePointToForm = () => this.#replacePointToForm(this.#pointComponent);

  #handleFavoriteClick = () => {
    this.#handleDataChange(ACTIONS.UPDATE, UpdateType.MINOR, {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleFormToPoint = () => this.#replaceFormToPoint();

  #handleFormSubmit = async (point) => {
    const isMinor = this.#point.basePrice === point.basePrice || isDatesEqual(this.#point.dateFrom, point.dateFrom)
    || isDatesEqual(this.#point.dateTo, point.dateTo);

    try{
      await this.#handleDataChange(ACTIONS.UPDATE, isMinor ? UpdateType.MINOR : UpdateType.PATCH, point);
      this.#replaceFormToPoint();
    }catch(err){
      this.setAborting();
    }
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
