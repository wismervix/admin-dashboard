import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-the-sidebar',
  imports: [RouterModule],
  templateUrl: './the-sidebar.html',
  styleUrl: './the-sidebar.scss',
})
export class TheSidebar {
  isCollapsed = true;
  openSection: 'products' | 'users' | null = 'products';

  toggleSection(section: 'products' | 'users') {
    this.openSection = this.openSection === section ? null : section;
  }
}
