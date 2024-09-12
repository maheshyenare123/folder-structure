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
    console.log('folder:', folder);
    const result = this.collectData(folder);
    console.log('Files:', result.files);
    const result2 = this.processFileList(result.files)
    console.log('Files:', result2);
    const data = {
      folder: folder,
      fileList: result2,
      
    }
    this.folderSelected.emit(data); // Emit folder if it contains files
  }

  collectData(
    data: any,
    currentPath: string[] = [],
    directories: string[] = [],
    fileList: FileItem[] = []
  ): { files: FileItem[] } {
    let numberOfFiles = 0;

    for (const key in data) {
      const value = data[key];

      if (typeof value === 'object' && value.type === 'file') {
        // Add file information to fileList with its path
        fileList.push({
          name: key,
          modification_date: value.modification_date,
          hash: value.hash,
          path: [...currentPath, key].join('/'),
        });
        numberOfFiles++;
      } else if (typeof value === 'object' && value.type === 'directory') {
        // Recurse into directories
        this.collectData(value, [...currentPath, key], [...directories, key], fileList);
      }
    }
    return { files: fileList };
  }

  processFileList(fileList: FileItem[]): FileItem[] {
    const fileOccurrences = new Map<string, number>();

    // Count occurrences of each file name
    fileList.forEach(file => {
      const key = file.name;
      const count = (fileOccurrences.get(key) || 0) + 1;
      fileOccurrences.set(key, count);
    });

    // Update occurrences in fileList
    return fileList.map(file => ({
      ...file,
      occurrences: fileOccurrences.get(file.name)
    }));
  }
}

export interface FileItem {
  name: string;
  modification_date: string;
  hash: string;
  path: string;
}

export interface DirectoryItem {
  name: string;
  modification_date: string;
  numberOfFiles: number;
}
