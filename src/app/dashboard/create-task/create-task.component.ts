import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Task } from '../../Model/Task';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements AfterViewInit{
  @Input() isEditMode:boolean;
  @Input() selectedTasks:Task;
  @ViewChild('taskForm') taskForm:NgForm;


  @Output()
  CloseForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  EventTaskData: EventEmitter<Task> = new EventEmitter<Task>();

  ngAfterViewInit(){
    setTimeout(() => {
      this.taskForm.form.patchValue(this.selectedTasks);
    }, 0);
  }


  OnCloseForm(event:Event){
    event.preventDefault();
    this.CloseForm.emit(false);
  }

  OnFormSubmitted(form:NgForm){
    this.EventTaskData.emit(form.value);
    this.CloseForm.emit(false);
  }
}