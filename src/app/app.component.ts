import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Continuous Quality Web Assessment';
  metadata: any;

  onMetadataSubmit(metadata: any) {
    this.metadata = metadata;
  }
}
