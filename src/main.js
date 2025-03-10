import RoutePresenter from './presenter/route-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = `Basic ${getNonce()}`;
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const siteListElement = document.querySelector('.trip-events');
const siteFilterElement = document.querySelector('.trip-controls__filters');
const newEventButton = document.querySelector('.trip-main__event-add-btn');
newEventButton.addEventListener('click', handleNewPointButtonClick);

const pointModel = new PointsModel({pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)});
const filterModel = new FilterModel();
const routePresenter = new RoutePresenter({listContainer: siteListElement, pointModel, filterModel, onNewPointDestroy: handleNewPointFormClose});
const filterPresenter = new FilterPresenter({filterContainer: siteFilterElement, filterModel, pointModel});
routePresenter.init();
filterPresenter.init();
pointModel.init();

function handleNewPointFormClose() {
  newEventButton.disabled = false;
}

function handleNewPointButtonClick() {
  routePresenter.createPoint();
  newEventButton.disabled = true;
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
