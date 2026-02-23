import { Component } from '@angular/core';
import { TheSidebar } from '../the-sidebar/the-sidebar';
import { RouterOutlet } from '@angular/router';
import { TheHeader } from "../the-header/the-header";

@Component({
  selector: 'app-dashboard-layout',
  imports: [TheSidebar, RouterOutlet, TheHeader],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {}
