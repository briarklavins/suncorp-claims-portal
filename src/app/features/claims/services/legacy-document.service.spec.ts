import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { FileNetEnvelope, LegacyDocumentService } from './legacy-document.service';
import { ClaimDocument } from '../../../shared/models/claim.model';
import { environment } from '../../../../environments/environment';

describe('LegacyDocumentService', () => {

  let service: LegacyDocumentService;
  let httpMock: HttpTestingController;

  const documents: ClaimDocument[] = [
    { documentId: 'DOC-1', fileName: 'front-bumper.jpg', contentType: 'image/jpeg', sizeBytes: 204800,
      category: 'PHOTO', uploadedAt: new Date('2026-05-03T10:00:00Z') },
    { documentId: 'DOC-2', fileName: 'repair-quote.pdf', contentType: 'application/pdf', sizeBytes: 81920,
      category: 'QUOTE', uploadedAt: new Date('2026-05-03T10:05:00Z') }
  ];

  const envelope: FileNetEnvelope = { FILENET_RESPONSE: { DOCUMENTS: documents } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LegacyDocumentService]
    });
    service = TestBed.inject(LegacyDocumentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should unwrap the FileNet envelope into the document list', () => {
    let result: ClaimDocument[];
    service.listDocuments('CLM0000123456').subscribe(docs => result = docs);

    const request = httpMock.expectOne(req =>
      req.url === environment.documentUploadUrl && req.params.get('claimNumber') === 'CLM0000123456');
    expect(request.request.method).toBe('GET');
    request.flush(envelope);

    expect(result).toEqual(documents);
  });

  it('should send the FileNet gateway headers', () => {
    service.listDocuments('CLM0000123456').subscribe();

    const request = httpMock.expectOne(req => req.url === environment.documentUploadUrl);
    expect(request.request.headers.get('Accept')).toBe('application/json');
    expect(request.request.headers.get('X-Source-System')).toBe('CLAIMS-PORTAL');
    request.flush(envelope);
  });

  it('should propagate FileNet errors to the caller', () => {
    let error: HttpErrorResponse;
    service.listDocuments('CLM0000000000').subscribe({ error: e => error = e });

    httpMock.expectOne(req => req.url === environment.documentUploadUrl)
      .flush({ message: 'FileNet unavailable' }, { status: 503, statusText: 'Service Unavailable' });

    expect(error.status).toBe(503);
  });

  it('should build the document content download URL', () => {
    expect(service.downloadUrl('DOC-2')).toBe(environment.documentUploadUrl + '/DOC-2/content');
  });
});
