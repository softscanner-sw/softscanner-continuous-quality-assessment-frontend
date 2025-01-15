import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-metadata-form',
  templateUrl: './metadata-form.component.html',
  styleUrl: './metadata-form.component.css'
})
export class MetadataFormComponent {
  @Output() metadataSubmitted = new EventEmitter<any>();

  appMetadata = {
    name: '',
    type: '',
    technology: '',
    path: '',
    url: ''
  };

  onSubmit() {
    this.metadataSubmitted.emit(this.appMetadata);
  }
}
