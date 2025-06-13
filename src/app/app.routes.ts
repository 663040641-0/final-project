import { Routes } from '@angular/router';
import {Login} from './core/login/login';
import {Collection} from './features/collection/collection';
import {Register} from './core/register/register';

export const routes: Routes = [
  {
    path: '',
    component: Collection,
  },
  {
    path: 'login',
    component: Login,
  },{
    path: 'register',
    component: Register,
  }
];
