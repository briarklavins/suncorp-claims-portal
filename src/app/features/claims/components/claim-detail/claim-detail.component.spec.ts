import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { ClaimDetailComponent } from './claim-detail.component';
import { ClaimsService } from '../../services/claims.service';
import { LegacyDocumentService } from '../../services/legacy-document.service';
import { SharedModule } from '../../../../shared/shared.module';

describe('ClaimDetailComponent', () => {

  let fixture: ComponentFixture<ClaimDetailComponent>;
  const claimsService = jasmine.createSpyObj<ClaimsService>('ClaimsService', ['findByClaimNumber', 'updateStatus']);
  const documentService = jasmine.createSpyObj<LegacyDocumentService>('LegacyDocumentService', ['listDocuments', 'downloadUrl']);

  const claim: any = {
    claimNumber: 'CLM0000123456',
    policyNumber: '1400000001',
    status: 'LODGED',
    lodgedAt: new Date(),
    incident: { claimType: 'MOTOR_HAIL', incidentDate: new Date(), description: 'Hail' },
    thirdParties: [],
    settlement: { method: 'REPAIR' },
    documents: []
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule, NoopAnimationsModule],
      declarations: [ClaimDetailComponent],
      providers: [
        { provide: ClaimsService, useValue: claimsService },
        { provide: LegacyDocumentService, useValue: documentService },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ claimNumber: 'CLM0000123456' })) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  it('should load the claim and its FileNet documents', () => {
    claimsService.findByClaimNumber.and.returnValue(of(claim));
    documentService.listDocuments.and.returnValue(of([{ documentId: 'DOC-1', fileName: 'bonnet.jpg' } as any]));
    documentService.downloadUrl.and.returnValue('/docs/DOC-1/content');

    fixture = TestBed.createComponent(ClaimDetailComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(claimsService.findByClaimNumber).toHaveBeenCalledWith('CLM0000123456');
    expect(component.claim).toBe(claim);
    expect(component.documents.length).toBe(1);
    expect(component.documentLink(component.documents[0])).toBe('/docs/DOC-1/content');
    expect(component.loading).toBe(false);
  });

  it('should withdraw the claim', () => {
    claimsService.findByClaimNumber.and.returnValue(of(claim));
    documentService.listDocuments.and.returnValue(throwError(new Error('FileNet down')));
    claimsService.updateStatus.and.returnValue(of({ ...claim, status: 'WITHDRAWN' }));

    fixture = TestBed.createComponent(ClaimDetailComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.documents).toEqual([]);

    fixture.componentInstance.withdraw();
    expect(claimsService.updateStatus).toHaveBeenCalledWith('CLM0000123456', 'WITHDRAWN');
    expect(fixture.componentInstance.claim.status).toBe('WITHDRAWN');
  });

  it('should stop loading when the claim cannot be retrieved', () => {
    claimsService.findByClaimNumber.and.returnValue(throwError(new Error('404')));

    fixture = TestBed.createComponent(ClaimDetailComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.loading).toBe(false);
    expect(fixture.componentInstance.claim).toBeUndefined();
  });
});
