# Suncorp Claims Portal

Digital claims lodgement and tracking portal used by contact centre consultants and by customers on
the brand websites (Suncorp Insurance, AAMI, GIO, Apia, Shannons, Bingle). A single build is themed
per brand host, e.g. `claims.aami.com.au` renders the AAMI palette and claims number.

The portal reads policy data from the
[policy-admin-service](../suncorp-policy-admin-service) API and writes claims to the claims API.

## Current stack

| Component | Version | Notes |
|---|---|---|
| Angular | 17.3 | Ivy, standalone-ready NgModules, strict template type checking |
| Angular CLI | 17.3 | `@angular-devkit/build-angular` 17.x |
| Angular Material / CDK | 17.3 | secondary entry point imports (`@angular/material/dialog`, ...) |
| HTTP | `HttpClient` | `LegacyDocumentService` unwraps the FileNet envelope with `map` |
| RxJS | 7.5 | pipeable operators, observer-object `subscribe` |
| TypeScript | 5.4 | `target: ES2020` |
| Node | 20 (`.nvmrc`) | Jenkins agent label `node-20` |
| Lint | ESLint + `@angular-eslint` 17 | |
| Unit tests | Karma + Jasmine 5 | |
| E2E | Playwright | `e2e/`, SiteMinder cookie + API mocks in `e2e/fixtures.ts` |
| Styling | dart `sass` | Internet Explorer 11 is no longer supported |

## Running locally

```bash
nvm use                 # Node 20
npm install
npm start               # http://localhost:4200 with the dev API proxy
npm run start:aami      # AAMI themed build
npm test
npm run lint
npm run e2e
```

## Key areas

- `features/claims/components/claim-lodgement` - five step reactive-form lodgement wizard
- `features/claims/services/legacy-document.service.ts` - `HttpClient` client for the FileNet store
- `core/services/session-timeout.service.ts` - SEC-014 15 minute idle timeout
- `core/services/brand-theme.service.ts` - host based brand theming
- `shared/pipes` - AUD currency, BSB and claim status formatting

## Upgrade

This repository has been uplifted from Angular 8 / Node 12 to Angular 17 / Node 20, one major
version per commit. The original blocker catalogue is kept for reference in [docs/UPGRADE-BLOCKERS.md](docs/UPGRADE-BLOCKERS.md) and [docs/DEMO-SCRIPT.md](docs/DEMO-SCRIPT.md).

## Demo notes

This is a synthetic sample repository built for an upgrade demonstration. It is not Suncorp code;
brand names, product rules and endpoints are illustrative. `package-lock.json` is committed, so the
`npm ci` paths in the `Dockerfile` and `Jenkinsfile` work as-is.
