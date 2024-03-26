import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from '../Services/auth-service';
import { User } from '../Model/User';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  authService = inject(AuthService);  
  isLoggedIn: boolean = false;
  private userSubject: Subscription;

  ngOnInit(){
      this.userSubject = this.authService.user.subscribe((user : User) => {
        this.isLoggedIn = user ? true : false;
      })
  }

  ngOnDestroy(){
      this.userSubject.unsubscribe();
  }

  onLogOut(){
    this.authService.logout();
  }
}