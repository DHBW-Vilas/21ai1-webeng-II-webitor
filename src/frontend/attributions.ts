import { insertStyleSelector, loadStyleFromCache } from './common';

loadStyleFromCache();
insertStyleSelector('beforeend', document.querySelector('header') as HTMLElement);
