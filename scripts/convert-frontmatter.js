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
  // More flexible regex that handles attributes in any order
  content = content.replace(
    /\{%\s*include\s+alert\.html\s+([^%]+)%\}/g,
    (match, attrs) => {
      const contentMatch = attrs.match(/content="([^"]+)"/);
      const alertMatch = attrs.match(/alert="([^"]*)"/);
      const iconMatch = attrs.match(/icon="([^"]*)"/);
      const colorMatch = attrs.match(/color="([^"]*)"/);
      const content = contentMatch ? contentMatch[1] : '';
      const alert = alertMatch ? alertMatch[1] : '';
      const icon = iconMatch ? iconMatch[1] : '';
      const color = colorMatch ? colorMatch[1] : '';
      
      let result = `<Alert content="${content}"`;
      if (alert) result += ` alert="${alert}"`;
      if (icon) result += ` icon="${icon}"`;
      if (color) result += ` color="${color}"`;
      result += ' />';
      return result;
    }
  );

  // Convert {% include image.html file="..." alt="..." caption="..." %}
  // More flexible regex that handles attributes in any order
  content = content.replace(
    /\{%\s*include\s+image\.html\s+([^%]+)%\}/g,
    (match, attrs) => {
      const fileMatch = attrs.match(/file="([^"]+)"/);
      const altMatch = attrs.match(/alt="([^"]*)"/);
      const captionMatch = attrs.match(/caption="([^"]*)"/);
      const file = fileMatch ? fileMatch[1] : '';
      const alt = altMatch ? altMatch[1] : '';
      const caption = captionMatch ? captionMatch[1] : '';
      if (caption) {
        return `<ImageFigure file="${file}" alt="${alt}" caption="${caption}" />`;
      } else {
        return `<ImageFigure file="${file}" alt="${alt}" />`;
      }
    }
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
  // More flexible regex that handles attributes in any order
  content = content.replace(
    /\{%\s*include\s+serial_dump\.html\s+([^%]+)%\}/g,
    (match, attrs) => {
      const titleMatch = attrs.match(/title="([^"]+)"/);
      const fileMatch = attrs.match(/file="([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : '';
      const file = fileMatch ? fileMatch[1] : '';
      return `<SerialDump title="${title}" file="${file}" />`;
    }
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
  
  // Convert Jekyll liquid variables
  // {{ page.title }} -> use frontmatter $frontmatter.title in VitePress
  content = content.replace(
    /\{\{\s*page\.title\s*\}\}/g,
    '{{ $frontmatter.title }}'
  );
  
  // {{ page.url }} -> use $page.relativePath converted to URL
  content = content.replace(
    /\{\{\s*page\.url\s*\}\}/g,
    '{{ $page.filePath }}'
  );
  
  // Remove Jekyll button syntax {: .btn .btn-green }
  content = content.replace(
    /\{\:\s*\.btn[^}]*\}/g,
    ''
  );

  return content;
}

function convertFrontmatter(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Parse frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  let frontmatter = '';
  let body = '';
  let newFrontmatter = {};
  
  if (!frontmatterMatch) {
    // No frontmatter, just convert the body
    body = content;
    console.log(`No frontmatter found in ${filePath}, converting includes only`);
  } else {
    frontmatter = frontmatterMatch[1];
    body = frontmatterMatch[2];
    
    // Parse Jekyll frontmatter
    const lines = frontmatter.split('\n');
    
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
  }

  // Convert Jekyll includes to Vue components
  body = convertJekyllIncludeToVueComponent(body);

  // Write new content
  let newContent = '';
  if (Object.keys(newFrontmatter).length > 0 || frontmatterMatch) {
    newContent = '---\n';
    if (Object.keys(newFrontmatter).length > 0) {
      Object.entries(newFrontmatter).forEach(([key, value]) => {
        newContent += `${key}: ${value}\n`;
      });
    }
    newContent += '---\n\n' + body;
  } else {
    newContent = body;
  }

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
