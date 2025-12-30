import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './header.component.html'
})

export class Header {
  user = {
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/40'
  };
}
