import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { StructureComponent } from './components/structure/structure.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FileUploadComponent, StructureComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'folder-structure';
  dir: any;
  selectedFolder: any;

  /**
   * Get data from child component
   * @param fileData 
   */
  onGetFileData(fileData: any): void {
    this.dir = fileData;
    if (Object.keys(this.dir).length === 0) {
      this.selectedFolder = {};
    }
  }
}
