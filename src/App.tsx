import React from 'react';
import Home from './views/home';
import Routes from './routes';

const ThemeContext = React.createContext('light');

function App() {
  return (
    <div className="App">
      {/* <Home></Home> */}
      {/* <ThemeContext.Provider value="dark"> */}
      <Routes childProps={{}}></Routes>
      {/* </ThemeContext.Provider> */}
    </div>
  );
}

export default App;
