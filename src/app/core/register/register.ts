import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink, Router} from "@angular/router";
import {AuthService} from '../services/auth.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-register',
    imports: [
        ReactiveFormsModule,
        RouterLink
    ],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true,
})
export class Register {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });
  errorMessage: string | null = null;

  onSubmit() :void {
    const rawForm = this.form.getRawValue()
    this.authService
      .register(rawForm.email, rawForm.username ,rawForm.password)
      .subscribe((result) => {
      if (result.error) {
        this.errorMessage = result.error.message;
      }else {
        this.router.navigateByUrl('/');
      }
    })
  }
}
