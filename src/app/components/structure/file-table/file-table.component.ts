import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-file-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-table.component.html',
  styleUrl: './file-table.component.scss'
})
export class FileTableComponent {
  @Input() files: any; // Accept files input from parent

  getKeys(obj: any): string[] {
    console.log('obj', obj);
    return Object.keys(obj);
  }

  isFile(obj: any): boolean {
    return obj.type === 'file';
  }
}
