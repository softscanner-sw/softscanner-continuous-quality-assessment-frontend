import { Component, EventEmitter, Output } from '@angular/core';

/**
 * Component for collecting and emitting application metadata.
 */
@Component({
  selector: 'app-metadata-form',
  templateUrl: './metadata-form.component.html',
  styleUrl: './metadata-form.component.css'
})
export class MetadataFormComponent {
  // Event emitter for sending metadata to the parent component
  @Output() metadataSubmitted = new EventEmitter<any>();

  /**
   * Object to hold metadata inputs from the form.
   */
  appMetadata = {
    name: '',
    type: '',
    technology: '',
    path: '',
    url: ''
  };

  // State to track whether metadata is set
  toggleState: boolean = false;

  /**
   * Method called when the form is submitted.
   * Toggles the state and emits metadata if all fields are filled.
   */
  onToggle() {
    if (!this.isFilled()){
      // Alert if not all fields are filled
      alert('Please fill out the required metadata.');
      return;
    }

    // Toggle the state
    this.toggleState = !this.toggleState;

    if (this.toggleState) {
      // Emit the filled metadata
      this.metadataSubmitted.emit({ ...this.appMetadata });
    } else {
      // Emit an empty object to indicate metadata reset
      this.metadataSubmitted.emit({});
    }
  }

  /**
   * Helper method to check if all fields are filled.
   */
  isFilled() {
    return this.appMetadata.name && this.appMetadata.path
      && this.appMetadata.technology && this.appMetadata.type
      && this.appMetadata.url;
  }
}
