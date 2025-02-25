import RoutePresenter from './presenter/route-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/point-model.js';

const siteListElement = document.querySelector('.trip-events');
const siteFilterElement = document.querySelector('.trip-controls__filters');

const pointModel = new PointsModel();
const routePresenter = new RoutePresenter({listContainer: siteListElement, pointModel});
const filterPresenter = new FilterPresenter({filterContainer: siteFilterElement});
routePresenter.init();
filterPresenter.init();
