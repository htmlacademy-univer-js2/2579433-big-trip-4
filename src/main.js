import FilterView from './view/filter-view.js';
import {render} from './render.js';
import RoutePresenter from './presenter/route-presenter.js';

const siteListElement = document.querySelector('.trip-events');
const siteFilterElement = document.querySelector('.trip-controls__filters');
render(new FilterView(), siteFilterElement);

const routePresenter = new RoutePresenter({listContainer: siteListElement});
routePresenter.init();
