import React, { useReducer, createContext } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch } from "react-router-dom";
import LoginRouter from './components/LoginRouter';
import AuthRouter from './components/AuthRouter';
import Login from "./components/Login";
import LayoutContent from './components/Layout';
export const FMSContext = createContext({})
function App() {
  const [FMSstate, dispatch] = useReducer((state, { type, data }) => {
    switch (type) {
      case 'SET':
        return data;
      default:
        return state
    }
  }, JSON.parse(localStorage.getItem('fms.user') || "{}"))
  
  return <FMSContext.Provider value={{ FMSstate, dispatch }}>
    <Router className="app" basename="/">
      <Switch>
        <LoginRouter path="/login" component={Login} />
        <AuthRouter path="/" component={LayoutContent} style={{with:'100vw'}} />
      </Switch>
    </Router>
  </FMSContext.Provider>
}
export default App;
