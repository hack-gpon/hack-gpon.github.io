const fs = require('fs');
const path = require('path');

// Directories to process
const directories = [
  'ont',
  'ont-xgs',
  'ont-epon',
  'router',
  'tools',
  'sfp',
  'gpon',
  'sfp-cage',
  '.' // root directory for standalone pages
];

function convertJekyllIncludeToVueComponent(content) {
  // Convert {% include alert.html content="..." alert="..." icon="..." color="..." %}
  content = content.replace(
    /\{%\s*include\s+alert\.html\s+content="([^"]+)"\s+alert="([^"]*)"\s+icon="([^"]*)"\s+color="([^"]*)"\s*%\}/g,
    '<Alert content="$1" alert="$2" icon="$3" color="$4" />'
  );
  
  // Convert {% include alert.html content="..." color="..." %} (no alert, no icon)
  content = content.replace(
    /\{%\s*include\s+alert\.html\s+content="([^"]+)"\s+color="([^"]*)"\s*%\}/g,
    '<Alert content="$1" color="$2" />'
  );

  // Convert {% include image.html file="..." alt="..." caption="..." %}
  content = content.replace(
    /\{%\s*include\s+image\.html\s+file="([^"]+)"\s+alt="([^"]*)"\s+caption="([^"]*)"\s*%\}/g,
    '<ImageFigure file="$1" alt="$2" caption="$3" />'
  );
  
  // Convert {% include image.html file="..." alt="..." %}
  content = content.replace(
    /\{%\s*include\s+image\.html\s+file="([^"]+)"\s+alt="([^"]*)"\s*%\}/g,
    '<ImageFigure file="$1" alt="$2" />'
  );

  // Convert {% include cig_password.html username="..." %}
  content = content.replace(
    /\{%\s*include\s+cig_password\.html\s+username="([^"]*)"\s*%\}/g,
    '<CigPassword username="$1" />'
  );

  // Convert {% include cig_password.html %} (no username)
  content = content.replace(
    /\{%\s*include\s+cig_password\.html\s*%\}/g,
    '<CigPassword />'
  );

  // Convert {% include cig_password_xgspon.html username="..." %}
  content = content.replace(
    /\{%\s*include\s+cig_password_xgspon\.html\s+username="([^"]*)"\s*%\}/g,
    '<CigPasswordXgspon username="$1" />'
  );
  
  // Convert {% include cig_password_xgspon.html password_len="..." %}
  content = content.replace(
    /\{%\s*include\s+cig_password_xgspon\.html\s+password_len="([^"]*)"\s*%\}/g,
    '<CigPasswordXgspon />'
  );
  
  // Convert {% include cig_password_xgspon.html %}
  content = content.replace(
    /\{%\s*include\s+cig_password_xgspon\.html\s*%\}/g,
    '<CigPasswordXgspon />'
  );

  // Convert {% include root_lantiq.html unlockHuaweiShell=true %}
  content = content.replace(
    /\{%\s*include\s+root_lantiq\.html\s+unlockHuaweiShell=true\s*%\}/g,
    '<RootLantiq unlockHuaweiShell />'
  );

  // Convert {% include root_lantiq.html %}
  content = content.replace(
    /\{%\s*include\s+root_lantiq\.html\s*%\}/g,
    '<RootLantiq />'
  );

  // Convert {% include serial_dump.html title="..." file="..." alt="..." %}
  content = content.replace(
    /\{%\s*include\s+serial_dump\.html\s+[^%]*title="([^"]+)"[^%]*file="([^"]+)"[^%]*%\}/g,
    '<SerialDump title="$1" file="$2" />'
  );

  // Convert {% include ymodem_lantiq.html dontLoadRootScript=true %}
  content = content.replace(
    /\{%\s*include\s+ymodem_lantiq\.html\s+dontLoadRootScript=true\s*%\}/g,
    '<YmodemLantiq dontLoadRootScript />'
  );

  // Convert {% include ymodem_lantiq.html %}
  content = content.replace(
    /\{%\s*include\s+ymodem_lantiq\.html\s*%\}/g,
    '<YmodemLantiq />'
  );
  
  // Convert {% include_relative ... %} to comments for now
  content = content.replace(
    /\{%\s*include_relative\s+([^\s%]+)\s*%\}/g,
    '<!-- TODO: Include relative file: $1 -->'
  );

  return content;
}

function convertFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Parse frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    console.log(`No frontmatter found in ${filePath}`);
    return;
  }

  const frontmatter = frontmatterMatch[1];
  let body = frontmatterMatch[2];

  // Convert Jekyll includes to Vue components
  body = convertJekyllIncludeToVueComponent(body);

  // Parse Jekyll frontmatter
  const lines = frontmatter.split('\n');
  const newFrontmatter = {};

  lines.forEach(line => {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      const key = match[1];
      let value = match[2].trim();
      
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      // Convert Jekyll keys to VitePress keys
      if (key === 'title') {
        newFrontmatter.title = value;
      } else if (key === 'description' && value) {
        newFrontmatter.description = value;
      }
    }
  });

  // Write new content
  let newContent = '---\n';
  Object.entries(newFrontmatter).forEach(([key, value]) => {
    newContent += `${key}: ${value}\n`;
  });
  newContent += '---\n\n' + body;

  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`Converted: ${filePath}`);
}

function processDirectory(dir) {
  const fullPath = path.join(__dirname, '..', dir);
  
  if (!fs.existsSync(fullPath)) {
    return;
  }

  const stat = fs.statSync(fullPath);
  if (!stat.isDirectory()) {
    return;
  }

  const files = fs.readdirSync(fullPath);
  
  files.forEach(file => {
    const filePath = path.join(fullPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'scripts') {
      processDirectory(path.join(dir, file));
    } else if (file.endsWith('.md')) {
      convertFrontmatter(filePath);
    }
  });
}

// Process all directories
directories.forEach(dir => {
  console.log(`Processing directory: ${dir}`);
  processDirectory(dir);
});

console.log('Conversion complete!');
