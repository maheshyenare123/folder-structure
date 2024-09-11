import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-folder-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss'
})
export class FolderTreeComponent {
  @Input() dir: any; // Take directory input from parent component
  @Output() folderSelected = new EventEmitter<any>(); // Emit selected folder
  expanded: { [key: string]: boolean } = {}; // Track which directories are expanded

  // Toggle the state of directory expansion
  toggleDirectory(key: string): void {
    this.expanded[key] = !this.expanded[key];
  }

  // Check if directory is expanded
  isExpanded(key: string): boolean {
    return this.expanded[key];
  }

  // Get object keys (directory and file names)
  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  // Check if the item is a directory
  isDirectory(obj: any): boolean {
    return obj.type === 'directory';
  }

  // Check if the item is a file
  isFile(obj: any): boolean {
    return obj.type === 'file';
  }

  selectFolder(folder: any): void {
    // Check if the folder contains any items of type 'file'
    // const hasFiles = Object.keys(folder).some(key => folder[key].type === 'file');

    // if (hasFiles) {
    this.folderSelected.emit(folder); // Emit folder if it contains files
    // } else {
    //   console.log('This folder does not contain any files');
    // }
  }
}
