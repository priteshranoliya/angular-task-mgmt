import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

@Injectable({
    providedIn:'root',
})

export class LoggingService{
    http:HttpClient = inject(HttpClient);

    logError(data : {statusCode:number,errorMessage:string,dateTime:Date}){
        this.http.post('https://angularhttpclient-f53c5-default-rtdb.firebaseio.com/log.json',data)
        .subscribe()
    }

    fetchError(){
        this.http.get('https://angularhttpclient-f53c5-default-rtdb.firebaseio.com/log.json').subscribe(
            (data)=>{
                console.log(data);
            }
        )
    }
}