import { defineConfig } from 'vite';
import autoprefixer from "autoprefixer";
import path from "path";
import glob from "glob";
import { fileURLToPath } from "node:url";

const rootValue       = path.resolve(__dirname, 'src');
const publicDirValue  = path.resolve(__dirname, 'public');
const outDirValue     = path.resolve(__dirname, 'dist');

export default defineConfig({
  root: rootValue,
  base: './',
  publicDir: publicDirValue,
  css: {
    // plugins: [autoprefixer],
    postcss: {
      plugins: [autoprefixer],
    },
  },
  build: {
    outDir: outDirValue,
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        glob.sync(path.resolve(rootValue, "*.html")).map(file => [
          path.relative(rootValue, file.slice(0, file.length - path.extname(file).length)),
          fileURLToPath(new URL(file, import.meta.url))
        ])
      ),
      // input: {
      //  index: path.resolve(rootValue, "index.html"),
      //  second: path.resolve(rootValue, "second.html"),
      // },
      output: {
      },
    },
  },
  plugins:[],
  resolve: {
    alias: {
      // '~bootstrap': path.resolve(__dirname,'node_modules/bootstrap'),
    }
  }
});