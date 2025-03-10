import {remove, render, RenderPosition} from '../framework/render.js';
import PointCreationView from '../view/point-create-view.js';
import {ACTIONS, UpdateType} from '../consts.js';

export default class NewPointPresenter {
  #listComponent = null;
  #newPointComponent = null;
  #handleDataChange = null;
  #handleDestroy = null;

  constructor({listComponent, onChangeClick, onDestroy}) {
    this.#listComponent = listComponent;
    this.#handleDataChange = onChangeClick;
    this.#handleDestroy = onDestroy;
  }

  destroy() {
    if (this.#newPointComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#newPointComponent);
    this.#newPointComponent = null;
    this.#listComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving(saving) {
    this.#newPointComponent.isSaving = saving;
  }

  set listComponent(newComponent){
    this.#listComponent = newComponent;
  }

  get listComponent(){
    return this.#listComponent;
  }

  setAborting() {
    const resetFormState = () => {
      this.setSaving(false);
    };

    this.#newPointComponent.shake(resetFormState);
  }

  init(destinations, offerArray) {
    if (this.#newPointComponent !== null) {
      return;
    }

    this.#newPointComponent = new PointCreationView({
      destinations,
      offerArray,
      onSubmit: this.#handleFormSubmit,
      onDelete: this.#handleDeleteClick
    });

    render(this.#newPointComponent, this.#listComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      ACTIONS.ADD,
      UpdateType.MINOR,
      point
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
