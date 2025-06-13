import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-login',
    imports: [
      ReactiveFormsModule,
      RouterLink
    ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true,
})
export class Login {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })
  errorMessage: string | null = null;

  onSubmit(): void {
    const rawForm = this.form.getRawValue()
    this.authService
      .login(rawForm.email, rawForm.password)
      .subscribe((result) => {
        if (result.error) {
          this.errorMessage = result.error.message;
        }else {
          this.router.navigateByUrl('/');
        }
      })
  }
}
