// Vite is the tool that turns the files in this folder into a web page.
// You rarely need to edit this file. It is annotated so you can see what
// each part is for.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeHighlight from 'rehype-highlight';

export default defineConfig({
  plugins: [
    // Lets the project read .mdx files: Markdown that can also use components.
    mdx({
      remarkPlugins: [
        // Reads the block between the two --- lines at the top of a lesson.
        remarkFrontmatter,
        // Hands that block to the page, so the title and description can show.
        remarkMdxFrontmatter,
      ],
      rehypePlugins: [
        // Colours the code inside fenced code blocks. A fence marked `mdx` is
        // coloured with the Markdown rules, which are close enough to read well.
        [rehypeHighlight, { aliases: { markdown: ['mdx'] } }],
      ],
    }),
    // Lets the project use React, the library the components are written in.
    react(),
  ],
});
