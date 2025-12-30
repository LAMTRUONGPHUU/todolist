import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TodoStatus } from '../enums/todo-status.enum';
import { Todo } from '../models/todo.models';

@Injectable({ providedIn: 'root' })
export class TodoApiService {
  private API_URL = 'http://localhost:3000/api/todos';

  todos = signal<Todo[]>([]);
  loading = signal(false);

  constructor(private http: HttpClient) { }

  getAll() {
    this.loading.set(true);
    this.http.get<Todo[]>(this.API_URL).subscribe({
      next: res => this.todos.set(res),
      complete: () => this.loading.set(false),
    });
  }

  create(data: { title: string; content?: string }) {
    return this.http.post<Todo>(this.API_URL, data);
  }

  updateStatus(id: string, status: TodoStatus) {
    return this.http.patch<Todo>(
      `${this.API_URL}/${id}`,
      { status }
    );
  }

  delete(id: string) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
