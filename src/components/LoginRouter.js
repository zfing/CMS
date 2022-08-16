import React from 'react';
// import { withRouter } from 'react-router';
import { Route, Redirect } from 'react-router-dom';
// import Cookies from 'js-cookie';

const LoginRouter = ({ component: Component, ...rest}) => {
    // const isLogined = Cookies.get('isLogin') === '1' ? true : false;
    const isLogined = localStorage.getItem('oms.token') ? true : false;
	return <Route {...rest} render={props => (!!!isLogined ? <Component {...props} /> : <Redirect to={'/dashboard'} />)} />;
};

export default LoginRouter;