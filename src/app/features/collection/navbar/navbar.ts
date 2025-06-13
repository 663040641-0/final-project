import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  @ViewChild('navDialog') navDialog!: ElementRef<HTMLDialogElement>;

  openNavDialog() {
    this.navDialog.nativeElement.showModal()
  }

  closeNavDialog() {
    this.navDialog.nativeElement.close()
  }
}
