import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FolderTreeComponent } from './folder-tree/folder-tree.component';
import { FileTableComponent } from './file-table/file-table.component';

@Component({
  selector: 'app-structure',
  standalone: true,
  imports: [CommonModule, FolderTreeComponent, FileTableComponent],
  templateUrl: './structure.component.html',
  styleUrl: './structure.component.scss'
})

export class StructureComponent {
  @Input() dir: any; // Take directory input from parent component
  @Input() selectedFolder: any;

  // This method is called when a folder is selected from the folder tree
  onFolderSelected(folder: any): void {
    this.selectedFolder = folder;
  }

}
