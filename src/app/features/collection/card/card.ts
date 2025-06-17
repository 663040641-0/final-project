import {Component, ElementRef, inject, OnInit, signal, ViewChild} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {Collections} from './collections.model';
import {Router} from '@angular/router';

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
  router= inject(Router);

  collections = signal<Collections[]>([]);
  editingItem = signal<Collections | null>(null);

  editForm = this.fb.nonNullable.group({
    Name: ['', Validators.required],
    Image: ['', Validators.required],
    Description: ['', Validators.required],
    Date: ['', Validators.required],
  })
  errorMessage: string | null = null;

  @ViewChild('editDialog') editDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

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

  //edit items
  openEditDialog(item: Collections) {
    this.editingItem.set(item);
    this.editForm.setValue({
      Name: item.name,
      Image: '', // skip this for file input
      Description: item.description,
      Date: item.date,
    });
    this.editDialog.nativeElement.showModal();
  }

  async onSubmit() {
    const user = this.authService.currentUser();
    const item = this.editingItem();

    if (!item || !user) return;

    const formData = this.editForm.value;

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = this.fileInput.nativeElement.files?.[0];

    let imageUrl = item.image_url;

    if (file) {
      const filePath = `${user.id}/images/${Date.now()}_${file.name}`;
      const { error: uploadError } = await this.authService.supabase
        .storage.from('collection')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Image upload failed', uploadError);
        return;
      }

      const { data: publicUrlData } = this.authService.supabase
        .storage.from('collection')
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    const { error } = await this.authService.supabase
      .from('User_Collection')
      .update({
        name: formData.Name,
        description: formData.Description,
        date: formData.Date,
        image_url: imageUrl,
      })
      .eq('id', item.id);

    if (!error) {
      console.log('Item updated');
      this.editDialog.nativeElement.close();
      this.editingItem.set(null);

      await this.router.navigateByUrl('/', { skipLocationChange: true });
      await this.router.navigate(['/collection']);
    }

    this.editDialog.nativeElement.close();
    this.editingItem.set(null);
  }

}
