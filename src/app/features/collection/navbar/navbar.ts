import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  addForm = this.fb.nonNullable.group({
    Name: ['', Validators.required],
    Image: ['', Validators.required],
    Description: ['', Validators.required],
    Date: ['', Validators.required],
  })
  errorMessage: string | null = null;

  @ViewChild('navDialog') navDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('errorDialog') errorDialog!: ElementRef<HTMLDialogElement>;

  openNavDialog() {
    this.navDialog.nativeElement.showModal()
  }

  closeNavDialog() {
    this.navDialog.nativeElement.close()
  }

  async onSubmit() {
    const user = this.authService.currentUser();
    const formData = this.addForm.value;

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput.files?.[0];

    let imageUrl = '';

    if (file) {
      const filePath = `${user?.id}/images/${Date.now()}_${file.name}`;

      const {error: uploadError} = await this.authService.supabase
        .storage
        .from('collection')  // create a bucket in Supabase Storage
        .upload(filePath, file);

      if (uploadError) {
        console.error('Image upload failed', uploadError);
        return;
      }

      const {data: publicUrlData} = this.authService.supabase
        .storage
        .from('collection')
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    const {error} = await this.authService.supabase
      .from('User_Collection')
      .insert({
        name: formData.Name,
        description: formData.Description,
        date: formData.Date,
        image_url: imageUrl,
        user_id: user?.id,
      });

    if (error) {
      this.errorDialog.nativeElement.showModal();
      console.error('Submit error', error);
    } else {
      console.log('Data submitted');
      this.addForm.reset();
      this.closeNavDialog();
      await this.router.navigateByUrl('/', { skipLocationChange: true });
      await this.router.navigate(['/collection']);
    }
  }

}
