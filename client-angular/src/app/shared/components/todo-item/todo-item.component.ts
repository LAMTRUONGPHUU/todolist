
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../../../core/models/todo.models';
import { TodoStatus } from '../../../core/enums/todo-status.enum';

@Component({
  selector: 'todo-item',
  standalone: true,
  templateUrl: './todo-item.component.html'
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() statusChange = new EventEmitter<TodoStatus>();

  TodoStatus = TodoStatus;
}
