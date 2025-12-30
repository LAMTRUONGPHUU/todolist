import { Routes } from '@angular/router';
import { AllTodosComponent } from './shared/components/all-todos/all-todos.components';

export const routes: Routes = [
  { path: '', component: AllTodosComponent },
  { path: 'today', component: AllTodosComponent },
  { path: 'completed', component: AllTodosComponent }
];
