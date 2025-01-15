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

  toggleState: boolean = false;

  // Emit metadata when the toggle is turned on, and reset it when turned off
  onToggle() {
    if (!this.isFilled()){
      alert('Please fill out the required metadata.');
      return;
    }

    this.toggleState = !this.toggleState;

    if (this.toggleState) {
      // console.log('Emitting metadata:', this.appMetadata);
      this.metadataSubmitted.emit({ ...this.appMetadata });
    } else {
      // console.log('Clearing metadata');
      this.metadataSubmitted.emit({});
    }
  }

  isFilled() {
    return this.appMetadata.name && this.appMetadata.path
      && this.appMetadata.technology && this.appMetadata.type
      && this.appMetadata.url;
  }
}
