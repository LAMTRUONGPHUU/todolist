import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  template: `
    <app-header></app-header>

    <main class="max-w-7xl mx-auto p-4">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class App {
  protected readonly title = signal('client');
}
