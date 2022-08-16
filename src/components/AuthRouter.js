import React from 'react';
import { withRouter } from 'react-router';
import { Route, Redirect } from 'react-router-dom';
// import Cookies from 'js-cookie';
const AuthRouter = ({ component: Component, ...rest}) => {
	let isLogin = true;
    // const isLogin = Cookies.get('isLogin') === '1' ? true : false;

	// 登录过期验证
  // let isLogin = false;
	// if (new Date().getTime() > localStorage.getItem('fms.expiry-date')) {
	// 	window.alert('Your token is invalid, please login again')
	// 	localStorage.clear();
	// 	isLogin = false
	// } else {
	// 	if (localStorage.getItem('fms.token')) {
	// 		isLogin = true
	// 	}
	// }
	return <Route {...rest} render={props => (isLogin ? <Component {...props} /> : <Redirect to={'/login'} />)} />;
};

export default withRouter(AuthRouter);