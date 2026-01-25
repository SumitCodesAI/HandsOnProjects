import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to React & Redux Learning Portal</h1>
        <p className="hero-subtitle">
          Master modern web development with hands-on examples and interactive demonstrations
        </p>
      </div>

      {/* What is React Section */}
      <section className="tutorial-section">
        <h2 className="section-title">What is React? ⚛️</h2>
        <div className="content-card">
          <p className="intro-text">
            React is a powerful JavaScript library for building user interfaces, created and maintained by Meta (Facebook). 
            It has revolutionized modern web development by introducing a component-based architecture that makes building 
            complex UIs simple and maintainable.
          </p>
          
          <div className="key-concepts">
            <h3>Core Concepts:</h3>
            <div className="concepts-grid">
              <div className="concept-item">
                <span className="concept-icon">🧩</span>
                <h4>Component-Based</h4>
                <p>Build encapsulated components that manage their own state, then compose them to create complex UIs</p>
              </div>
              <div className="concept-item">
                <span className="concept-icon">📝</span>
                <h4>Declarative</h4>
                <p>Design simple views for each state, React efficiently updates and renders the right components when data changes</p>
              </div>
              <div className="concept-item">
                <span className="concept-icon">🔄</span>
                <h4>Virtual DOM</h4>
                <p>React creates an in-memory representation of the real DOM, making updates blazingly fast and efficient</p>
              </div>
              <div className="concept-item">
                <span className="concept-icon">🔌</span>
                <h4>Learn Once, Write Anywhere</h4>
                <p>Build mobile apps with React Native, desktop apps with Electron, all using React principles</p>
              </div>
            </div>
          </div>

          <div className="why-react">
            <h3>Why Use React?</h3>
            <ul className="benefits-list">
              <li><strong>Reusability:</strong> Build once, use everywhere. Components are highly reusable across your application</li>
              <li><strong>Performance:</strong> Virtual DOM ensures optimal performance even with complex UIs</li>
              <li><strong>Large Ecosystem:</strong> Massive community, countless libraries, and excellent tooling support</li>
              <li><strong>Developer Experience:</strong> Hot reloading, great dev tools, and intuitive debugging</li>
              <li><strong>Industry Standard:</strong> Used by Facebook, Netflix, Airbnb, Instagram, and thousands of companies</li>
            </ul>
          </div>
        </div>
      </section>

      {/* State Management Section */}
      <section className="tutorial-section alt-bg">
        <h2 className="section-title">Understanding State Management 🎯</h2>
        <div className="content-card">
          <p className="intro-text">
            State management is the practice of handling data that changes over time in your application. 
            It's the heart of interactive applications - every button click, form input, or API call involves state changes.
          </p>

          <div className="state-types">
            <h3>Types of State in React:</h3>
            <div className="state-grid">
              <div className="state-card">
                <h4>🔹 Local State</h4>
                <p><strong>Scope:</strong> Single component</p>
                <p><strong>Tool:</strong> useState, useReducer</p>
                <p><strong>Use Case:</strong> Form inputs, toggles, component-specific data</p>
                <div className="example">
                  <code>const [count, setCount] = useState(0)</code>
                </div>
              </div>
              
              <div className="state-card">
                <h4>🔹 Lifted State</h4>
                <p><strong>Scope:</strong> Parent + children</p>
                <p><strong>Tool:</strong> Props drilling</p>
                <p><strong>Use Case:</strong> Sharing data between sibling components</p>
                <div className="example">
                  <code>Parent → Child1 & Child2</code>
                </div>
              </div>
              
              <div className="state-card">
                <h4>🔹 Global State</h4>
                <p><strong>Scope:</strong> Entire application</p>
                <p><strong>Tool:</strong> Context API, Redux, Zustand</p>
                <p><strong>Use Case:</strong> User auth, theme, shopping cart</p>
                <div className="example">
                  <code>Accessible from any component</code>
                </div>
              </div>
              
              <div className="state-card">
                <h4>🔹 Server State</h4>
                <p><strong>Scope:</strong> Cached from backend</p>
                <p><strong>Tool:</strong> React Query, SWR, RTK Query</p>
                <p><strong>Use Case:</strong> API data, remote resources</p>
                <div className="example">
                  <code>Fetched & cached data</code>
                </div>
              </div>
            </div>
          </div>

          <div className="state-techniques">
            <h3>State Management Techniques:</h3>
            <div className="techniques-list">
              <div className="technique">
                <h4>1. Local State (useState)</h4>
                <p>Perfect for simple, component-specific data. Fast, easy, and requires no additional libraries.</p>
                <span className="badge best-for">Best for: Forms, toggles, counters</span>
              </div>
              <div className="technique">
                <h4>2. Context API</h4>
                <p>Built into React for sharing data across component tree without prop drilling. Great for theme, auth.</p>
                <span className="badge best-for">Best for: Theme, authentication, localization</span>
              </div>
              <div className="technique">
                <h4>3. Redux / Redux Toolkit</h4>
                <p>Robust solution for complex state. Predictable, debuggable with time-travel, ideal for large apps.</p>
                <span className="badge best-for">Best for: Complex apps, multiple data sources</span>
              </div>
              <div className="technique">
                <h4>4. React Query / SWR</h4>
                <p>Specialized for server state. Automatic caching, revalidation, and background updates.</p>
                <span className="badge best-for">Best for: API data, server synchronization</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Redux Section */}
      <section className="tutorial-section">
        <h2 className="section-title">What is Redux? 🔄</h2>
        <div className="content-card">
          <p className="intro-text">
            Redux is a predictable state container for JavaScript applications. It helps you write applications that 
            behave consistently, run in different environments, and are easy to test. Redux provides a centralized store 
            for state that needs to be used across your entire application.
          </p>

          <div className="redux-principles">
            <h3>Three Core Principles:</h3>
            <div className="principles-grid">
              <div className="principle">
                <div className="principle-number">1</div>
                <h4>Single Source of Truth</h4>
                <p>The entire state of your application is stored in a single object tree within a single store. This makes it easy to debug, inspect, and understand your app's state at any point.</p>
              </div>
              <div className="principle">
                <div className="principle-number">2</div>
                <h4>State is Read-Only</h4>
                <p>The only way to change state is by dispatching an action—an object describing what happened. This ensures state changes are predictable and traceable.</p>
              </div>
              <div className="principle">
                <div className="principle-number">3</div>
                <h4>Changes with Pure Functions</h4>
                <p>Reducers are pure functions that take the previous state and an action, and return the next state. No mutations, no side effects—just predictable transformations.</p>
              </div>
            </div>
          </div>

          <div className="redux-flow">
            <h3>Redux Data Flow:</h3>
            <div className="flow-visual">
              <div className="flow-item">
                <span className="flow-icon">👆</span>
                <h4>User Action</h4>
                <p>User clicks button</p>
              </div>
              <span className="flow-arrow">→</span>
              <div className="flow-item">
                <span className="flow-icon">📦</span>
                <h4>Dispatch Action</h4>
                <p>dispatch(increment())</p>
              </div>
              <span className="flow-arrow">→</span>
              <div className="flow-item">
                <span className="flow-icon">⚙️</span>
                <h4>Reducer</h4>
                <p>Updates state</p>
              </div>
              <span className="flow-arrow">→</span>
              <div className="flow-item">
                <span className="flow-icon">🔄</span>
                <h4>Store</h4>
                <p>New state saved</p>
              </div>
              <span className="flow-arrow">→</span>
              <div className="flow-item">
                <span className="flow-icon">🎨</span>
                <h4>UI Updates</h4>
                <p>Component re-renders</p>
              </div>
            </div>
          </div>

          <div className="redux-toolkit">
            <h3>Redux Toolkit - The Modern Approach 🚀</h3>
            <p>Redux Toolkit is the official, recommended way to write Redux logic. It simplifies the Redux experience and includes batteries-included defaults.</p>
            <div className="toolkit-features">
              <div className="toolkit-feature">✅ Simplified store setup with configureStore()</div>
              <div className="toolkit-feature">✅ Automatic Immer integration for "mutable" updates</div>
              <div className="toolkit-feature">✅ Built-in Redux Thunk for async logic</div>
              <div className="toolkit-feature">✅ Automatic action creators with createSlice()</div>
              <div className="toolkit-feature">✅ Redux DevTools enabled by default</div>
            </div>
          </div>
        </div>
      </section>

      {/* When to Use Redux Section */}
      <section className="tutorial-section alt-bg">
        <h2 className="section-title">When is Redux Beneficial? 💡</h2>
        <div className="content-card">
          <p className="intro-text">
            Redux shines in specific scenarios. Understanding when to use it (and when not to) is crucial for building 
            efficient applications. Here's a comprehensive guide to help you decide.
          </p>

          <div className="comparison-section">
            <div className="use-redux">
              <h3>✅ Use Redux When:</h3>
              <ul className="checklist">
                <li>
                  <strong>Large-scale applications</strong> with complex state that many components need
                </li>
                <li>
                  <strong>Deeply nested components</strong> that need to access the same data (avoiding prop drilling)
                </li>
                <li>
                  <strong>Frequent state updates</strong> from many different sources
                </li>
                <li>
                  <strong>State needs to be persisted</strong> (local storage, session) or rehydrated
                </li>
                <li>
                  <strong>Time-travel debugging</strong> is valuable for your development workflow
                </li>
                <li>
                  <strong>Complex business logic</strong> that involves multiple state updates
                </li>
                <li>
                  <strong>Collaborative state</strong> where multiple features interact with the same data
                </li>
                <li>
                  <strong>Undo/Redo functionality</strong> is required
                </li>
                <li>
                  <strong>Real-time updates</strong> from WebSockets or server events
                </li>
                <li>
                  <strong>Testing is critical</strong> - Redux makes unit testing logic easy
                </li>
              </ul>
            </div>

            <div className="avoid-redux">
              <h3>❌ You Might Not Need Redux If:</h3>
              <ul className="checklist negative">
                <li>Your app is small with minimal state management needs</li>
                <li>State is only used by one or two components</li>
                <li>You're just learning React - master local state first</li>
                <li>Simple parent-child relationships work fine</li>
                <li>Context API meets all your requirements</li>
                <li>Most of your state is server/API data (use React Query instead)</li>
                <li>The team is unfamiliar with Redux concepts</li>
              </ul>
            </div>
          </div>

          <div className="real-world-examples">
            <h3>Real-World Use Cases Where Redux Excels:</h3>
            <div className="use-cases-grid">
              <div className="use-case">
                <span className="use-case-icon">🛒</span>
                <h4>E-commerce Applications</h4>
                <p>Managing shopping cart, user preferences, product filters, and checkout state across multiple pages</p>
              </div>
              <div className="use-case">
                <span className="use-case-icon">💬</span>
                <h4>Chat Applications</h4>
                <p>Real-time messages, user presence, multiple chat rooms, notifications, and conversation history</p>
              </div>
              <div className="use-case">
                <span className="use-case-icon">📊</span>
                <h4>Dashboard Applications</h4>
                <p>Multiple widgets sharing data, filters affecting multiple views, real-time data updates</p>
              </div>
              <div className="use-case">
                <span className="use-case-icon">🎮</span>
                <h4>Gaming Applications</h4>
                <p>Game state, player inventory, leaderboards, achievements, and multiplayer synchronization</p>
              </div>
              <div className="use-case">
                <span className="use-case-icon">✏️</span>
                <h4>Collaborative Editors</h4>
                <p>Document state, cursor positions, undo/redo, real-time collaboration, version history</p>
              </div>
              <div className="use-case">
                <span className="use-case-icon">🏦</span>
                <h4>Financial Applications</h4>
                <p>Transaction history, account balances, complex calculations, audit trails, multi-step forms</p>
              </div>
            </div>
          </div>

          <div className="alternatives">
            <h3>Comparing Redux with Alternatives:</h3>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Solution</th>
                  <th>Complexity</th>
                  <th>Bundle Size</th>
                  <th>Learning Curve</th>
                  <th>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>useState</strong></td>
                  <td>Simple</td>
                  <td>0 KB (built-in)</td>
                  <td>Easy</td>
                  <td>Local component state</td>
                </tr>
                <tr>
                  <td><strong>Context API</strong></td>
                  <td>Medium</td>
                  <td>0 KB (built-in)</td>
                  <td>Moderate</td>
                  <td>Theme, auth, small apps</td>
                </tr>
                <tr>
                  <td><strong>Redux Toolkit</strong></td>
                  <td>Medium-High</td>
                  <td>~10 KB</td>
                  <td>Moderate-High</td>
                  <td>Large apps, complex state</td>
                </tr>
                <tr>
                  <td><strong>Zustand</strong></td>
                  <td>Low-Medium</td>
                  <td>~1 KB</td>
                  <td>Easy</td>
                  <td>Redux alternative, simpler API</td>
                </tr>
                <tr>
                  <td><strong>React Query</strong></td>
                  <td>Medium</td>
                  <td>~12 KB</td>
                  <td>Moderate</td>
                  <td>Server state, API data</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Interview Preparation Section */}
      <section className="tutorial-section interview-prep">
        <h2 className="section-title">Interview Preparation Guide 🎯</h2>
        <div className="content-card">
          <p className="intro-text">
            Ace your React and Redux interviews with these commonly asked questions and expert answers. 
            These cover fundamental to advanced concepts that interviewers love to explore.
          </p>

          <div className="interview-questions">
            <h3>🔥 Top React Interview Questions:</h3>
            <div className="question-group">
              <div className="question-item">
                <h4>Q: What is Virtual DOM and how does it work?</h4>
                <p><strong>Answer:</strong> Virtual DOM is a lightweight copy of the actual DOM kept in memory. When state changes, 
                React creates a new Virtual DOM tree, compares it with the previous one (diffing), and updates only the changed 
                parts in the real DOM (reconciliation). This makes updates much faster than manipulating the real DOM directly.</p>
              </div>

              <div className="question-item">
                <h4>Q: What are React Hooks? Name the most common ones.</h4>
                <p><strong>Answer:</strong> Hooks are functions that let you use state and lifecycle features in functional components. 
                Common hooks include: <code>useState</code> (state management), <code>useEffect</code> (side effects), 
                <code>useContext</code> (consume context), <code>useReducer</code> (complex state), <code>useMemo</code> (memoization), 
                <code>useCallback</code> (memoized callbacks), <code>useRef</code> (DOM refs/mutable values).</p>
              </div>

              <div className="question-item">
                <h4>Q: What is the difference between Props and State?</h4>
                <p><strong>Answer:</strong> Props are read-only data passed from parent to child components, while State is 
                mutable data managed within a component. Props enable component communication; State enables interactivity. 
                When props or state change, the component re-renders.</p>
              </div>

              <div className="question-item">
                <h4>Q: Explain useEffect and its cleanup function.</h4>
                <p><strong>Answer:</strong> useEffect runs side effects after render. It takes two arguments: a function and 
                a dependency array. The cleanup function (returned from the effect) runs before the component unmounts or before 
                the effect runs again. It's used for cleaning up subscriptions, timers, or event listeners to prevent memory leaks.</p>
              </div>

              <div className="question-item">
                <h4>Q: What is prop drilling and how can you avoid it?</h4>
                <p><strong>Answer:</strong> Prop drilling is passing props through multiple intermediate components that don't need 
                them, just to reach a deeply nested child. Avoid it using: Context API, Redux, component composition, 
                or custom hooks that encapsulate the logic.</p>
              </div>
            </div>

            <h3>🔥 Top Redux Interview Questions:</h3>
            <div className="question-group">
              <div className="question-item">
                <h4>Q: Explain the Redux data flow.</h4>
                <p><strong>Answer:</strong> 1) User interaction triggers an action dispatch, 2) Action is sent to the store, 
                3) Store passes the action to the reducer, 4) Reducer returns new state based on the action, 5) Store updates 
                with new state, 6) Connected components re-render with new data. It's a unidirectional data flow.</p>
              </div>

              <div className="question-item">
                <h4>Q: What are Redux middleware? Give examples.</h4>
                <p><strong>Answer:</strong> Middleware intercepts actions before they reach reducers, enabling async operations, 
                logging, crash reporting, etc. Examples: Redux Thunk (async actions), Redux Saga (complex async flows), 
                Redux Logger (logging), Redux Persist (state persistence). Redux Toolkit includes Thunk by default.</p>
              </div>

              <div className="question-item">
                <h4>Q: What is Redux Toolkit and why should you use it?</h4>
                <p><strong>Answer:</strong> Redux Toolkit is the official, recommended way to write Redux logic. It simplifies: 
                store setup (configureStore), reducer logic (createSlice), immutable updates (Immer), async logic (createAsyncThunk). 
                It reduces boilerplate by 50-70% and follows best practices by default.</p>
              </div>

              <div className="question-item">
                <h4>Q: What's the difference between useSelector and connect?</h4>
                <p><strong>Answer:</strong> Both connect components to Redux store. <code>useSelector</code> is a hook for 
                functional components, more concise and flexible. <code>connect</code> is an HOC for class components, more verbose. 
                useSelector causes component re-renders on selected state changes; connect has more granular control with 
                mapStateToProps optimization.</p>
              </div>

              <div className="question-item">
                <h4>Q: How do you handle async operations in Redux?</h4>
                <p><strong>Answer:</strong> Use middleware like Redux Thunk or Redux Saga. With Redux Toolkit, use 
                <code>createAsyncThunk</code> which handles pending/fulfilled/rejected states automatically. You can also use 
                RTK Query for data fetching which provides caching, invalidation, and polling out of the box.</p>
              </div>

              <div className="question-item">
                <h4>Q: What are selectors and why use them?</h4>
                <p><strong>Answer:</strong> Selectors are functions that extract specific data from the Redux store. Benefits: 
                1) Encapsulate state shape knowledge, 2) Enable memoization with Reselect to avoid unnecessary computations, 
                3) Make testing easier, 4) Provide a clean API for components. Example: <code>const user = useSelector(selectUser)</code></p>
              </div>
            </div>
          </div>

          <div className="interview-tips">
            <h3>💼 Interview Success Tips:</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <span className="tip-icon">💪</span>
                <h4>Master the Fundamentals</h4>
                <p>Know Virtual DOM, component lifecycle, hooks, and state management inside out</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">🛠️</span>
                <h4>Build Projects</h4>
                <p>Create real applications using React and Redux - interviewers love practical experience</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">📝</span>
                <h4>Code on Whiteboard</h4>
                <p>Practice writing React components and Redux logic without IDE assistance</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">🐛</span>
                <h4>Debug Like a Pro</h4>
                <p>Know React DevTools and Redux DevTools - demonstrate debugging skills</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">⚡</span>
                <h4>Performance Optimization</h4>
                <p>Understand useMemo, useCallback, React.memo, code splitting, and lazy loading</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">🧪</span>
                <h4>Testing Knowledge</h4>
                <p>Be familiar with Jest, React Testing Library, and testing Redux logic</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start CTA */}
      <div className="cta-section">
        <h2>Ready to Start Learning? 🚀</h2>
        <p>Explore our interactive demos and detailed notes to master React and Redux</p>
        <div className="cta-buttons">
          <a href="/react-notes" className="cta-btn primary">React Notes</a>
          <a href="/redux-notes" className="cta-btn primary">Redux Notes</a>
          <a href="/counter" className="cta-btn secondary">Try Demos</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
