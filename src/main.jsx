// This file builds the page around your lessons: the header, the lesson
// list, the title and the Previous/Next links. The lesson text itself lives
// in the lessons folder, so most edits never touch this file.
import {
  Component,
  StrictMode,
  useEffect,
  useRef,
  useSyncExternalStore,
} from 'react';
import { createRoot } from 'react-dom/client';
import { components } from './components.jsx';
import './theme.css';

// Collect every .mdx file in the lessons folder. Adding a file there adds a
// lesson here. There is no second list to update.
const files = import.meta.glob('../lessons/*.mdx', { eager: true });

// Sort by file name, so 01-... comes before 02-... The number in the file
// name sets the order. The id inside the file sets the link.
const lessons = Object.keys(files)
  .sort()
  .map((path) => {
    const file = path.split('/').pop();
    const { default: Content, frontmatter = {} } = files[path];
    return {
      file,
      Content,
      id: frontmatter.id ?? file.replace(/^\d+-|\.mdx$/g, ''),
      title: frontmatter.title ?? file,
      description: frontmatter.description,
    };
  });

// The part of the address after # says which lesson to show, for example
// http://127.0.0.1:5173/#learning-activity
const subscribe = (callback) => {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
};
const readHash = () => decodeURIComponent(window.location.hash.slice(1));

// If a lesson cannot be displayed, show the reason in plain words instead
// of a blank page.
class LessonProblem extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="lesson-problem" role="alert">
        <p className="lesson-problem-title">This lesson cannot be shown yet</p>
        <p>{this.state.error.message}</p>
        <p>
          Fix <code>lessons/{this.props.file}</code>, save it, then try again.
        </p>
        <button type="button" onClick={() => this.setState({ error: null })}>
          Try again
        </button>
      </div>
    );
  }
}

function App() {
  const hash = useSyncExternalStore(subscribe, readHash);
  const index = Math.max(
    0,
    lessons.findIndex((lesson) => lesson.id === hash),
  );
  const lesson = lessons[index];
  const heading = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (!lesson) return;
    // The browser tab shows the lesson title.
    document.title = `${lesson.title} · Owlchemy Lab`;
    // After switching lessons, start at the top and move keyboard and
    // screen reader focus to the new title. Skipped on the first load.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    heading.current?.focus();
  }, [lesson]);

  if (!lesson)
    return (
      <main className="page">
        <h1>No lessons yet</h1>
        <p>
          Add a file ending in <code>.mdx</code> to the <code>lessons</code>{' '}
          folder.
        </p>
      </main>
    );

  const { Content } = lesson;
  const previous = lessons[index - 1];
  const next = lessons[index + 1];

  return (
    <>
      {/* Lets keyboard users jump past the header straight to the lesson. */}
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          heading.current?.focus();
        }}
      >
        Skip to the lesson
      </a>

      <header className="site-header">
        <div className="page">
          <p className="site-name">Owlchemy Lab</p>
          <p className="site-tagline">
            Edit a lesson file, save it, and watch this page change.
          </p>
          <nav aria-label="Lessons">
            <ol className="lesson-list">
              {lessons.map((item, position) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={item === lesson ? 'page' : undefined}
                  >
                    <span className="lesson-number">{position + 1}</span>
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </header>

      <main id="main" className="page">
        <article className="reading">
          <header className="lesson-header">
            <p className="eyebrow">
              Lesson {index + 1} of {lessons.length}
            </p>
            <h1 ref={heading} tabIndex={-1}>
              {lesson.title}
            </h1>
            {lesson.description && (
              <p className="intro">{lesson.description}</p>
            )}
          </header>

          <LessonProblem key={lesson.id} file={lesson.file}>
            {/* The lesson text, with the four components made available. */}
            <Content components={components} />
          </LessonProblem>

          <nav className="pager" aria-label="Previous and next lesson">
            {previous ? (
              <a href={`#${previous.id}`}>
                <span aria-hidden="true">← </span>Previous: {previous.title}
              </a>
            ) : (
              <span />
            )}
            {next && (
              <a className="pager-next" href={`#${next.id}`}>
                Next: {next.title}
                <span aria-hidden="true"> →</span>
              </a>
            )}
          </nav>
        </article>
      </main>

      <footer className="site-footer">
        <div className="page">
          <p>
            Nothing on this page is tracked or saved. It reads your files and
            shows them.
          </p>
        </div>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
