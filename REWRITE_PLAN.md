# Elite UI — Rewrite Plan (Angular 22)

A self-paced guide to rebuild the old Angular 7 **Elite** fan site as a modern Angular 22
app (`elite-ui`) that pulls data from the deployed **GS-Elite** API.

> Purpose: practice modern Angular. Work through phases manually. Check items off as you go.

---

## 0. The big picture

**Old app (`Elite/`)** — Angular 7, NgModules, data hard-coded in `mock-data.ts`,
`BehaviorSubject` state, Angular Material + Bootstrap + ng-bootstrap.

**New app (`elite-ui/`)** — Angular 22, standalone components, signals, native control
flow, SSR/hydration scaffolded.

**API (`GS-Elite/`, deployed to Cloud Run)** — read-only JSON:

| Method | Path | Returns |
|--------|------|---------|
| GET | `/ships` | `Ship[]` |
| GET | `/ships/{id}` | `Ship` (404 if missing) |
| GET | `/songs` | `SongGroup[]` (ordered by `order`) |
| GET | `/actuator/health` | health probe |

### API data shapes (match these exactly — interfaces already created in `src/app/models/`)

```ts
interface Ship {
  id: string;           // slug — use for routing
  title: string;
  header: string;
  description: string;
  videoUrl: string;     // NEW vs old app
  backgroundImage: string;
  screenShots: string[];
}

interface Song {
  name: string;
  url: string;          // Firebase Storage URL
}

interface SongGroup {
  id: string;
  name: string;
  disabled: boolean;
  order: number;        // NEW — server already sorts by this
  songs: Song[];
}
```

### ⚠️ Known API issue — fix CORS before Phase 3

`CorsConfig.java` maps CORS to `/api/**` but controllers serve `/ships` and `/songs`
(no `/api` prefix). Browser calls from `localhost:4200` will be blocked.

Fix: change `registry.addMapping("/api/**")` → `registry.addMapping("/**")` and redeploy.

---

## Decisions made — styling stack

| Concern | Decision |
|---|---|
| Component widgets | Angular Material 22 |
| Layout / utilities | Tailwind v4 with `important` flag |
| CSS framework | None (Bootstrap removed — wasn't used) |
| ng-bootstrap | Deferred — only needed if you want their carousel |
| Material imports | `MATERIAL_IMPORTS` array in `src/app/material.ts`, spread into each component |

### Styling rules
- Material elements (`mat-toolbar`, `mat-sidenav`, etc.) → style with **Tailwind classes directly on the element**
- Deep Material internals / pseudo-elements / `@keyframes` → plain CSS in component `.css` file
- No separate CSS class just for color/spacing/layout on standard elements

### Global tokens (already in `src/styles.css`)
```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
@import "tailwindcss" important;

@theme {
  --color-elite-orange: #b4956d;
  --font-sans: 'Bebas Neue', 'Arial Narrow', sans-serif;
}

body {
  font-family: var(--font-sans);
}
```

Use as: `text-elite-orange`, `bg-elite-orange`, `border-elite-orange` in any template.

### Static assets
- Page wallpapers (home, exploration, factions, etc.) → `public/images/`, referenced in `styles.css` as CSS classes. Already done.
- Per-ship backgrounds → **one `.ship-wallpaper` class** + CSS custom property (not 11 hardcoded classes):
  ```css
  /* styles.css */
  .ship-wallpaper {
    background-image: var(--wallpaper-url);
    background-size: cover;
    background-position: center;
    min-height: 950px;
  }
  ```
  ```html
  <!-- in template -->
  <section class="ship-wallpaper" [style.--wallpaper-url]="'url(' + ship().backgroundImage + ')'">
  ```
- Carousel screenshots → `<img>` elements (not background-image), supports `NgOptimizedImage`

---

## Data fetching architecture — decided

**Rule: components never fetch. Services fetch, components read.**

```
EliteApiService          — raw HTTP calls only, no state
ShipStore (root)         — fetches ships once on first inject, exposes readonly signal
AudioComponent           — fetches songs itself (sole consumer, persistent shell component)
```

**ShipStore pattern:**
```ts
@Injectable({ providedIn: 'root' })
export class ShipStore {
  private api = inject(EliteApiService);
  private _ships = signal<Ship[]>([]);
  readonly ships = this._ships.asReadonly();

  constructor() {
    this.api.getShips().subscribe(s => this._ships.set(s));
  }
}
```

**Who injects what:**
- `NavigationComponent` → injects `ShipStore` (reads ships for the dropdown)
- `SpaceShipsComponent` → injects `ShipStore` (card grid)
- `SelectedSpaceShipComponent` → injects `ShipStore`, derives ship via `computed()` from `:id` param + cached list
- `AudioComponent` → injects `EliteApiService` directly, local signals only
- `HomeComponent` → fetches nothing, static page

**No trigger needed** — `ShipStore` auto-fetches when first injected by any component.

---

## Navigation decisions — decided

| Old pattern | New pattern |
|---|---|
| `#drawer` template ref + `drawer.toggle()` | `drawerOpen = signal(false)` + `[opened]="drawerOpen()"` |
| `#ships` / `#audioPlayer` mat-menu template refs | Unchanged — still the correct Material API |
| `router.navigate()` + `StorageService.setModel()` | `[routerLink]="['/space-ships', ship.id]"` — no service needed |
| `BehaviorSubject<Ship>` selected ship | Derived via `computed()` from `:id` route param + `ShipStore.ships()` |

**Sidenav signal pattern:**
```ts
drawerOpen = signal(false);
```
```html
<button (click)="drawerOpen.update(v => !v)">menu</button>
<mat-sidenav [opened]="drawerOpen()">
  <a routerLink="/ships" (click)="drawerOpen.set(false)">Ships</a>
</mat-sidenav>
```

---

## Phase 1 — Foundations ✅ (mostly done)

- [x] Scaffold runs on `localhost:4200`
- [x] Tailwind v4 installed with `important` flag
- [x] `@theme` tokens: `--color-elite-orange`, `--font-sans` (Bebas Neue)
- [x] Global `body` font set
- [x] Bootstrap removed
- [x] `MATERIAL_IMPORTS` barrel → create `src/app/material.ts`
- [ ] Add `provideHttpClient(withFetch())` to `app.config.ts`
- [ ] Add `withComponentInputBinding()` and `withInMemoryScrolling()` to `provideRouter()` in `app.config.ts`
- [ ] Set up `src/environments/environment.ts` with `apiBaseUrl`
- [ ] Confirm API URL with `curl https://<base>/actuator/health`
- [ ] Fix CORS on the API

---

## Phase 2 — Models & API service

- [x] `src/app/models/ship.ts` — interface created
- [x] `src/app/models/song.ts` — interface created
- [x] `src/app/models/song-group.ts` — interface created
- [ ] Create `EliteApiService` (`providedIn: 'root'`, `inject(HttpClient)`):
  - `getShips(): Observable<Ship[]>`
  - `getShip(id: string): Observable<Ship>`
  - `getSongs(): Observable<SongGroup[]>`
- [ ] Create `ShipStore` service — fetches ship list once, exposes `ships` readonly signal
- [ ] Add `catchError` and loading state to service calls
- [ ] Smoke-test: log ships in a component, confirm data returns

**Learning notes (old → new)**
- `mock-data.ts` → `EliteApiService` HTTP calls
- `BehaviorSubject` → `signal()`, `.next()` → `.set()`, `.asObservable()` → `.asReadonly()`
- Constructor DI → `inject()`

---

## Phase 3 — Routing & app shell

- [ ] Define routes in `app.routes.ts`:
  ```
  ''            → redirect to home
  home          → HomeComponent (lazy)
  space-ships   → SpaceShipsComponent (lazy)
  space-ships/:id → SelectedSpaceShipComponent (lazy)
  exploration   → ExplorationComponent (lazy)
  aliens        → AliensComponent (lazy)
  commerce      → CommerceComponent (lazy)
  factions      → FactionsComponent (lazy)
  **            → redirect to home
  ```
- [ ] All pages use `loadComponent: () => import(...)` (lazy)
- [ ] Build `NavigationComponent` with:
  - `drawerOpen` signal for sidenav
  - `mat-menu` template refs for Ships/Audio dropdowns (unchanged pattern)
  - Tailwind classes directly on `mat-toolbar`, `mat-sidenav`, `mat-nav-list`
  - Injects `ShipStore` for the ships dropdown list
- [ ] Build `FooterComponent`
- [ ] Wire `<app-navigation>` + `<router-outlet>` + `<app-footer>` in `app.html`

**Learning notes (old → new)**
- `RouterModule.forRoot(routes)` → `provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling(...))`
- `loadChildren` module lazy loading → `loadComponent` component lazy loading
- `mat-sidenav` `#drawer` template ref → `drawerOpen` signal + `[opened]` input

---

## Phase 4 — Ships feature (list + detail)

- [ ] `SpaceShipsComponent`:
  - Injects `ShipStore`, reads `ships` signal
  - Two layouts toggled by `isDropDown = input(false)`:
    - Grid mode: cards with `<video [src]="ship.videoUrl">`, click → `routerLink`
    - Dropdown mode: compact list inside nav menu, click → `routerLink`
  - No `Router`, no `StorageService` — navigation is declarative via `routerLink`
- [ ] `SelectedSpaceShipComponent`:
  - `id = input.required<string>()` — bound from `:id` route param automatically
  - `ship = computed(() => store.ships().find(s => s.id === id()))`
  - Renders `title`, `header`, `description`, `videoUrl`, `screenShots[]`
  - Ship background: `.ship-wallpaper` class + `[style.--wallpaper-url]` binding
  - Handle `ship()` being `undefined` (loading / bad id) gracefully

**Learning notes (old → new)**
- `*ngFor` → `@for (ship of ships(); track ship.id)`
- `*ngIf` → `@if`
- `@Input()` decorator → `input()` / `input.required()` functions
- `ship.url` (old) → `ship.videoUrl` (new API field name)
- Selected ship via service → derived via `computed()` from URL + cache

---

## Phase 5 — Screenshot carousel / dialog

- [ ] `CarouselComponent`:
  - `screenShots = input<string[]>()`
  - `currentIndex = signal(0)`
  - prev/next update signal, wrap around
  - Screenshots as `<img>` elements (not background-image)
- [ ] Full-screen dialog viewer using `MatDialog` (already have Material)
- [ ] Keyboard support (arrows/escape) via `host: { '(keydown)': 'onKey($event)' }`
- [ ] `img-fluid` equivalent: `class="max-w-full h-auto"` (Tailwind, no Bootstrap needed)

**Learning notes (old → new)**
- ng-bootstrap `<ngb-carousel>` → custom signal-driven carousel
- `@HostListener('keydown')` → `host: { '(keydown)': 'onKey($event)' }`
- `ViewEncapsulation.None` hacks → scoped styles; avoid disabling encapsulation

---

## Phase 6 — Audio player

**Architecture decided:** single persistent `AudioComponent` mounted in the shell (outside
`<router-outlet>`). Local signals only — no store, no service. Persists across navigation
because the component instance never unmounts.

**⚠️ Do not destroy the component** — if using a CDK overlay/menu for the audio panel,
configure it to hide/show (CSS), not create/destroy. Destroying tears down the
`HTMLAudioElement` and stops playback.

- [ ] Mount `<app-audio>` in `NavigationComponent` shell, outside `<router-outlet>`
- [ ] Fetch song groups in `AudioComponent` constructor via `EliteApiService` directly
- [ ] Local signals: `groups`, `currentSong`, `isPlaying`, `isMuted`, `isLoop`, `isShuffle`, `volume`, `progress`, `duration`
- [ ] Use `effect()` to sync signal state → `HTMLAudioElement` (play/pause/volume/src)
- [ ] Reimplement skip next/prev (wrap across groups), shuffle, loop, autoplay-on-end
- [ ] Progress bar: `timeupdate` event → update `progress` signal; seeking sets `currentTime`
- [ ] `TrackTimePipe` → standalone pipe (mm:ss formatting)
- [ ] Respect `disabled` flag on song groups

**Learning notes (old → new)**
- Songs moved from `mock-data.ts` to API — fetch async, groups signal starts empty
- `FormGroup`/`FormControl` for song select → signal + `(change)` binding
- Imperative `this.x = ...` → `signal.set()` / `signal.update()`
- `ngOnInit` / `ngOnDestroy` + manual subscriptions → `effect()` auto-cleans up

---

## Phase 7 — Static content pages

- [ ] `HomeComponent`, `ExplorationComponent`, `AliensComponent`, `CommerceComponent`, `FactionsComponent`
- [ ] Each page uses the appropriate `.wallpaper-*` CSS class from `styles.css`
- [ ] Port copy and layout, replace old Bootstrap grid with Tailwind flex/grid
- [ ] Embed `<app-audio>` and `<app-carousel>` where old pages used them

---

## Phase 8 — Polish, a11y, SSR, deploy

- [ ] Accessibility: run AXE, fix contrast/focus/ARIA (WCAG AA required per `CLAUDE.md`)
- [ ] Loading + error states on every data-driven view
- [ ] SSR: verify hydration works with API calls (`withFetch()` + `TransferState` to avoid double-fetching)
- [ ] Tests: Vitest (not Karma). Unit test `EliteApiService` with `provideHttpClientTesting`, audio skip/shuffle logic
- [ ] `npm run build` — check bundle size budgets in `angular.json`
- [ ] Deploy to Firebase Hosting (`elite-giolla.web.app` already in API CORS allow-list)

---

## Quick reference — old → new cheat sheet

| Old (Angular 7) | New (Angular 22) |
|---|---|
| NgModules + `declarations` | Standalone `imports: []` |
| `HttpClientModule` | `provideHttpClient(withFetch())` |
| `RouterModule.forRoot` | `provideRouter()` with `with*()` features |
| Constructor DI | `inject()` |
| `BehaviorSubject` state | `signal()` + `computed()` |
| `*ngIf` / `*ngFor` / `*ngSwitch` | `@if` / `@for` / `@switch` |
| `@Input()` / `@Output()` | `input()` / `output()` functions |
| `@HostListener` / `@HostBinding` | `host: { ... }` object |
| `mock-data.ts` | `EliteApiService` + `ShipStore` |
| Selected ship in a service | `computed()` from `:id` route param + store cache |
| `router.navigate()` + service state | `[routerLink]` declarative navigation |
| Bootstrap + ng-bootstrap | Tailwind v4 + Material (+ optional ng-bootstrap for carousel) |
| `#drawer` template ref | `drawerOpen = signal(false)` |
| `mat-menu` template refs | Unchanged — still the correct Material API |
| Karma + Jasmine | Vitest |
| `src/assets/` | `public/` |
