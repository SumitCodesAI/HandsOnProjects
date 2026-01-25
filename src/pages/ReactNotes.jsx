import React from 'react';
import './ReactNotes.css';

const ReactNotes = () => {
  return (
    <div className="notes-container">
      <h1 className="notes-title">React Learning Notes</h1>
      
      <section className="note-section">
        <h2>What is React?</h2>
        <p>
          React is a JavaScript library for building user interfaces, particularly single-page 
          applications. It was developed by Facebook and is now maintained by Meta and a community 
          of developers.
        </p>
        <div className="highlight-box">
          <strong>Key Benefits:</strong>
          <ul>
            <li>Component-based architecture for reusable UI elements</li>
            <li>Virtual DOM for efficient updates</li>
            <li>Declarative programming style</li>
            <li>Strong ecosystem and community support</li>
          </ul>
        </div>
      </section>

      <section className="note-section">
        <h2>Components</h2>
        <p>
          Components are the building blocks of React applications. They are reusable pieces of 
          UI that can accept inputs (props) and return React elements describing what should 
          appear on the screen.
        </p>
        <div className="code-block">
          <pre>{`// Functional Component
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Using the component
<Welcome name="Sarah" />`}</pre>
        </div>
      </section>

      <section className="note-section">
        <h2>JSX (JavaScript XML)</h2>
        <p>
          JSX is a syntax extension for JavaScript that looks similar to HTML. It makes it easier 
          to write and understand React components.
        </p>
        <div className="code-block">
          <pre>{`const element = (
  <div className="container">
    <h1>Hello, World!</h1>
    <p>This is JSX</p>
  </div>
);`}</pre>
        </div>
      </section>

      <section className="note-section">
        <h2>React Hooks</h2>
        <p>
          Hooks are functions that let you use state and other React features in functional 
          components without writing a class.
        </p>
        
        <h3>useState</h3>
        <div className="code-block">
          <pre>{`import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`}</pre>
        </div>

        <h3>useEffect</h3>
        <div className="code-block">
          <pre>{`import { useEffect, useState } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Runs after component mounts
    fetchData().then(setData);
    
    // Cleanup function
    return () => {
      // Cleanup code
    };
  }, []); // Empty array = run once
  
  return <div>{data}</div>;
}`}</pre>
        </div>
      </section>

      <section className="note-section">
        <h2>Props vs State</h2>
        <div className="comparison-grid">
          <div className="comparison-card">
            <h3>Props</h3>
            <ul>
              <li>Read-only data passed from parent</li>
              <li>Immutable within component</li>
              <li>Used for component communication</li>
              <li>Trigger re-render when changed</li>
            </ul>
          </div>
          <div className="comparison-card">
            <h3>State</h3>
            <ul>
              <li>Internal component data</li>
              <li>Mutable using setState/hooks</li>
              <li>Used for interactive data</li>
              <li>Trigger re-render when updated</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="note-section">
        <h2>Conditional Rendering</h2>
        <div className="code-block">
          <pre>{`function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back!</h1>
      ) : (
        <h1>Please sign in</h1>
      )}
    </div>
  );
}`}</pre>
        </div>
      </section>

      <section className="note-section">
        <h2>Lists and Keys</h2>
        <div className="code-block">
          <pre>{`function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}`}</pre>
        </div>
        <div className="highlight-box warning">
          <strong>Important:</strong> Always use unique keys when rendering lists. 
          Keys help React identify which items have changed, been added, or removed.
        </div>
      </section>

      <section className="note-section">
        <h2>Best Practices</h2>
        <ul className="best-practices-list">
          <li>Keep components small and focused</li>
          <li>Use functional components with hooks</li>
          <li>Lift state up when multiple components need it</li>
          <li>Use prop-types or TypeScript for type checking</li>
          <li>Avoid inline function definitions in JSX</li>
          <li>Use React.memo() for performance optimization</li>
          <li>Follow naming conventions (PascalCase for components)</li>
        </ul>
      </section>
    </div>
  );
};

export default ReactNotes;
