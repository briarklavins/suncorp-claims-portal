import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { ClaimDocument } from '../../../../shared/models/claim.model';

@Component({
  selector: 'sun-document-upload',
  templateUrl: './document-upload.component.html'
})
export class DocumentUploadComponent {

  private static readonly MAX_BYTES = 10 * 1024 * 1024;
  private static readonly ACCEPTED = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf'];

  @Input()
  claimNumber: string;

  @ViewChild('fileInput', { static: false })
  fileInput: ElementRef;

  uploaded: ClaimDocument[] = [];
  progress = 0;
  uploading = false;
  errorMessage: string;

  constructor(private http: HttpClient) {
  }

  browse(): void {
    this.fileInput.nativeElement.click();
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.upload(files.item(i));
    }
  }

  private upload(file: File): void {
    this.errorMessage = null;

    if (DocumentUploadComponent.ACCEPTED.indexOf(file.type) < 0) {
      this.errorMessage = 'Only JPG, PNG, HEIC and PDF files can be attached to a claim.';
      return;
    }
    if (file.size > DocumentUploadComponent.MAX_BYTES) {
      this.errorMessage = file.name + ' is larger than the 10MB limit.';
      return;
    }

    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('claimNumber', this.claimNumber || 'DRAFT');
    formData.append('category', file.type === 'application/pdf' ? 'QUOTE' : 'PHOTO');

    const request = new HttpRequest('POST', environment.documentUploadUrl, formData, { reportProgress: true });

    this.uploading = true;
    this.http.request(request).subscribe({
      next: event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / (event.total || 1));
        } else if (event.type === HttpEventType.Response) {
          this.uploaded.push(event.body as ClaimDocument);
          this.uploading = false;
          this.progress = 0;
        }
      },
      error: () => {
        this.uploading = false;
        this.errorMessage = 'The document could not be uploaded. Try again or attach it later.';
      }
    });
  }
}
