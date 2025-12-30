import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  standalone: true,
  selector: 'todo-input',
  template: `
    <div class="space-y-2 mb-4">
      <input #title
        class="w-full border px-3 py-2 rounded"
        placeholder="Todo title" />

      <textarea #content
        class="w-full border px-3 py-2 rounded"
        placeholder="Description (optional)"></textarea>

      <button
        (click)="submit(title.value, content.value); title.value=''; content.value=''"
        class="bg-blue-600 text-white px-4 py-2 rounded">
        Add Todo
      </button>
    </div>
  `
})
export class TodoInputComponent {
  @Output() create = new EventEmitter<{ title: string; content?: string }>();

  submit(title: string, content: string) {
    if (!title.trim()) return;
    this.create.emit({ title, content });
  }
}
