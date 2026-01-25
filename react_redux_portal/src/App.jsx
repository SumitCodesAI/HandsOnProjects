import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ReactNotes from './pages/ReactNotes';
import ReduxNotes from './pages/ReduxNotes';
import CounterDemo from './pages/CounterDemo';
import TodoDemo from './pages/TodoDemo';
import UserDemo from './pages/UserDemo';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/react-notes" element={<ReactNotes />} />
            <Route path="/redux-notes" element={<ReduxNotes />} />
            <Route path="/counter" element={<CounterDemo />} />
            <Route path="/todos" element={<TodoDemo />} />
            <Route path="/users" element={<UserDemo />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
