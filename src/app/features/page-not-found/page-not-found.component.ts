import { Component } from '@angular/core';

@Component({
  selector: 'sun-page-not-found',
  template: `
    <div class="sun-card">
      <h1>We could not find that page</h1>
      <p>The page may have moved. Go back to the <a routerLink="/dashboard">claims dashboard</a>.</p>
    </div>
  `
})
export class PageNotFoundComponent { }
