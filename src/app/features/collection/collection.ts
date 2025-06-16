import {Component, inject, OnInit} from '@angular/core';
import {Navbar} from './navbar/navbar';
import {Card} from './card/card';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-collection',
  imports: [
    Navbar,
    Card
  ],
  templateUrl: './collection.html',
  styleUrl: './collection.css'
})
export class Collection implements OnInit {

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        const user = session?.user;
        this.authService.currentUser.set(
          user
            ? {
              email: user.email!,
              username: user.user_metadata?.['username'] || '',
              id: user.id,
            }
            : null
        );
      } else if (event === 'SIGNED_OUT') {
        this.authService.currentUser.set(null);
      }

      console.log('[AUTH-EVENT]', event, session);
    });
  }
}
