import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-card',
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule
  ],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card {
  fb = inject(FormBuilder);

  editForm = this.fb.nonNullable.group({
    Name: ['', Validators.required],
    Image: ['', Validators.required],
    Description: ['', Validators.required],
    Date: ['', Validators.required],
  })
  errorMessage: string | null = null;

  @ViewChild('editDialog') editDialog!: ElementRef<HTMLDialogElement>;

  openEditDialog() {
    this.editDialog.nativeElement.showModal()
  }

  closeEditDialog() {
    this.editDialog.nativeElement.close()
  }

  onSubmit() {

  }
}
