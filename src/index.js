import React, {Suspense, lazy} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Skeleton } from 'antd'
import reportWebVitals from './reportWebVitals';
const App = lazy(() => import('./App'))

ReactDOM.render(
  <Suspense fallback={<Skeleton active />}>
    <App />
  </Suspense>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
