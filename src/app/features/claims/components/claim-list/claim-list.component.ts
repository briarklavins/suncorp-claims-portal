import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ClaimsService } from '../../services/claims.service';
import { Claim } from '../../../../shared/models/claim.model';

@Component({
  selector: 'sun-claim-list',
  templateUrl: './claim-list.component.html'
})
export class ClaimListComponent implements OnInit {

  displayedColumns = ['claimNumber', 'policyNumber', 'claimType', 'status', 'lodgedAt', 'actions'];
  dataSource = new MatTableDataSource<Claim>([]);
  searchControl = new FormControl('');
  loading = true;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort;

  constructor(private claimsService: ClaimsService) {
  }

  ngOnInit(): void {
    this.claimsService.findRecentClaims(100).subscribe(
      claims => {
        this.dataSource.data = claims;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      () => this.loading = false
    );

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(term => this.dataSource.filter = String(term).trim().toLowerCase());
  }
}
