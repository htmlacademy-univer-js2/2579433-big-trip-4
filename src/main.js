import RoutePresenter from './presenter/route-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './points-api-service.js';
import { getNonce } from './utils.js';

const AUTHORIZATION = `Basic ${getNonce()}`;
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const siteListElement = document.querySelector('.trip-events');
const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteInfoElement = document.querySelector('.trip-main');
const newEventButton = document.querySelector('.trip-main__event-add-btn');
newEventButton.addEventListener('click', handleNewPointButtonClick);

const pointModel = new PointsModel({pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)});
const filterModel = new FilterModel();

const infoPresenter = new TripInfoPresenter({pointModel, infoContainer: siteInfoElement});
const routePresenter = new RoutePresenter({listContainer: siteListElement, pointModel, filterModel, onNewPointDestroy: handleNewPointFormClose});
const filterPresenter = new FilterPresenter({filterContainer: siteFilterElement, filterModel, pointModel});
routePresenter.init();
filterPresenter.init();
pointModel.init();
infoPresenter.init();

function handleNewPointFormClose() {
  newEventButton.disabled = false;
}

function handleNewPointButtonClick() {
  routePresenter.createPoint();
  newEventButton.disabled = true;
}
