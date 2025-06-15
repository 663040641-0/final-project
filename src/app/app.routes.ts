import { Routes } from '@angular/router';
import {Login} from './core/login/login';
import {Collection} from './features/collection/collection';
import {Register} from './core/register/register';
import {NotFound} from './features/not-found/not-found';
import {Home} from './features/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'collection',
    component: Collection,
  },
  {
    path: '**',
    component: NotFound,
  }
];
