import {render, replace, remove, RenderPosition} from '../framework/render.js';
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

  get startPoint(){
    const result = this.#pointModel.points.reduce((earliest, current) =>
      current.dateFrom < earliest.dateFrom ? current : earliest, this.#pointModel.points[0]);

    return {dateFrom: result.dateFrom, destination: result.destination};
  }

  get finishPoint(){
    const result = this.#pointModel.points.reduce((latest, current) =>
      current.dateTo > latest.dateTo ? current : latest, this.#pointModel.points[0]);

    return {dateTo: result.dateTo, destination: result.destination};
  }

  get finalPrice(){
    const totalBasePrice = this.#pointModel.points.reduce((sum, point) => sum + parseInt(point.basePrice, 10), 0);

    const offersMap = new Map();
    this.#pointModel.offers.forEach(({type, offers}) => {
      offers.forEach((offer) => {
        offersMap.set(`${type}-${offer.id}`, offer.price);
      });
    });

    const totalOffersPrice = this.#pointModel.points.reduce((sum, point) => {
      const pointOffersPrice = point.offers.reduce((offerSum, offerId) => {
        const key = `${point.type}-${offerId}`;
        return offerSum + (parseInt(offersMap.get(key), 10) || 0);
      }, 0);
      return sum + pointOffersPrice;
    }, 0);

    return totalBasePrice + totalOffersPrice;
  }

  get filteredDestinations(){
    const pointsDestinations = [...new Set(this.#pointModel.points.map((point) => point.destination))];
    return this.#pointModel.destinations.filter((d) => pointsDestinations.includes(d.id));
  }

  init(){
    if(this.#pointModel.points.length === 0){
      remove(this.#infoComponent);
      return;
    }
    const prevInfoComponent = this.#infoComponent;

    this.#infoComponent = new TripInfoView({
      startPoint: this.startPoint,
      finishPoint: this.finishPoint,
      finalPrice: this.finalPrice,
      destinations: this.filteredDestinations
    });

    if (prevInfoComponent === null) {
      render(this.#infoComponent, this.#infoContainer, RenderPosition.AFTERBEGIN);
    }else{
      replace(this.#infoComponent, prevInfoComponent);
      remove(prevInfoComponent);
    }
  }

  #handleModelEvent = () => {
    this.init();
  };
}
