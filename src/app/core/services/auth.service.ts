import {Injectable, signal} from '@angular/core';
import {AuthResponse, createClient} from '@supabase/supabase-js'
import type { SupabaseClient, Session} from '@supabase/supabase-js';
import {environment} from '../../../environments/environment';
import {catchError, from, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  supabase: SupabaseClient;
  constructor() {
    if (!environment.supabaseUrl || !environment.supabaseKey) {
      throw new Error('Supabase environment variables are not set correctly');
    }
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }
  currentUser = signal<{email:string, username:string} | null> (null);

  register(email: string, username: string, password: string):Observable<AuthResponse> {
    const promise = this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    return from(promise);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    if (!this.supabase || !this.supabase.auth) {
      return throwError(() => new Error('Supabase client not initialized'));
    }

    const promise = this.supabase.auth.signInWithPassword({ email, password });
    return from(promise).pipe(
      catchError(err => {
        console.error('Supabase login error:', err);
        return throwError(() => new Error('Login failed. Please try again.'));
      })
    );
  }


  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
  }

  setCurrentUserFromSession(session: Session | null): void {
    if (session?.user) {
      const { email, user_metadata } = session.user;
      this.currentUser.set({
        email: email!,
        username: user_metadata?.['username'] || '',
      });
    } else {
      this.currentUser.set(null);
    }
  }


}
