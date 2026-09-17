import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DocumentUploadComponent } from './document-upload.component';
import { SharedModule } from '../../../../shared/shared.module';
import { environment } from '../../../../../environments/environment';

describe('DocumentUploadComponent', () => {

  let fixture: ComponentFixture<DocumentUploadComponent>;
  let component: DocumentUploadComponent;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule, NoopAnimationsModule],
      declarations: [DocumentUploadComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentUploadComponent);
    component = fixture.componentInstance;
    component.claimNumber = 'CLM0000123456';
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should open the hidden file input when browsing', () => {
    spyOn(component.fileInput.nativeElement, 'click');
    component.browse();
    expect(component.fileInput.nativeElement.click).toHaveBeenCalled();
  });

  it('should reject unsupported file types without uploading', () => {
    component.onFilesSelected(selection(new File(['x'], 'notes.txt', { type: 'text/plain' })));
    expect(component.errorMessage).toContain('Only JPG, PNG, HEIC and PDF');
    httpMock.expectNone(environment.documentUploadUrl);
  });

  it('should reject files over 10MB', () => {
    const big = new File([new ArrayBuffer(10 * 1024 * 1024 + 1)], 'huge.jpg', { type: 'image/jpeg' });
    component.onFilesSelected(selection(big));
    expect(component.errorMessage).toContain('larger than the 10MB limit');
  });

  it('should upload accepted files and record the stored document', () => {
    component.onFilesSelected(selection(new File(['%PDF'], 'quote.pdf', { type: 'application/pdf' })));
    expect(component.uploading).toBe(true);

    const request = httpMock.expectOne(environment.documentUploadUrl);
    const body = request.request.body as FormData;
    expect(body.get('claimNumber')).toBe('CLM0000123456');
    expect(body.get('category')).toBe('QUOTE');
    request.flush({ documentId: 'DOC-1', fileName: 'quote.pdf', category: 'QUOTE' });

    expect(component.uploading).toBe(false);
    expect(component.uploaded.length).toBe(1);
    expect(component.uploaded[0].fileName).toBe('quote.pdf');
  });

  it('should show an error when the upload fails', () => {
    component.onFilesSelected(selection(new File(['img'], 'bonnet.jpg', { type: 'image/jpeg' })));
    httpMock.expectOne(environment.documentUploadUrl).flush('', { status: 500, statusText: 'Error' });
    expect(component.uploading).toBe(false);
    expect(component.errorMessage).toContain('could not be uploaded');
  });

  function selection(...files: File[]): any {
    return { target: { files: { length: files.length, item: (i: number) => files[i] } } };
  }
});
