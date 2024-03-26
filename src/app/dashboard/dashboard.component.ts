import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Task } from '../Model/Task';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { TaskService } from '../Services/Task.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy{
  showCreateTaskForm: boolean = false;
  showTaskDetails:boolean = false;
  allTasks: Task[] = []; //initially empty array
  currentTask: Task | null = null; 
  message:string = '';
  EditMode:boolean = false;
  selectedTasksIn:Task;
  currentTaskId:string = '';
  isLoading:boolean = false;
  errorMsg: string|null = null;
  errorSub : Subscription;
  router:Router = inject(Router);

  taskService:TaskService = inject(TaskService);
  
  ngOnInit(){
      this.fetchAllTasks();
      this.errorSub = this.taskService.errorSubject.subscribe({
        next:(httpError)=>{
          this.setErrorMsg(httpError);
        }
      })
  }

  ngOnDestroy(){
      this.errorSub.unsubscribe();
  }


  OpenCreateTaskForm(){
    this.showCreateTaskForm = true;
    this.EditMode = false;
    this.selectedTasksIn = {
      desc:'',
      title:'',
      assignedTo:'',
      createdAt:'',
      priority:'',
      status:'',
    }
  }

  CloseCreateTaskForm(){
    this.showCreateTaskForm = false;
  }

  CreateOrUpdateTask(data:Task){
    if(!this.EditMode)
      this.taskService.CreateTasks(data);
    else
      this.taskService.UpdateTask(this.currentTaskId,data);
      
    this.fetchAllTasks();
    
  }

  fetchAllTasksForm(){
    this.fetchAllTasks();
  }

  private fetchAllTasks(){
    this.isLoading = true;
    this.taskService.getAllTasks()
    .subscribe(
      {
        next: (tasksArray)=>{
          this.allTasks = tasksArray;
          this.isLoading = false;
        },
        error: (error) => {
          this.setErrorMsg(error);
          this.isLoading = false;
        }
      }
    ); 
  }

  private setErrorMsg(err: HttpErrorResponse){
    if(err.error.error === 'Permission denied'){
      this.errorMsg = 'You do not have permission to perform this action!';
    }
    else{
      // console.log(err.error.error);
      // this.errorMsg = err.message;
      this.errorMsg = err.error.error;
    }
    setTimeout(() => {
      this.errorMsg = null;
    }, 3000);
  }

  deleteTask(id:string | undefined){
    this.taskService.deleteSingleTask(id);
    this.fetchAllTasks();
  }

  deleteAllTasks(){
    this.taskService.deleteAllTasks();
    this.fetchAllTasks();

  }

  UpdateTasks(id:string|undefined){
    this.currentTaskId = id;
    this.showCreateTaskForm = true;
    this.EditMode = true;
    this.selectedTasksIn = this.allTasks.find((task)=>{return task.id === id});
    this.fetchAllTasks();
  }

  //click on i icon and u will be shown task desc and all info....
  showTaskDetailsClick(id:string|undefined){
    this.taskService.getUniqueTask(id)
    .subscribe({
      next: (data : Task)=>{
        this.currentTask = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.setErrorMsg(error);
        this.isLoading = false;
      }
    });
    console.log('hi there')
    this.showTaskDetails = true;
  }

  OnCloseTaskDetailsDashBoard(){
    this.showTaskDetails = false;
  }




}