import React from 'react';
import './App.css';

import RangeGrid from './components/RangeGrid/RangeGrid';

const list = [{
  start: 0 * 60 * 1000,
  end: 60 * 60 * 1000,
  type: 1,
  id: '1'
}, {
  start: 250 * 60 * 1000,
  end: 380 * 60 * 1000,
  type: 2,
  id: '2'
}];

const App: React.FC = () => {
  return (
    <div className="App">
      <RangeGrid
        list={list}
      />
    </div>
  );
}

export default App;
