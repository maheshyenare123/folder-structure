import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { StructureComponent } from './components/structure/structure.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FileUploadComponent, StructureComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'folder-structure';
  dir: any;
  selectedFolder: any;

  onGetFileData(fileData: any): void {
    console.log('fileData', fileData)
    this.dir = fileData;
    if (Object.keys(this.dir).length === 0) {
      this.selectedFolder = null;
    }
  }
}
