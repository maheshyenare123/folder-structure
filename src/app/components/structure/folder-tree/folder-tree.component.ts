import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-folder-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss'
})
export class FolderTreeComponent implements OnChanges {
  @Input() dir: any; // Take directory input from parent component
  @Output() folderSelected = new EventEmitter<any>(); // Emit selected folder
  expanded: { [key: string]: boolean } = {}; // Track which directories are expanded

  ngOnChanges(changes: SimpleChanges): void {
    this.expanded = {};
  }


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
    const result = this.collectData(folder);
    const result2 = this.processFileList(result.files)
    const result3 = this.filterFileList(result2);

    // Case 1: All files
    const data = {
      folder: folder,
      fileList: result2,
    }

    // Case 2: filtered files
    // const data = {
    //   folder: folder,
    //   fileList: result3,
    // }

    // Case 3: what inside directory
    // const data = folder;
    this.folderSelected.emit(data); // Emit folder if it contains files
  }

  // make file list according to the portion of directory access
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

  // find out the no of occurence for same file name
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

  // filter the file list according to file name.
  filterFileList(fileItems: FileItem[]): FileItem[] {
    const filteredFilesMap = fileItems.reduce((accumulator, currentFile) => {
      const fileName = currentFile.name;

      // Add the file to the map if it doesn't already exist
      if (!accumulator.has(fileName)) {
        accumulator.set(fileName, currentFile);
      }

      return accumulator;
    }, new Map<string, FileItem>());

    // Convert the map values back to an array
    return Array.from(filteredFilesMap.values());
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
