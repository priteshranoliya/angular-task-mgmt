import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export class LoggingInterceptorService implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        console.log("Request sent to URL: "+ req.url);
        return next.handle(req);
    }
}