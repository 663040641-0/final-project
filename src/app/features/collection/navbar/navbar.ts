import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';
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

  addForm = this.fb.nonNullable.group({
    Name: ['', Validators.required],
    Image: ['', Validators.required],
    Description: ['', Validators.required],
    Date: ['', Validators.required],
  })
  errorMessage: string | null = null;

  @ViewChild('navDialog') navDialog!: ElementRef<HTMLDialogElement>;

  openNavDialog() {
    this.navDialog.nativeElement.showModal()
  }

  closeNavDialog() {
    this.navDialog.nativeElement.close()
  }

  onSubmit() {

  }
}
