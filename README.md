# Owlchemy Lab

A small course page you run on your own computer to practise editing lessons as files. It has four components, one example lesson and one stylesheet.

It does not track anything. There is no account, no server, no database and no saved progress. The page reads the files in this folder and shows them.

## Start it

You need [Node.js](https://nodejs.org/) 22.12 or later. Check with `node -v`.

Open this folder in VS Code, open a terminal (Terminal → New Terminal) and run these two commands. The first installs the tools at the versions recorded in `package-lock.json`. Run it when first setting up the project, after the lockfile changes, or after deleting `node_modules/`.

```bash
npm ci
```

```bash
npm run dev
```

The terminal prints an address such as `http://127.0.0.1:5173`. Open it in your browser. Leave the terminal running while you work, and press Ctrl+C in it when you are done.

## Make your first change

1. Open `lessons/01-plan-a-clear-activity.mdx`.
2. Change the `title` near the top and save.
3. Look at the browser. The heading has changed without a refresh.

The lesson file has notes in it explaining each part. Notes written as `{/* like this */}` never appear on the page.

## What is in this folder

| Path | What it is | Edit it? |
|---|---|---|
| `lessons/` | The lessons, one `.mdx` file each | Yes, this is where you work |
| `src/components.jsx` | The four components | When you want to change how one behaves |
| `src/theme.css` | Every colour, font and spacing value | When you want to change how things look |
| `src/main.jsx` | The page around a lesson: header, lesson list, title | Rarely |
| `index.html`, `vite.config.js`, `eslint.config.js` | Project setup | Rarely |
| `package.json`, `package-lock.json` | The list of tools the project uses | No, npm manages these |
| `node_modules/`, `dist/` | Created by installing packages and building the site | No; safe to delete, and Git ignores them |

## Lessons

A lesson is a file in `lessons/` ending in `.mdx`. The number at the start of the file name sets the order. To add a lesson, copy the example file, rename it `02-your-topic.mdx` and give it a new `id`. It appears in the lesson list on its own.

Every lesson starts with a block between two `---` lines:

```yaml
---
id: learning-activity
title: "Plan a clear activity"
description: Identify a workplace task and evidence of success.
---
```

The page uses only these three metadata fields. `title` and `description` are shown at the top of the page and are safe to reword. `id` is the lesson's permanent name and the end of its web address, so leave it alone once you have shared a link. Put quotes around a value that contains a colon.

Below that block, write Markdown. Start section headings at `##`, because the title is already the page's main heading.

## Components

| You type | You get |
|---|---|
| `<Callout type="note">…</Callout>` | A blue box labelled Note |
| `<Callout type="tip">…</Callout>` | A green box labelled Tip |
| `<Callout type="warning">…</Callout>` | An amber box labelled Warning |
| `<Information title="…">…</Information>` | A violet box with a bulb icon and your title |
| `<Comparison>` with two `<ComparisonItem title="…" token="…">` | Two cards side by side |
| A fenced code block | Coloured code with a language label and a Copy button |

The example lesson, `lessons/01-plan-a-clear-activity.mdx`, demonstrates these components and includes notes explaining how to use them.

## When something breaks

A red overlay in the browser means the file has a typing mistake, most often a tag that was opened and never closed. The overlay names the file and the line. Fix it and save, and the overlay goes away.

An amber box saying "This lesson cannot be shown yet" means a component rule was broken, such as a Comparison with one card. The box says which rule. Fix the file, save, and choose Try again.

If the page stops updating, check that the terminal is still running `npm run dev`.

## Change the look

All colours are named at the top of `src/theme.css`. Each one has a note giving its contrast against the background. Text needs a contrast of 4.5 or more to be readable for most people, so check a new colour with the [WebAIM contrast checker](https://webaim.org/resources/contrastchecker/) before you use it.

## Check your work

```bash
npm run check
```

This looks for mistakes in the code, including accessibility mistakes in the components, and then builds the site into `dist/`. If it finishes without errors, the project is in a state you can commit.

## Using this with Git

This folder is already a Git repository. To open it in GitHub Desktop, choose File → Add local repository and select this folder. Review your changes and commit them when ready. The `.gitignore` file keeps `node_modules/` and `dist/` out of your commits; keep `package-lock.json` committed so installs use the same package versions.
