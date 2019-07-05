import React from 'react';
import './App.css';

import IntervalGrid from './components/IntervalGrid/IntervalGrid';

const list = [{
  start: 0 * 60 * 1000,
  end: 60 * 60 * 1000,
  type: 1,
  id: '1'
}, {
  start: 70 * 60 * 1000,
  end: 120 * 60 * 1000,
  type: 2,
  id: '2'
}];

const App: React.FC = () => {
  return (
    <div className="App">
      <IntervalGrid
        list={list}
      />
    </div>
  );
}

export default App;
