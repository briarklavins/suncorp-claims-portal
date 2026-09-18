import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LegacyDocumentService } from './legacy-document.service';
import { ClaimDocument } from '../../../shared/models/claim.model';
import { environment } from '../../../../environments/environment';

describe('LegacyDocumentService', () => {

  let service: LegacyDocumentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LegacyDocumentService]
    });

    service = TestBed.inject(LegacyDocumentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should unwrap the FileNet envelope into a document list', () => {
    const photo: ClaimDocument = {
      documentId: 'DOC-1',
      fileName: 'bonnet.jpg',
      contentType: 'image/jpeg',
      sizeBytes: 1024,
      category: 'PHOTO',
      uploadedAt: new Date('2024-10-31T10:00:00')
    };

    let received: ClaimDocument[];
    service.listDocuments('CLM0000123456').subscribe(documents => received = documents);

    const request = httpMock.expectOne(req =>
      req.url === environment.documentUploadUrl && req.params.get('claimNumber') === 'CLM0000123456');
    expect(request.request.headers.get('X-Source-System')).toBe('CLAIMS-PORTAL');
    expect(request.request.headers.get('Accept')).toBe('application/json');

    request.flush({ FILENET_RESPONSE: { DOCUMENTS: [photo] } });

    expect(received).toEqual([photo]);
  });

  it('should surface HTTP failures to the caller', () => {
    let failed = false;
    service.listDocuments('CLM0000123456').subscribe({ error: () => failed = true });

    httpMock.expectOne(() => true).flush('FileNet unavailable', { status: 503, statusText: 'Service Unavailable' });

    expect(failed).toBe(true);
  });

  it('should build the content download url', () => {
    expect(service.downloadUrl('DOC-1')).toBe(environment.documentUploadUrl + '/DOC-1/content');
  });
});
