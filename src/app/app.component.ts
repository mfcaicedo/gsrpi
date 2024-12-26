import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppLayoutModule } from './layout/app.layout.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, AppLayoutModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gsrpi';
}
