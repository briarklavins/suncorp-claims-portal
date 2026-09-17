# Upgrade blockers: Angular 8 -> 17, Node 12 -> 20

Catalogue of the breaking items in `suncorp-claims-portal`. The upgrade has to be run one major at a
time (`ng update @angular/core@9 @angular/cli@9`, then 10, 11, ...), so the table also lists the
version at which each item bites.

## 1. Hard removals

| Item | File | Removed in | Remediation |
|---|---|---|---|
| `@angular/http` (`Http`, `Headers`, `RequestOptions`, `Response`) | `features/claims/services/legacy-document.service.ts`, `app.module.ts` | Angular 9 | Rewrite on `HttpClient`; the FileNet envelope needs an explicit `map` over the parsed JSON |
| `Renderer` (the v3 renderer) | `shared/directives/autofocus.directive.ts` | Angular 9 | `Renderer2`, or call `nativeElement.focus()` directly |
| `rxjs-compat` and patched operator imports (`rxjs/add/operator/map`) | `legacy-document.service.ts`, `package.json` | RxJS 7 | Pipeable operators |
| `entryComponents` | `app.module.ts`, `shared/shared.module.ts` | Angular 13 (no-op from 9 with Ivy) | Delete |
| Protractor | `e2e/`, `angular.json` | Angular 15 (`ng e2e` builder removed) | Cypress or Playwright; the two specs need rewriting |
| TSLint + codelyzer | `tslint.json`, `angular.json`, `package.json` | Angular 12 | `ng add @angular-eslint/schematics` |
| `node-sass` | `package.json` | fails to build on Node 14+ | `sass` (dart-sass); check `@import` -> `@use` in `themes/*.scss` |
| String-based lazy loading (`loadChildren: './...#ClaimsModule'`) | `app-routing.module.ts` | Angular 9 (Ivy) | Dynamic `import()` |
| Deep `@angular/material` imports | `shared/shared.module.ts`, `app.component.ts`, several components | Angular Material 9 | Secondary entry points, e.g. `@angular/material/dialog` |

## 2. Behaviour changes that compile but break

| Item | File | Version | Remediation |
|---|---|---|---|
| `@ViewChild` without `static` | `app.component.ts` (`sidenav`, `mainContent`), `claim-list.component.ts` (`paginator`, `sort`), `document-upload.component.ts` (`fileInput`), `claim-lodgement.component.ts` (`stepper`) | Angular 9 | Add `{ static: true }` where the reference is used in `ngOnInit`, otherwise `{ static: false }` and move the access into `ngAfterViewInit` |
| Ivy enabled by default (`enableIvy: false` removed) | `src/tsconfig.app.json` | Angular 9 (flag removed in 13) | Delete the flag; expect stricter template type checking |
| `MatTableDataSource.paginator/sort` assigned in `ngOnInit` | `claim-list.component.ts` | Angular 9 | Set in `ngAfterViewInit` once the static resolution changes |
| Deprecated `subscribe(next, error)` positional arguments | `app.component.ts`, `dashboard.component.ts`, `claim-detail.component.ts`, `document-upload.component.ts`, `policy-lookup.component.ts` | RxJS 8 | Observer object form |
| `TestBed.get()` | `app.component.spec.ts`, `claims.service.spec.ts` | Angular 9 deprecated, 12 removed | `TestBed.inject()` |
| `async()` test helper | `app.component.spec.ts` | Angular 12 | `waitForAsync()` |
| IE11 polyfills (`core-js/es6/*`, `classlist.js`, `web-animations-js`) | `src/polyfills.ts`, `browserslist` | Angular 13 dropped IE11 | Delete the polyfills, drop the IE entries from `browserslist` |
| `moment` as a global with `pure: false` pipe | `shared/pipes/time-ago.pipe.ts` | - | `date-fns` or `Intl.RelativeTimeFormat`; the impure pipe is a change-detection cost |

## 3. Build and tooling

| Item | File | Remediation |
|---|---|---|
| Angular CLI workspace format v1 | `angular.json` | `ng update` rewrites to the v2 schema; `styleext` -> `inlineStyleLanguage`, `extractCss` removed, `--prod` -> `--configuration production` |
| `defaultProject` | `angular.json` | Removed in Angular 15 |
| Node 12 (`.nvmrc`, Dockerfile, Jenkins `node-12` agent) | `.nvmrc`, `Dockerfile`, `Jenkinsfile` | Node 20; Angular 17 requires >= 18.13 |
| `karma-jasmine` 2 / Jasmine 3.4 | `package.json`, `src/karma.conf.js` | Jasmine 4/5, or migrate to Jest |
| `@angular/flex-layout` (deprecated, no Angular 16+ support) | `shared/shared.module.ts`, several templates | CSS grid/flex utilities |
| `ngx-currency` 1.5.2 | `package.json` | Unmaintained for Angular 13+; replace or drop |

## 4. Cross-repo contract

The portal parses `dd/MM/yyyy` strings from `policy-admin-service` (`spring.jackson.date-format`).
If the Java upgrade moves entities from `java.util.Date` to `java.time.LocalDate`, the serialised
format changes to ISO-8601 and `policy.expiryDate | date:'dd/MM/yyyy'` in
`policy-lookup.component.html` and `claim-lodgement.component.html` silently renders the wrong value.
Coordinate the two upgrades, or pin the Jackson date format on the Java side.
