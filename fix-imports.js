const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const updated = content.replace(/(from\s+['"][^'"]+?)\.js(['"])/g, '$1$2');
      if (content !== updated) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log('Fixed imports in:', entry.name);
      }
    }
  }
}

processDir(path.join(__dirname, 'apps', 'web', 'src'));
console.log('All frontend imports cleaned successfully!');
