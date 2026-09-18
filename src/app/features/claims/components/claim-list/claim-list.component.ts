import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ClaimsService } from '../../services/claims.service';
import { Claim } from '../../../../shared/models/claim.model';

@Component({
  selector: 'sun-claim-list',
  templateUrl: './claim-list.component.html'
})
export class ClaimListComponent implements OnInit, AfterViewInit {

  displayedColumns = ['claimNumber', 'policyNumber', 'claimType', 'status', 'lodgedAt', 'actions'];
  dataSource = new MatTableDataSource<Claim>([]);
  searchControl = new UntypedFormControl('');
  loading = true;

  @ViewChild(MatPaginator, { static: false })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: false })
  sort: MatSort;

  constructor(private claimsService: ClaimsService) {
  }

  ngOnInit(): void {
    this.claimsService.findRecentClaims(100).subscribe({
      next: claims => {
        this.dataSource.data = claims;
        this.loading = false;
      },
      error: () => this.loading = false
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(term => this.dataSource.filter = String(term).trim().toLowerCase());
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
