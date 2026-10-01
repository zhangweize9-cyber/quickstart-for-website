> [!NOTE]  
> If this is your first time cloning this repository, see `package.json` for `pnpm install`. Ensure installed nginx, with `/etc/nginx/conf.d/` to `./.configruation/frontend/nginx.conf`.  
> If you need to debug this project, please use the `pnpm dev` command to start Vite, to build production files, use the `pnpm build` command.  

This project is based on `xterm`, and `just-bash` provides a virtualized set of basic BusyBox tools.  

If you have perfected the interface for this project and want to submit a Pull request, use `pnpm exec typedoc` to generate the interface document, this command will automatically generate the document in the `docs/api/` directory. Be sure to use tsdoc to write annotations.  

Here's the file structure:  

```
.
├── dist
│   ├── assets
│   └── index.html
├── docs
│   └── api
├── LICENSE
├── markdown
│   ├── api-examples.md
│   ├── hello.mdx
│   ├── index.md
│   └── markdown-examples.md
├── README.md
├── src
│   ├── index.html
│   └── script
├── terminal
│   ├── index.html
│   ├── style
│   ├── terminal-search.ts
│   ├── utils
│   └── vite-env.d.ts
├── tsconfig.json
├── typedoc.json
└── vite.config.mjs
```
