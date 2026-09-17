# Suncorp Claims Portal

Digital claims lodgement and tracking portal used by contact centre consultants and by customers on
the brand websites (Suncorp Insurance, AAMI, GIO, Apia, Shannons, Bingle). A single build is themed
per brand host, e.g. `claims.aami.com.au` renders the AAMI palette and claims number.

The portal reads policy data from the
[policy-admin-service](../suncorp-policy-admin-service) API and writes claims to the claims API.

## Current stack

| Component | Version | Notes |
|---|---|---|
| Angular | 8.2.14 | ViewEngine (`enableIvy: false`) |
| Angular CLI | 8.3.25 | `@angular-devkit/build-angular` 0.803.x |
| Angular Material / CDK | 8.2.x | deep `@angular/material` imports |
| `@angular/http` | 7.2.16 | still used by `LegacyDocumentService` (FileNet) |
| RxJS | 6.4 + `rxjs-compat` | patched operators in the legacy service |
| TypeScript | 3.5.3 | `target: es5`, non-strict |
| Node | 12.16.3 (`.nvmrc`) | Jenkins agent label `node-12` |
| Lint | TSLint 5 + codelyzer 5 | |
| Unit tests | Karma + Jasmine 3.4 | |
| E2E | Protractor 5.4 | |
| Styling | node-sass 4.12 | |

## Running locally

```bash
nvm use                 # Node 12.16.3
npm install
npm start               # http://localhost:4200 with the dev API proxy
npm run start:aami      # AAMI themed build
npm test
npm run lint
npm run e2e
```

## Key areas

- `features/claims/components/claim-lodgement` - five step reactive-form lodgement wizard
- `features/claims/services/legacy-document.service.ts` - `@angular/http` client for the FileNet store
- `core/services/session-timeout.service.ts` - SEC-014 15 minute idle timeout
- `core/services/brand-theme.service.ts` - host based brand theming
- `shared/pipes` - AUD currency, BSB and claim status formatting

## Upgrade

This repository is the "before" state for the Angular 8 -> 17 uplift.
See [docs/UPGRADE-BLOCKERS.md](docs/UPGRADE-BLOCKERS.md) and [docs/DEMO-SCRIPT.md](docs/DEMO-SCRIPT.md).

## Demo notes

This is a synthetic sample repository built for an upgrade demonstration. It is not Suncorp code;
brand names, product rules and endpoints are illustrative. No `package-lock.json` is committed, so
run `npm install` once (on Node 12) to generate one before using the `npm ci` paths in the
`Dockerfile` and `Jenkinsfile`.
