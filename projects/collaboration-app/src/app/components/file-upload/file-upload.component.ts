import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-file-upload',
  imports:[ChatComponent],
  standalone:true,
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  selectedFiles: File[] = [];

  constructor(private http: HttpClient) {}

  onFileSelect(event: any): void {
    this.selectedFiles = event.target.files;
  }
  onSubmit(): void {
    const formData = new FormData();
    for (let file of this.selectedFiles) {
        formData.append('files', file, file.name);
    }

    this.uploadFiles(formData).subscribe({
        next: (response) => {
            console.log('File uploaded successfully', response);
        },
        error: (error) => {
            console.error('Error uploading file', error);
        },
        complete: () => {
            console.log('Upload complete');
        }
    });
}

  uploadFiles(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:5050/upload', formData);
    console.log("aaaaaaaaaaa");
    
  }
}
