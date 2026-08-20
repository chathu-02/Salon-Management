const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      processDir(full);
    } else if (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx')) {
      let content = fs.readFileSync(full, 'utf8');
      let updated = content
        .replace(/from\s+['"](\.\.\/)+lib\/(.*?)['"]/g, "from '@/lib/$2'")
        .replace(/from\s+['"](\.\.\/)+context\/(.*?)['"]/g, "from '@/context/$2'")
        .replace(/from\s+['"](\.\.\/)+components\/(.*?)['"]/g, "from '@/components/$2'");
      if (content !== updated) {
        fs.writeFileSync(full, updated, 'utf8');
        console.log('Fixed imports in:', full);
      }
    }
  }
}

const workspaceRoot = path.join(__dirname, '..');
processDir(path.join(workspaceRoot, 'app'));
processDir(path.join(workspaceRoot, 'components'));
console.log('All imports updated to @/ alias successfully!');
