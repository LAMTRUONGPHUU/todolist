import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-all-todos',
  imports: [CommonModule],
  templateUrl: './all-todos.component.html'
})
export class AllTodosComponent implements OnInit {
  todos: any[] = [];
  loading = false;
  error = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchTodos();
  }

  fetchTodos() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:3000/api/todo')
      .subscribe({
        next: (res) => {
          this.todos = res;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load todos';
          this.loading = false;
        }
      });
  }
}
