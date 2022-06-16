# PWA Playground

This repository holds demonstration of progressive web app (PWA) features. It shall reveal its
limits opposed to native mobile applications.

## TODO

- [ ] obtain the supported browsers requirements,
- [ ] obtain requirements on barcode formats,
- [ ] GPS tracking - must work even when the tab or browser is in the background,
- [ ] push notifications - must work quickly and reliably,
- [ ] taking pictures - capturing instant photos and also picking from photo library,
- [ ] offline support - ability to work event without network connection,
- [ ] barcode decoding - not PWA related, but find the best approach to scan barcode from the photo,
- [ ] offline maps - not PWA related, but check if there are some map SDK with offline support,

## Requirements

- supported browsers are listed in `browserslist` property of package.json, the browser API must be
  available in listed browsers.

## End-goal

PWA that displays a map for the courier, with places of pick-up and delivery, allows scan barcodes
on
packages, works offline.

## Development

This is a [Next.js](https://nextjs.org/) project bootstrapped
with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the
file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed
on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited
in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated
as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your
feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more
details.


