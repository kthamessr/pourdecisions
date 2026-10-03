import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {basename} from 'node:path';
await rename('dist/app.html','dist/index.html');
let html=await readFile('dist/index.html','utf8');
// Ship the small stylesheet with each entry page so a failed asset request
// cannot leave a functional app looking like an unstyled document.
for (const match of html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)) {
  const css=await readFile(`dist/build-assets/${basename(match[1])}`,'utf8');
  html=html.replace(match[0],`<style data-pour-decisions>${css}</style>`);
}
await writeFile('dist/index.html',html);
await mkdir('dist/decisions',{recursive:true});
await writeFile('dist/decisions/index.html',html);
await writeFile('dist/404.html',html);
await writeFile('dist/.nojekyll','');
