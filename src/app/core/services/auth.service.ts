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
  currentUser = signal<{email:string, username:string, id:string} | null> (null);

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

  async getUserCollections(userId: string) {
    const { data, error } = await this.supabase
      .from('User_Collection')
      .select('*')
      .eq('user_id', userId); // fetch only collections for the current user

    if (error) {
      console.error('Error fetching collections:', error);
      return [];
    }

    return data;
  }



}
