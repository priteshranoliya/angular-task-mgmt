import { Component, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../Services/auth-service';
import { Observable } from 'rxjs';
import { AuthResponse } from '../Model/AuthResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoginMode:boolean = true;
  authService: AuthService = inject(AuthService);
  isLoading: boolean = false;
  errorMessage: string | null = null;
  authObservable: Observable<AuthResponse>;
  router:Router = inject(Router);

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onFormSubmitted(form: NgForm){
    // console.log(form.value.email);
    if(this.isLoginMode){
      this.isLoading = true;
      this.authObservable = this.authService.login(form.value.email,form.value.password);
    }
    else{
      this.isLoading = true
      this.authObservable = this.authService.signup(form.value.email,form.value.password);
    }

    this.authObservable.subscribe({
      next: (res) => {
        // console.log(res);
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (errMsg) => {
        this.errorMessage = errMsg;
        this.isLoading = false;
        this.hideSnackbar();
      },
    });

    form.reset();
  }

  hideSnackbar(){
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }


}


