import React from 'react';
import './ReduxNotes.css';

const ReduxNotes = () => {
  return (
    <div className="notes-container">
      <h1 className="notes-title">Redux Learning Notes</h1>
      
      <section className="note-section">
        <h2>What is Redux?</h2>
        <p>
          Redux is a predictable state container for JavaScript applications. It helps you manage 
          application state in a centralized store, making state changes predictable and traceable.
        </p>
        <div className="highlight-box">
          <strong>Core Principles:</strong>
          <ul>
            <li><strong>Single Source of Truth:</strong> The entire application state is stored in a single object tree</li>
            <li><strong>State is Read-Only:</strong> The only way to change state is by dispatching actions</li>
            <li><strong>Changes with Pure Functions:</strong> Reducers are pure functions that specify how state changes</li>
          </ul>
        </div>
      </section>

      <section className="note-section">
        <h2>Redux Toolkit (RTK)</h2>
        <p>
          Redux Toolkit is the official, recommended way to write Redux logic. It simplifies Redux 
          development and includes utilities to simplify common use cases.
        </p>
        <div className="code-block">
          <pre>{`npm install @reduxjs/toolkit react-redux`}</pre>
        </div>
      </section>

      <section className="note-section">
        <h2>Creating a Slice</h2>
        <p>
          A "slice" is a collection of Redux reducer logic and actions for a single feature. 
          Redux Toolkit's createSlice() function generates action creators and action types automatically.
        </p>
        <div className="code-block">
          <pre>{`import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = 
  counterSlice.actions;
export default counterSlice.reducer;`}</pre>
        </div>
      </section>

      <section className="note-section">
        <h2>Configuring the Store</h2>
        <p>
          The Redux store holds the complete state tree of your application. You create it using 
          configureStore() from Redux Toolkit.
        </p>
        <div className="code-block">
          <pre>{`import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import todosReducer from './slices/todosSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
  },
});`}</pre>
        </div>
      </section>

      <section className="note-section">
        <h2>Providing the Store</h2>
        <p>
          Wrap your application with the Provider component to make the Redux store available 
          to all components.
        </p>
        <div className="code-block">
          <pre>{`import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {
  return (
    <Provider store={store}>
      <YourApp />
    </Provider>
  );
}`}</pre>
        </div>
      </section>

      <section className="note-section">
        <h2>Using Redux in Components</h2>
        
        <h3>Reading State with useSelector</h3>
        <div className="code-block">
          <pre>{`import { useSelector } from 'react-redux';

function Counter() {
  const count = useSelector((state) => state.counter.value);
  
  return <div>Count: {count}</div>;
}`}</pre>
        </div>

        <h3>Dispatching Actions with useDispatch</h3>
        <div className="code-block">
          <pre>{`import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement } from './counterSlice';

function Counter() {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter.value);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>
        Increment
      </button>
      <button onClick={() => dispatch(decrement())}>
        Decrement
      </button>
    </div>
  );
}`}</pre>
        </div>
      </section>

      <section className="note-section">
        <h2>Redux Data Flow</h2>
        <div className="flow-diagram">
          <div className="flow-step">
            <div className="flow-number">1</div>
            <div className="flow-content">
              <h4>User Interaction</h4>
              <p>User clicks a button or triggers an event</p>
            </div>
          </div>
          <div className="flow-arrow">↓</div>
          <div className="flow-step">
            <div className="flow-number">2</div>
            <div className="flow-content">
              <h4>Dispatch Action</h4>
              <p>Component dispatches an action to the store</p>
            </div>
          </div>
          <div className="flow-arrow">↓</div>
          <div className="flow-step">
            <div className="flow-number">3</div>
            <div className="flow-content">
              <h4>Reducer Processes</h4>
              <p>Reducer receives action and updates state</p>
            </div>
          </div>
          <div className="flow-arrow">↓</div>
          <div className="flow-step">
            <div className="flow-number">4</div>
            <div className="flow-content">
              <h4>UI Updates</h4>
              <p>Components re-render with new state</p>
            </div>
          </div>
        </div>
      </section>

      <section className="note-section">
        <h2>When to Use Redux</h2>
        <div className="comparison-grid">
          <div className="comparison-card good">
            <h3>✓ Good Use Cases</h3>
            <ul>
              <li>Large applications with complex state</li>
              <li>State needed across many components</li>
              <li>Frequent state updates</li>
              <li>Need for time-travel debugging</li>
              <li>Server-side rendering requirements</li>
            </ul>
          </div>
          <div className="comparison-card bad">
            <h3>✗ May Not Need Redux</h3>
            <ul>
              <li>Small applications</li>
              <li>State only used in a few components</li>
              <li>Simple parent-child relationships</li>
              <li>Mostly static data</li>
              <li>Learning React basics</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="note-section">
        <h2>Best Practices</h2>
        <ul className="best-practices-list">
          <li>Use Redux Toolkit instead of plain Redux</li>
          <li>Keep state normalized (avoid nested data)</li>
          <li>Use meaningful action names</li>
          <li>Keep reducers pure (no side effects)</li>
          <li>Use selectors for derived state</li>
          <li>Don't put everything in Redux (local state is fine)</li>
          <li>Use Redux DevTools for debugging</li>
          <li>Consider RTK Query for data fetching</li>
        </ul>
      </section>

      <section className="note-section">
        <h2>Async Operations with Redux Thunk</h2>
        <p>
          Redux Toolkit includes Redux Thunk by default, allowing you to write async logic that 
          interacts with the store.
        </p>
        <div className="code-block">
          <pre>{`import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await fetch('/api/users');
    return response.json();
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    entities: [],
    loading: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.entities = action.payload;
      });
  },
});`}</pre>
        </div>
      </section>
    </div>
  );
};

export default ReduxNotes;
