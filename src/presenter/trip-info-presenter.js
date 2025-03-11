import {render, replace, remove} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #pointModel = null;
  #infoComponent = null;
  #infoContainer = null;

  constructor({ pointModel, infoContainer}) {
    this.#pointModel = pointModel;
    this.#infoContainer = infoContainer;

    this.#pointModel.addObserver(this.#handleModelEvent);
  }

  // get startPoint(){
  //   const startDate = Math.min();
  // }

  // get middlePoint(){}

  // get finishPoint(){}

  // get finalPrice(){}

  init(){
    const prevInfoComponent = this.#infoComponent;

    this.#infoComponent = new TripInfoView({

    });

    if (prevInfoComponent === null) {
      render(this.#infoComponent, this.#infoContainer);
    }else{
      replace(this.#infoComponent, prevInfoComponent);
      remove(prevInfoComponent);
    }
  }

  #handleModelEvent = () => {
    this.init();
  };
}
