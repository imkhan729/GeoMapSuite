# Hostinger Static Git Deployment

The GitHub repository contains two branches:

- `main`: Next.js source, tests, and content.
- `hostinger`: the generated static production artifact. Select this branch in hPanel.

## Hostinger configuration

1. Open the website in hPanel and choose **Advanced → Git**.
2. Connect `https://github.com/imkhan729/GeoMapSuite`.
3. Select branch `hostinger`.
4. Deploy it to the root `public_html` directory.
5. Enable SSL and force HTTPS in hPanel.

The `hostinger` branch already contains `index.html`, route directories, `_next` assets, `robots.txt`, `sitemap.xml`, `404.html`, and `.htaccess`. Hostinger does not need to run Node.js or npm.

## Updating the deployment artifact

Build from the source branch with Node.js 22:

```bash
npm ci
npm run typecheck
npm test
NEXT_PUBLIC_SITE_URL=https://geomapsuite.com npm run build
```

Publish the contents of `out/`—not the `out` directory itself—to the root of the `hostinger` branch.

## Live verification

- `/`, `/tools/map-radius/`, `/blog/`, and `/maps/blank/world/` return 200.
- A nonexistent URL returns the custom 404 with HTTP 404.
- `robots.txt` and `sitemap.xml` use `https://geomapsuite.com`.
- HTTP and `www` redirect to the preferred HTTPS non-www origin.
- Alias URLs redirect once to their canonical descriptive URL.
- `_next` CSS and JavaScript return 200.
- Address and elevation lookups are tested in a browser; they use third-party browser endpoints and therefore require internet access.

If the final domain is not `geomapsuite.com`, update `NEXT_PUBLIC_SITE_URL` and the hostname in `public/.htaccess`, rebuild, and republish before submitting the sitemap.
