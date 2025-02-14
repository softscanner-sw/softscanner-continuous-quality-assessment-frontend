import { Component, Input } from '@angular/core';

/**
 * Component to display a progress indicator with a spinner and a list of progress logs.
 */
@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css'
})
export class ProgressBarComponent {
  /**
   * Input property to accept an array of log messages to be displayed in the progress bar.
   */
  @Input() progressLogs: string[] = [];

  /**
   * A flag to control the visibility of the spinner.
   * Defaults to true, meaning the spinner is initially visible.
   */
  visible: boolean = true;
}
