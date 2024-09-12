import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-file-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-table.component.html',
  styleUrl: './file-table.component.scss'
})
export class FileTableComponent implements OnChanges {
  @Input() files: any; // Accept files input from parent
  expanded: { [index: string]: boolean } = {}; // Track which row are expanded
  foldersWithFileName: any[] = [];

  /**
   * Initialize variable when input changes
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.expanded = {};
    this.foldersWithFileName = [];
  }

  /**
   * Return keys from object
   * @param obj 
   * @returns 
   */
  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  /**
   * Check for object contain file type return boolean condition
   * @param obj 
   * @returns 
   */
  isFile(obj: any): boolean {
    return obj.type === 'file';
  }

  /**
   * Toggle the state of row expansion with help of index
   * @param index 
   */
  toggleRow(index: number): void {
    this.expanded[index] = !this.expanded[index];
  }

  /**
   * Get folder list by file name that file exist in folder structure
   * @param fileName 
   */
  getFolderList(fileName: string) {
    this.foldersWithFileName = this.findFoldersWithFile(this.files.folder, fileName);
  }

  /**
   * Function to recursively search for folders containing the file with the same name and return folder list as result by giving parameter as repository and file name
   * @param repository 
   * @param fileName 
   * @returns 
   */
  findFoldersWithFile(repository: any, fileName: string) {
    const result: any[] = [];
    function traverse(directory: any, path: string) {
      let fileCount = 0; // Counter for files in the directory, excluding the target file
      let containsFile = false; // Flag to check if folder contains the target file
      for (const key in directory) {
        const item = directory[key];

        if (typeof item === "object" && item.type === "file") {
          if (key === fileName) {
            containsFile = true; // Found the target file
          } else {
            fileCount++; // Count other files
          }
        }
        // push data in result array
        if (typeof item === "object" && item.type === "file" && key === fileName) {
          result.push({ folder: path, modification_date: directory.modification_date, file_count: fileCount });
        }

        // recursive traverse for nested directory
        if (typeof item === "object" && item.type === "directory") {
          traverse(item, `${path}/${key}`);
        }
      }
    }

    // recursive traverse from root
    traverse(repository, "");
    return result;
  }

  /**
   * Check if row is expanded with help of index
   * @param index 
   * @returns 
   */
  isExpanded(index: number): boolean {
    return this.expanded[index];
  }

}
