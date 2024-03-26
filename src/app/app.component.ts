import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './Services/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
    authService = inject(AuthService);

    ngOnInit(){
        this.authService.autoLogin();
    }

}