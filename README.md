```
 _   _               _       ____  ____    ___   _   _ 
| | | |  __ _   ___ | | __  / ___||  _ \  / _ \ | \ | |
| |_| | / _` | / __|| |/ / | |  _ | |_) || | | ||  \| |
|  _  || (_| || (__ |   <  | |_| ||  __/ | |_| || |\  |
|_| |_| \__,_| \___||_|\_\  \____||_|     \___/ |_| \_|
```

# Hack GPON

Worldwide wiki on how to access, change and edit ONTs, built with [VitePress](https://vitepress.dev/).

if you want to contribute there is something to be done:

- a unique template for all sticks
- how to use arduino as TTL/UART adapter
- theoretical information on GPON
- absent stick information
- quick start
- absent and new ont

## How to build

- Install node (22)
- Run `npm ci` to install the dependencies
- Run `npm run dev` to start the development server on http://localhost:5173
- Run `npm run build` to build the website in `.vitepress/dist` (`npm run preview` serves the build)

Alternatively, you can just run `docker compose up` and open http://localhost:5173

## Structure

| Folder      | Section                   | URL                  |
| ----------- | ------------------------- | -------------------- |
| `ont`       | ONT GPON                  | `/<file name>/`      |
| `ont-xgs`   | ONT XGS-PON               | `/xgs/<file name>/`  |
| `ont-epon`  | ONT EPON                  | `/epon/<file name>/` |
| `router`    | Router PON                | `/router/<file name>/` |
| `tools`     | Tools                     | `/<file name>/`      |
| `sfp`       | SFP Resources & standard  | `/<file name>/`      |
| `gpon`      | GPON Resources & standard | `/<file name>/`      |
| `sfp-cage`  | SFP cage                  | `/<file name>/`      |

Images and other static files are in `public/assets/` and are served from `/assets/`.

The sidebar is generated from the front matter of the pages:

```yaml
---
title: Huawei MA5671A   # title of the page and of the sidebar item
parent: Huawei          # title of the parent page
has_children: true      # the page has child pages
nav_order: 1            # optional, position in the sidebar (otherwise sorted by title)
nav_exclude: true       # optional, hide the page from the sidebar
alias: Some other name  # optional, "Also sold as"
redirect_to: /other-page # optional, the page redirects to another one
search: false           # optional, exclude the page from the search (was `search_exclude`)
---
```

Only one `key: value` per line is read for the navigation: YAML lists and multi-line values are not supported (the build prints a warning).

Links to a redirect page are replaced at build time by links to its destination.

## Syntax

Alerts:

```md
::: info Note
Some text with **markdown**
:::
```

The available types are `info` (blue), `tip` (green), `warning` (yellow), `danger` (red) and `details` (collapsible).

Images with caption (the file is relative to `public/assets/img/`):

```md
<ImageFigure file="vendor/photo.jpg" alt="Alternative text" caption="Caption" />
```

Serial dumps (the file is relative to the page):

```md
::: details Boot log
<<< ./serial_dump/boot.txt
:::
```

Partials with parameters (Liquid templates in the `_partials` folders):

```md
<!--@partial: ./_partials/ont-luna-sdk-useful-commands.md
flash: "flash"
ploam: "ascii"
-->
```

Pages written with the old Jekyll syntax (`{% include alert.html ... %}`, `{% include image.html ... %}`, ...) can be converted with `npm run convert -- path/to/page.md`.
