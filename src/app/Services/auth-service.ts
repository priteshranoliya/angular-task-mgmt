import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { AuthResponse } from "../Model/AuthResponse";
import { BehaviorSubject, Subject, catchError, tap, throwError } from "rxjs";
import { User } from "../Model/User";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root',
})

export class AuthService{
    http: HttpClient = inject(HttpClient);
    user = new BehaviorSubject<User>(null);
    router:Router = inject(Router);
    private tokenExpiresTime: any;


    signup(email:string, password:string){
        const data = {email:email, password:password, returnSecureToken:true};
        return this.http.post<AuthResponse>
        (
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDBncG2xrew-Z-PGok2C4frOWMwD7VvED8',data
        ).pipe(
            catchError(this.handleError), 
            tap(
                (res) => {this.handleCreateUser(res);}
            )
        )
    }


    login(email:string,password:string){
        const data = {email:email, password:password, returnSecureToken:true};
        return this.http.post<AuthResponse>
        ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDBncG2xrew-Z-PGok2C4frOWMwD7VvED8',
        data).pipe(
            catchError(this.handleError),
            tap(
                (res) => {this.handleCreateUser(res);}
            )
        )
    }

    logout(){
        this.user.next(null);
        this.router.navigate(['/login']);
        localStorage.removeItem('user');

        if(this.tokenExpiresTime){
            clearTimeout(this.tokenExpiresTime);
        }

        this.tokenExpiresTime = null;
    }

    autoLogin(){
        const user = JSON.parse(localStorage.getItem('user'));

        if(!user){
            return null;
        }
        user._expiresIn = new Date(user._expiresIn);
        const loggedUser = new User(user.email,user.id,user._token,user._expiresIn);

        if(loggedUser.token){
            this.user.next(loggedUser);
            const timerValue = user._expiresIn.getTime() - new Date().getTime();
            // console.log(timerValue);
            this.autoLogout(timerValue); 
        }
    }

    autoLogout(expireTime:number){
        this.tokenExpiresTime = setTimeout(() => {
            this.logout();
        }, expireTime);
    }

    private handleCreateUser(res){
        const expiresInTimeStamp = new Date().getTime() + +res.expiresIn * 1000;
        const expiresIn = new Date(expiresInTimeStamp);
        const user = new User(res.email,res.localId,res.idToken,expiresIn);
        this.user.next(user);

        this.autoLogout(res.expiresIn * 1000);

        localStorage.setItem('user',JSON.stringify(user));
    }

    private handleError(err){
        // console.log(err);
        let errorMessage = 'An unknown error has occured!';
        if(!err.error || !err.error.error){
            return throwError(()=> errorMessage);
        }
        switch(err.error.error.message){
            case 'EMAIL_EXISTS':
                errorMessage = "This email already exists";
                break;
            case 'OPERATION_NOT_ALLOWED':
                errorMessage = "This opeartion is not allowed to perform";
                break;
            case 'INVALID_LOGIN_CREDENTIALS':
                errorMessage = "The Email ID or Password is not correct."
                break;
        }
        return throwError(()=>errorMessage);
    }
}