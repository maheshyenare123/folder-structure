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

  /**
   * Initialize variable when input changes
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.expanded = {};
  }


  /**
   * Toggle the state of directory expansion with help of key
   * @param key 
   */
  toggleDirectory(key: string): void {
    this.expanded[key] = !this.expanded[key];
  }

  /**
   * Check if directory is expanded
   * @param key 
   * @returns 
   */
  isExpanded(key: string): boolean {
    return this.expanded[key];
  }

  /**
   * Get object keys (directory and file names)
   * @param obj 
   * @returns 
   */
  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  /**
   * Check if the item is a directory
   * @param obj 
   * @returns 
   */
  isDirectory(obj: any): boolean {
    return obj.type === 'directory';
  }

  /**
   * Check if the item is a file
   * @param obj 
   * @returns 
   */
  isFile(obj: any): boolean {
    return obj.type === 'file';
  }

  /**
   * For event emit, emit data from one component to other
   * @param folder 
   */
  selectFolder(folder: any): void {
    const result = this.collectData(folder);
    const result2 = this.processFileList(result.files)
    const result3 = this.filterFileList(result2);

    // Case 1: All files
    // const data = {
    //   folder: folder,
    //   fileList: result2,
    // }

    // Case 2: filtered files
    const data = {
      folder: folder,
      fileList: result3,
    }

    // Case 3: what inside directory
    // const data = folder;
    this.folderSelected.emit(data); // Emit folder if it contains files
  }

  /**
   * Make file list according to the portion of directory access and return file list as result
   * @param data 
   * @param currentPath 
   * @param directories 
   * @param fileList 
   * @returns 
   */
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

  /**
   * Find out the no of occurence for same file name
   * @param fileList 
   * @returns 
   */
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

  /**
   * Filter the file list according to file name.
   * @param fileItems 
   * @returns 
   */
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
