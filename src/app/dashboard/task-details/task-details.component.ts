import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../Model/Task';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent {
  @Output()
  CloseDetailView: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input('uniqueTask') currentTask: Task | null = null;

  OnCloseTaskDetails(event:Event){
    event.preventDefault();
    this.CloseDetailView.emit(false);
  }


}