# Jekyll to VitePress Migration Status

## Overview
This document tracks the migration from Jekyll + Just the Docs to VitePress.

## Completed ✅

### 1. VitePress Setup
- ✅ Installed VitePress and Vue dependencies
- ✅ Created `.vitepress/config.mts` with site configuration
- ✅ Set up URL rewrites to maintain Jekyll permalink structure
- ✅ Configured theme, navigation, search, and footer

### 2. Directory Structure  
- ✅ Renamed Jekyll collections to remove `_` prefix:
  - `_ont` → `ont`
  - `_ont_xgs` → `ont-xgs`
  - `_ont_epon` → `ont-epon`
  - `_router_pon` → `router`
  - `_tools` → `tools`
  - `_sfp` → `sfp`
  - `_gpon` → `gpon`
  - `_sfp_cage` → `sfp-cage`

### 3. Custom Theme
- ✅ Created custom VitePress theme extending default theme
- ✅ Added custom CSS for alerts, forms, buttons
- ✅ Set up component registration

### 4. Vue Components Created
- ✅ `Alert.vue` - For warning/info/tip boxes
- ✅ `ImageFigure.vue` - For images with captions
- ✅ `CigPassword.vue` - GPON password generator
- ✅ `CigPasswordXgspon.vue` - XGS-PON password generator
- ✅ `RootLantiq.vue` - Interactive root access component (placeholder)
- ✅ `SerialDump.vue` - Serial dump display
- ✅ `YmodemLantiq.vue` - Ymodem flash component (placeholder)

### 5. Content Conversion Script
- ✅ Created `scripts/convert-frontmatter.js`
- ✅ Converts Jekyll frontmatter to VitePress format
- ✅ Converts Jekyll includes to Vue components
- ✅ Handles Jekyll template variables ({{ page.title }}, {{ page.url }})
- ✅ Removes Jekyll button syntax

### 6. Build Configuration  
- ✅ Updated `package.json` with VitePress scripts
- ✅ Updated GitHub Actions workflow (`.github/workflows/pages.yml`)
- ✅ Removed Ruby/Jekyll dependencies from CI

## Remaining Work 🚧

### 1. Content Conversion Issues
- ⚠️ Some files still contain unconverted Jekyll includes (~41 files)
- ⚠️ Files without frontmatter need special handling
- ⚠️ `{% include_relative %}` tags need manual handling
- ⚠️ Some Liquid template variables may remain

###  2. Build Errors to Fix
- ❌ "Duplicate attribute" errors in some markdown files (Vue parser issue)
- ❌ Need to identify and fix malformed HTML/components in content
- ❌ May need to wrap certain content in raw blocks to prevent Vue processing

### 3. Interactive Components
The following components have placeholder implementations and need full functionality:
- 🔧 `RootLantiq.vue` - Serial interface for root access
- 🔧 `YmodemLantiq.vue` - Firmware flashing interface
- 🔧 `SerialDump.vue` - Should read actual dump files

### 4. Testing Needed
- [ ] Verify all URLs redirect correctly
- [ ] Test navigation structure matches Jekyll site
- [ ] Verify search functionality works
- [ ] Test dark/light mode toggle
- [ ] Check "Edit on GitHub" links
- [ ] Verify all images load correctly
- [ ] Test all interactive components

### 5. Assets & Static Files
- [ ] Verify all images in `assets/img/` are accessible
- [ ] Check PDF files are served correctly
- [ ] Verify favicon and manifest files work
- [ ] Test JavaScript assets in `assets/js/`

## Known Issues

1. **Vue Template Parsing**: VitePress processes markdown as Vue templates, which can cause issues with:
   - Curly braces `{{ }}` in code examples
   - HTML tags with duplicate attributes
   - Special characters in attributes

2. **Jekyll Liquid Syntax**: Some Liquid template syntax hasn't been fully converted:
   - `{% include_relative %}` - needs manual file inclusion
   - Complex conditional logic
   - Loops and data access

3. **URL Structure**: The rewrite rules attempt to maintain Jekyll URLs but need verification:
   - ONT GPON: `/ont-xxx` (root level)
   - ONT XGS-PON: `/xgs/ont-xxx`
   - ONT EPON: `/epon/xxx`
   - Router PON: `/router/xxx`
   - Other collections: root level

## Next Steps

1. **Fix Build Errors**: Address the "duplicate attribute" Vue parsing errors
2. **Complete Content Conversion**: Run the conversion script with improvements to handle all edge cases
3. **Implement Full Components**: Complete the interactive Web Serial API components
4. **Test Build**: Ensure `npm run build` completes successfully  
5. **Local Testing**: Run `npm run docs:dev` to test locally
6. **Deploy Preview**: Test deployment on a preview environment
7. **Full QA**: Test all pages, links, and functionality
8. **Go Live**: Merge to main and deploy

## Migration Benefits

### Advantages of VitePress
- ✅ Better performance (Vite-powered)
- ✅ Native Vue 3 component support
- ✅ Better TypeScript integration
- ✅ Faster hot module replacement (HMR)
- ✅ Built-in local search
- ✅ Modern dev experience
- ✅ No Ruby dependency

### Maintained Features
- ✅ Same URL structure
- ✅ Search functionality
- ✅ Dark/light mode
- ✅ Edit on GitHub
- ✅ Collapsible navigation
- ✅ Custom components
- ✅ Responsive design

## Resources

- [VitePress Documentation](https://vitepress.dev/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Migration Script](./scripts/convert-frontmatter.js)
- [VitePress Config](./. vitepress/config.mts)
- [Custom Theme](./. vitepress/theme/)
