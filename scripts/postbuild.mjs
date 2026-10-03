import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
await rename('dist/app.html','dist/index.html');
const html=await readFile('dist/index.html','utf8');
await mkdir('dist/decisions',{recursive:true});
await writeFile('dist/decisions/index.html',html);
await writeFile('dist/404.html',html);
await writeFile('dist/.nojekyll','');
