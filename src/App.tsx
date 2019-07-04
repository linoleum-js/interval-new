import React from 'react';
import './App.css';

import IntervalGrid from './components/IntervalGrid/IntervalGrid';

const list = [{
  start: 0,
  end: 10,
  type: 1,
  id: '1'
}, {
  start: 20,
  end: 30,
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
