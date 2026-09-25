# 11ty-test

A personal website/blog built with [Eleventy (11ty)](https://www.11ty.dev/), including a client-side admin interface for drafting posts and a Playwright end-to-end test suite. The site is deployed to GitHub Pages via GitHub Actions.

Live site: https://kailepler.github.io/11ty-test/

## Prerequisites

* Node.js (LTS) and npm — download from [nodejs.org](https://nodejs.org/)
* [GitHub CLI](https://cli.github.com/) (`gh`) — only needed if you want to inspect Actions runs, Pages status, or Dependabot alerts from the terminal

## Setup

1. Clone the repository and move into it:

    ```bash
    gh repo clone KaiLepler/11ty-test
    cd 11ty-test
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Builds the site and serves it locally with live-reload (`eleventy --serve`) |
| `npm run build` | Builds the static site once into `_site/` |
| `npm test` | Runs the Playwright end-to-end test suite |

### Running the dev server

```bash
npm start
```

The config sets a `pathPrefix` of `/11ty-test/` (to mirror the GitHub Pages subpath), so the dev server serves the site at:

```
http://localhost:8080/11ty-test/
```

### Local publishing via the admin UI

The **Publish (Local)** button under `/admin/` only works when the site is running locally via `npm start` and a local API server is available at `http://localhost:3000` to accept the write request. GitHub Pages is a static host and cannot accept POST requests, so that button is hidden on the live site. To publish a post to the live site, commit the generated Markdown file (from `src/posts/` or `src/drafts/`) and push to `main`.

## Testing

End-to-end tests use [Playwright](https://playwright.dev/) and live in `tests/`. They run against Chromium and WebKit (Firefox is intentionally excluded — see `playwright.config.js`).

```bash
# One-time: download browser binaries
npx playwright install

# Run the suite (this also starts/reuses the dev server automatically)
npm test
```

`playwright.config.js` starts the Eleventy dev server itself if one isn't already running (`webServer` block), so you don't need `npm start` running separately.

## Project structure

```
src/
  _includes/   Layout templates (e.g. layout.njk)
  admin/       Client-side admin UI (admin.html/js/css) for drafting posts
  css/         Site stylesheets
  drafts/      Draft posts (excluded from the published posts collection)
  images/      Static images
  js/          Client-side JS, passed through as-is
  pages/       Standalone pages (about, blog, cv, photography, ...)
  posts/       Published blog posts
  index.md     Homepage
_site/                  Generated output (build artifact, not committed)
tests/                  Playwright test specs
eleventy.config.js      Eleventy configuration (collections, filters, passthrough copies)
playwright.config.js    Playwright test configuration
.github/workflows/      CI/CD workflows (see Deployment below)
```

## Dependency maintenance

Keep dependencies current and free of known vulnerabilities:

```bash
npm outdated       # see what has newer versions available
npm audit          # check for known vulnerabilities
npm audit fix      # apply non-breaking fixes
```

GitHub's Dependabot also scans the repository automatically; check open alerts at:
https://github.com/KaiLepler/11ty-test/security/dependabot

## Deployment

The site deploys automatically to **GitHub Pages** on every push to `main` via `.github/workflows/static.yml`:

1. Checks out the repo and installs dependencies with `npm ci`.
2. Builds the static site with `npm run build`.
3. Uploads `_site/` as a Pages artifact and deploys it with `actions/deploy-pages`.

GitHub Pages is configured to use the **GitHub Actions** build source (not the legacy branch-based Jekyll build), so this workflow is the only thing that publishes the site. You can trigger a deployment manually from the **Actions** tab (`workflow_dispatch`) or check status with:

```bash
gh run list --limit 5
gh api repos/KaiLepler/11ty-test/pages
```

No manual deployment steps are required — merging to `main` is sufficient.
