import { marked } from 'marked';

// Import all markdown files from /doc at build time
const mdModules = import.meta.glob('../../doc/*.md', { as: 'raw', eager: true });

const docs = {};
for (const path in mdModules) {
  // path looks like '../../doc/filename.md'
  const name = path.split('/').pop().replace(/\.md$/, '');
  const md = mdModules[path];
  docs[name] = marked.parse(md, {headerIds: false, mangle: false});
}

export default docs;
