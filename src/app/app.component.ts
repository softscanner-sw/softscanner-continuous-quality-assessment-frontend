import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The main component of the application.
 * It coordinates metadata submission, goal selection, progress monitoring, and quality assessment.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush  // Optimize rendering using OnPush strategy
})
export class AppComponent {
  title = 'SoftScanner: Continuous Quality Web Assessment UI'; // Application title
}