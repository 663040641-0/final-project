import { Component } from '@angular/core';
import {Navbar} from './navbar/navbar';
import {Card} from './card/card';

@Component({
  selector: 'app-collection',
  imports: [
    Navbar,
    Card
  ],
  templateUrl: './collection.html',
  styleUrl: './collection.css'
})
export class Collection {

}
