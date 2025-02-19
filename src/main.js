import FilterView from './view/filter-view.js';
import {render} from './render.js';
import RoutePresenter from './presenter/route-presenter.js';
import PointsModel from './model/point-model.js';

const siteListElement = document.querySelector('.trip-events');
const siteFilterElement = document.querySelector('.trip-controls__filters');
render(new FilterView(), siteFilterElement);

const pointModel = new PointsModel();
const routePresenter = new RoutePresenter({listContainer: siteListElement, pointModel});
routePresenter.init();
