import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, NgxDropzoneModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  files: File[] = [];
  @Output() fileData = new EventEmitter<any>(); // Emit file data

  /**
   * Selected file fron there event and send file for extraacting data file
   * @param event 
   */
  onSelect(event: any): void {
    if (this.files.length === 0) {
      this.files.push(...event.addedFiles);
      this.extractFileData(this.files[0]);
    }
  }

  /**
   * Extract data from file with parameter given as file
   * @param file 
   */
  extractFileData(file: File): void {
    const reader = new FileReader();

    // Define the callback for when file reading is complete
    reader.onload = (event: any) => {
      const fileContent = event.target.result; // File content as a string
      // You can further process fileContent here
      this.fileData.emit(JSON.parse(fileContent))
    };

    // Read the file content as text
    reader.readAsText(file);
  }

  /**
   *  Remove file from files list with help of file
   * @param file 
   */
  onRemove(file: File) {
    this.files = this.files.filter(f => f !== file);
    this.fileData.emit({}); // when file remove emit empty object
  }
}
