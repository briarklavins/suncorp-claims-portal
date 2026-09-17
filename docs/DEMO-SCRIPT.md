# Demo script: automated Angular upgrade

Suggested narrative for showing an assisted Angular 8 -> 17 uplift on `suncorp-claims-portal`.

1. **Show the starting state.** `nvm use` (Node 12), `npm install`, `npm start`, walk the five step
   lodgement wizard. Point at `legacy-document.service.ts` - a real `@angular/http` service that a
   codemod cannot mechanically translate.
2. **Show it failing on a modern toolchain.** `nvm use 20 && npm ci` - `node-sass` fails to build
   straight away. That is the first thing anyone hits.
3. **Walk the blocker catalogue.** `docs/UPGRADE-BLOCKERS.md` - group into hard removals, silent
   behaviour changes, tooling, and the cross-repo date-format contract with the Java service.
4. **Run the upgrade, one major at a time.** Expected outcome per hop:
   - **9**: `static` flags on all six `@ViewChild`s, Ivy on, `@angular/http` -> `HttpClient`,
     `Renderer` -> `Renderer2`, string lazy-loading -> `import()`, deep Material imports split.
   - **10-11**: `TestBed.get` -> `inject`, `async` -> `waitForAsync`, RxJS 7 + drop `rxjs-compat`.
   - **12**: TSLint -> ESLint, `--prod` -> `--configuration production`.
   - **13**: drop IE11 polyfills and browserslist entries, delete `entryComponents`, node-sass -> sass.
   - **15**: Protractor -> Playwright, remove `defaultProject`.
   - **16-17**: `@angular/flex-layout` removal, standalone-component opportunities, Node 20.
5. **Prove it.** `npm run lint`, `npm test` green, `npm start` and re-walk the wizard - especially the
   police-event-number conditional validator and the `MatTableDataSource` paginator/sort on the claim
   list, which is where the `static` flag change usually shows up as a runtime null.
6. **Talk about what a human still owns:** the FileNet envelope rewrite, whether the date format
   contract with `policy-admin-service` changes, and the IE11 SOE decision with the contact centre.
