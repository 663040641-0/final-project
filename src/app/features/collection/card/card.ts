import {Component, ElementRef, inject, OnInit, signal, ViewChild} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {Collections} from './collections.model';

@Component({
  selector: 'app-card',
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule
  ],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card implements OnInit {
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  collections = signal<Collections[]>([]);

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
  //fetch data from supabase database
  ngOnInit(): void {
    const checkUser = setInterval(() => {
      const user = this.authService.currentUser();
      if (user?.id) {
        clearInterval(checkUser);
        this.authService.getUserCollections(user.id).then(result => {
          this.collections.set(result);
        });
      }
    }, 100); // check every 100ms until user is available
  }

  //delete item
  async deleteItem(id: string) {
    const { error } = await this.authService.supabase
      .from('User_Collection')
      .delete()
      .eq('id', id); // delete where id = your provided id

    if (error) {
      console.error('Delete failed', error);
    } else {
      console.log('Item deleted');
      this.collections.set(
        this.collections().filter(item => item.id !== id)
      );
    }
  }


  onSubmit() {

  }
}
