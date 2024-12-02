import React from 'react';
import logo from './logo.svg';
import './App.css';
import { MolstarViewer } from './MolstarView';

function App() {
  return (
    <div className="App">
      <MolstarViewer
        useInterface={true}
        pdbId=''
      />
    </div>
  );
}

export default App;
