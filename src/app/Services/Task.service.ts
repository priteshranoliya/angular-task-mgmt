import { Injectable, inject } from "@angular/core";
import { Task } from "../Model/Task";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Subject, catchError, exhaustMap, map, take, throwError } from "rxjs";
import { LoggingService } from "./logging.service";
import { AuthService } from "./auth-service";

@Injectable({
    providedIn:'root'
})

export class TaskService{

    http: HttpClient = inject(HttpClient);
    errorSubject = new Subject<HttpErrorResponse>();
    loggingService:LoggingService = inject(LoggingService);
    authService = inject(AuthService);

    CreateTasks(data:Task){
        const headers = new HttpHeaders({'my-header':'hello-world'});
        this.http.post<{ name: string }>
        (
            'https://angularhttpclient-f53c5-default-rtdb.firebaseio.com/tasks.json',
            data,{headers:headers}
        )
        .pipe(catchError((err)=>{
            const errorObj = {statusCode:err.status,errorMessage:err.message,dateTime:new Date()};
            this.loggingService.logError(errorObj);
            return throwError(()=>{err});
        }))
        .subscribe({
            error: (err)=>{this.errorSubject.next(err)}
        });
    }

    deleteSingleTask(id:string | undefined){
        this.http.delete('https://angularhttpclient-f53c5-default-rtdb.firebaseio.com/tasks/'+id+'.json')
        .pipe(catchError((err)=>{
            const errorObj = {statusCode:err.status,errorMessage:err.message,dateTime:new Date()};
            this.loggingService.logError(errorObj);
            return throwError(()=>{err});
        })).subscribe({
            error: (err)=>{this.errorSubject.next(err)}
        });
    }

    deleteAllTasks(){
        this.http.delete('https://angularhttpclient-f53c5-default-rtdb.firebaseio.com/tasks.json')
        .pipe(catchError((err)=>{
            const errorObj = {statusCode:err.status,errorMessage:err.message,dateTime:new Date()};
            this.loggingService.logError(errorObj);
            return throwError(()=>{err});
        }))
        .subscribe({
            error: (err)=>{this.errorSubject.next(err)}
        });
    }

    getAllTasks(){

        // return this.http.get('https://angularhttpclient-f1d30-default-rtdb.firebaseio.com/tasks.json').pipe(map((response) => {
        //     //TRANSFORM DATA
        //     let tasks = [];
        //     console.log(response);
        //     for (let key in response) {
        //         if (response.hasOwnProperty(key)) {
        //             tasks.push({ ...response[key], id: key });
        //         }
        //     }
        //     return tasks;
        // }), catchError((err) => {
        //     //Write the logic to log errors
        //     const errorObj = { statusCode: err.status, errorMessage: err.message, dateTime: new Date() }
        //     this.loggingService.logError(errorObj);
        //     return throwError(() => err);
        // }));

        return this.authService.user.pipe(
            take(1),
            exhaustMap((user) => {
                    // console.log("exhaustmap: "+user.token);
                    return this.http.get<{[key:string]:Task}>
                    (
                        'https://angularhttpclient-f53c5-default-rtdb.firebaseio.com/tasks.json',
                        {
                            params: new HttpParams().set('auth',user.token)
                        }
                    )     
                }
            ),
            map((response)=>{
            let tasks=[]
            for(let key in response){
              if(response.hasOwnProperty(key)){
                tasks.push({...response[key],id:key});
              }
            }
            return tasks;
          }), catchError(err=>{
            const errorObj = { statusCode:err.status,errorMessage:err.message,dateTime:new Date() };
            this.loggingService.logError(errorObj);
            return throwError(()=>err);
          }))

        
    
    }

    UpdateTask(id:string|undefined,data:Task){
        this.http.put('https://angularhttpclient-f53c5-default-rtdb.firebaseio.com/tasks/'+id+'.json',data)
        .pipe(catchError((err)=>{
            const errorObj = {statusCode:err.status,errorMessage:err.message,dateTime:new Date()};
            this.loggingService.logError(errorObj);
            return throwError(()=>{err});
        }))
        .subscribe({
            error: (err)=>{this.errorSubject.next(err)}
        })
    }


    getUniqueTask(id:string|undefined){
        return this.http.get('https://angularhttpclient-f53c5-default-rtdb.firebaseio.com/tasks/'+id+'.json')
    .pipe(map((response)=>{
      let uniqueTask={};
      uniqueTask = {...response,id:id};
      return uniqueTask;
    }), catchError((err)=>{
        const errorObj = {statusCode:err.status,errorMessage:err.message,dateTime:new Date()};
        this.loggingService.logError(errorObj);
        return throwError(()=>{err});
    })
    )
    }







}
