import { defineConfig } from 'vite';
import autoprefixer from "autoprefixer";
import path from "path";
import glob from "glob";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(__dirname, 'src');
const publicDir = path.resolve(__dirname, 'public');
const outDir = path.resolve(__dirname, 'dist');

export default defineConfig({
  root: rootDir,
  base: './',
  publicDir: publicDir,
  css: {
    plugins: [autoprefixer],
  },
  build: {
    outDir: outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        glob.sync(path.resolve(rootDir, "*.html")).map(file => [
          path.relative('src', file.slice(0, file.length - path.extname(file).length)),
          fileURLToPath(new URL(file, import.meta.url))
        ])
      ),
      output: {
      },
    },
  },
});