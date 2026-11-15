// The four building blocks a lesson can use: Callout, Comparison,
// Information and the code block. Each one is a function that takes what you
// wrote in the lesson and returns the HTML to show.
//
// The colours and spacing are not here. They live in theme.css.
import { Children, isValidElement, useId, useState } from 'react';

// A small line drawing. aria-hidden keeps screen readers from announcing
// it, because the text label beside it already says the same thing.
function Icon({ d }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
const circle = 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z';

// ---------------------------------------------------------------- Callout
// A short message that stands apart from the text around it.
//
//   <Callout type="tip">Describe something the learner can do.</Callout>
//
// Each type has a word and an icon as well as a colour, so the meaning does
// not depend on seeing the colour.
const calloutTypes = {
  note: { label: 'Note', icon: `${circle}M12 11v5M12 8h.01` },
  tip: { label: 'Tip', icon: `${circle}M8 12.5l3 3 5-6` },
  warning: {
    label: 'Warning',
    icon: 'M12 4 2.5 20h19L12 4zM12 10v4.5M12 17.5h.01',
  },
};
export function Callout({ type = 'note', children }) {
  const kind = calloutTypes[type];
  if (!kind) {
    throw new Error(
      `A Callout has type="${type}". Use note, tip or warning instead.`,
    );
  }
  const labelId = useId();
  return (
    <aside className={`callout callout-${type}`} aria-labelledby={labelId}>
      <p className="box-label" id={labelId}>
        <Icon d={kind.icon} />
        {kind.label}
      </p>
      <div className="box-body">{children}</div>
    </aside>
  );
}

// ------------------------------------------------------------ Information
// Background detail a learner may want, with a bulb icon and your own title.
//
//   <Information title="Why this works">The explanation.</Information>
const bulb =
  'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z';
export function Information({ title = 'Information', children }) {
  const labelId = useId();
  return (
    <aside className="information" aria-labelledby={labelId}>
      <p className="box-label" id={labelId}>
        <Icon d={bulb} />
        {title}
      </p>
      <div className="box-body">{children}</div>
    </aside>
  );
}

// ------------------------------------------------------------- Comparison
// Two cards side by side. They stack on a narrow screen.
//
//   <Comparison label="Two ways to write an outcome">
//     <ComparisonItem title="First option" token="Short label">...</ComparisonItem>
//     <ComparisonItem title="Second option" token="Short label">...</ComparisonItem>
//   </Comparison>
//
// The rules below are strict on purpose. Break one and the page tells you
// which, so a lopsided comparison never reaches a learner.

// MDX passes the line breaks between components along as text. Ignore them.
const withoutWhitespace = (children) =>
  Children.toArray(children).filter(
    (child) => typeof child !== 'string' || child.trim(),
  );
export function Comparison({ label = 'Comparison', children }) {
  const items = withoutWhitespace(children);
  if (
    items.length !== 2 ||
    items.some((item) => !isValidElement(item) || item.type !== ComparisonItem)
  ) {
    throw new Error(
      'A Comparison needs exactly two ComparisonItem blocks inside it, and nothing else.',
    );
  }
  return (
    <section className="comparison" aria-label={label}>
      {items}
    </section>
  );
}
export function ComparisonItem({ title, token, children }) {
  const headingId = useId();
  if (
    typeof title !== 'string' ||
    !title.trim() ||
    typeof token !== 'string' ||
    !token.trim()
  ) {
    throw new Error(
      'Every ComparisonItem needs a title and a token, both written as text.',
    );
  }
  return (
    <section className="comparison-card" aria-labelledby={headingId}>
      {/* The token is a short text label. It carries the difference between
          the cards, so the colour is only a second cue. */}
      <span className="comparison-token">{token}</span>
      <h3 id={headingId}>{title}</h3>
      <div className="box-body">{children}</div>
    </section>
  );
}

// -------------------------------------------------------------- CodeBlock
// You do not write <CodeBlock> in a lesson. Any fenced code block (three
// backticks, the code, three backticks) is shown through this component.
// It adds the language name and a Copy button.
const languageNames = {
  bash: 'Terminal',
  sh: 'Terminal',
  css: 'CSS',
  html: 'HTML',
  js: 'JavaScript',
  json: 'JSON',
  jsx: 'JSX',
  md: 'Markdown',
  markdown: 'Markdown',
  mdx: 'MDX',
  yaml: 'YAML',
  yml: 'YAML',
};

// Collects the plain characters of the code, without the colouring.
const plainText = (node) =>
  typeof node === 'string'
    ? node
    : Children.toArray(node?.props?.children).map(plainText).join('');

export function CodeBlock({ children, ...props }) {
  const [status, setStatus] = useState('');
  // The word after the opening backticks, such as `yaml`, arrives as a
  // class name like "language-yaml".
  const code = Children.toArray(children)[0];
  const language = /language-([\w-]+)/.exec(code?.props?.className ?? '')?.[1];
  const name = languageNames[language] ?? language ?? 'Code';

  async function copy() {
    try {
      await navigator.clipboard.writeText(plainText(children));
      setStatus('Copied');
    } catch {
      // Some browsers block copying. Say so, and say what to do instead.
      setStatus('Copy was blocked. Select the code and copy it by hand.');
    }
    setTimeout(() => setStatus(''), 4000);
  }

  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span className="code-language">{name}</span>
        {/* role="status" makes a screen reader read the result aloud. */}
        <span className="code-status" role="status">
          {status}
        </span>
        <button type="button" onClick={copy}>
          Copy<span className="visually-hidden"> this code</span>
        </button>
      </div>
      {/* Long lines scroll sideways. tabIndex lets keyboard users reach the
          block and scroll it with the arrow keys. */}
      <pre {...props} tabIndex={0} role="region" aria-label={`${name} sample`}>
        {children}
      </pre>
    </div>
  );
}

// The names a lesson can use. `pre` is the HTML element behind a fenced code
// block, so mapping it here is what sends code blocks through CodeBlock.
export const components = {
  Callout,
  Information,
  Comparison,
  ComparisonItem,
  pre: CodeBlock,
};
