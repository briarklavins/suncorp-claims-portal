import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LegacyDocumentService } from './legacy-document.service';
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

  it('should decode the FileNet envelope into a document list', () => {
    let documents: any[];
    service.listDocuments('CLM0000123456').subscribe(result => documents = result);

    const request = httpMock.expectOne(req => req.url === environment.documentUploadUrl
      && req.params.get('claimNumber') === 'CLM0000123456');
    expect(request.request.headers.get('X-Source-System')).toBe('CLAIMS-PORTAL');

    request.flush({
      FILENET_RESPONSE: {
        DOCUMENTS: [
          {
            documentId: 'DOC-1',
            fileName: 'hail-damage.jpg',
            contentType: 'image/jpeg',
            sizeBytes: 91234,
            category: 'PHOTO',
            uploadedAt: '01/11/2025'
          }
        ]
      }
    });

    expect(documents.length).toBe(1);
    expect(documents[0].documentId).toBe('DOC-1');
  });

  it('should return an empty list when FileNet omits the documents node', () => {
    let documents: any[];
    service.listDocuments('CLM0000123456').subscribe(result => documents = result);

    httpMock.expectOne(req => req.url === environment.documentUploadUrl).flush({ FILENET_RESPONSE: {} });

    expect(documents).toEqual([]);
  });

  it('should build a content download url for a document', () => {
    expect(service.downloadUrl('DOC-1')).toBe(environment.documentUploadUrl + '/DOC-1/content');
  });
});
