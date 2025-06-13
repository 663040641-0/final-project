import {Component, ElementRef, ViewChild} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card {
  @ViewChild('editDialog') editDialog!: ElementRef<HTMLDialogElement>;

  openEditDialog() {
    this.editDialog.nativeElement.showModal()
  }

  closeEditDialog() {
    this.editDialog.nativeElement.close()
  }

}
