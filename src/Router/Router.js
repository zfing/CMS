import React from 'react';
import budget from "./budget_routes";
import internal from "./internal_routes";
import wallet from "./wallet_routes";
import voucher from "./voucher_routes";
import system from "./system_routes";
import credits from "./credits_routes";
import withdrawal from "./withdrawal_routes";

const Dashboard = React.lazy(() => import('../pages/Dashboard/Dashboard'))

const routes = [
    {
        path: "/dashboard",
        component: Dashboard,
        exact: true
    },
    ...budget,
    ...internal,
    ...wallet,
    ...credits,
    ...withdrawal,
    ...voucher,
    ...system
]

export default routes;