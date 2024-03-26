import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, tap } from "rxjs";

export class AuthInterceptorService implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler){
        console.log('Auth Intercept called!');
        const modifiedReq = req.clone();
        return next.handle(modifiedReq).pipe(tap((event)=>{
            if(event.type === HttpEventType.Response){
                console.log("Response has arrived....Response Data: ");
                console.log(event.body);
            }
        }));
    }
}