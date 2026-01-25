import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount, reset } from '../store/slices/counterSlice';
import './CounterDemo.css';

const CounterDemo = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(5);

  return (
    <div className="demo-container">
      <h1 className="demo-title">Counter Demo</h1>
      <p className="demo-description">
        This interactive demo shows how Redux manages state. Click the buttons to dispatch actions 
        and watch the state update in real-time!
      </p>

      <div className="demo-content">
        <div className="counter-display">
          <div className="counter-value">{count}</div>
          <div className="counter-label">Current Count</div>
        </div>

        <div className="controls-grid">
          <button 
            className="control-btn increment" 
            onClick={() => dispatch(increment())}
          >
            <span className="btn-icon">+</span>
            Increment
          </button>
          
          <button 
            className="control-btn decrement" 
            onClick={() => dispatch(decrement())}
          >
            <span className="btn-icon">−</span>
            Decrement
          </button>
          
          <button 
            className="control-btn reset" 
            onClick={() => dispatch(reset())}
          >
            <span className="btn-icon">↻</span>
            Reset
          </button>
        </div>

        <div className="custom-amount">
          <label htmlFor="amount">Add Custom Amount:</label>
          <div className="amount-controls">
            <input 
              id="amount"
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))}
              className="amount-input"
            />
            <button 
              className="control-btn custom" 
              onClick={() => dispatch(incrementByAmount(amount))}
            >
              Add {amount}
            </button>
          </div>
        </div>
      </div>

      <div className="code-explanation">
        <h3>How it works:</h3>
        <div className="explanation-grid">
          <div className="explanation-card">
            <h4>1. State in Redux Store</h4>
            <p>The counter value is stored in the Redux store, accessible to any component.</p>
          </div>
          <div className="explanation-card">
            <h4>2. Dispatch Actions</h4>
            <p>Buttons dispatch actions (increment, decrement, reset) to update the state.</p>
          </div>
          <div className="explanation-card">
            <h4>3. Reducer Updates State</h4>
            <p>The reducer processes the action and returns the new state immutably.</p>
          </div>
          <div className="explanation-card">
            <h4>4. Component Re-renders</h4>
            <p>React automatically re-renders the component with the updated value.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterDemo;
