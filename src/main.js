import RoutePresenter from './presenter/route-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';

const siteListElement = document.querySelector('.trip-events');
const siteFilterElement = document.querySelector('.trip-controls__filters');
const newEventButton = document.querySelector('.trip-main__event-add-btn');
newEventButton.addEventListener('click', handleNewPointButtonClick);

const pointModel = new PointsModel();
const filterModel = new FilterModel();
const routePresenter = new RoutePresenter({listContainer: siteListElement, pointModel, filterModel, onNewPointDestroy: handleNewPointFormClose});
const filterPresenter = new FilterPresenter({filterContainer: siteFilterElement, filterModel, pointModel});
routePresenter.init();
filterPresenter.init();

function handleNewPointFormClose() {
  newEventButton.disabled = false;
}

function handleNewPointButtonClick() {
  routePresenter.createPoint();
  newEventButton.disabled = true;
}
