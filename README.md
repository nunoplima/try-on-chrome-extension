# Vite React TypeScript Tailwind Chrome Extension Template

A template for building Chrome extensions with Vite, React, TypeScript, and Tailwind CSS.

## Development

Start the development server with hot module replacement (HMR):

```bash
yarn dev
```

### Build for Production

To build the extension:

```bash
yarn build
```

This creates a `dist` folder with the production files.

### Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `dist` folder.

Your extension is now ready for testing in Chrome.
