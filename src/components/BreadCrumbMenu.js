import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { Breadcrumb } from 'antd';

//面包屑
const budgetBreadcrumbNameMap = {
    '/budget/credit-budgeting': 'Credit Budgeting',
    '/budget/GBA-funding': 'GBA Funding',
    '/budget/credit-allocation': 'Credit Allocation',
    '/budget/revenue-recognition': 'GP/Revenue Recognition',
}
const internalBreadcrumbNameMap = {
    '/internal/cost-centers': 'Cost Centers',
    '/internal/sub-accounts': 'Sub Accounts'
}
const walletBreadcrumbNameMap = {
    '/wallet/user': 'User Wallet List',
    '/wallet/adjustment-records': 'Credit Movements Record',
    '/wallet/organization': 'BOS Wallet List',
    '/wallet/transfer': 'BOS Transfer History',
    '/wallet/affiliate-referrals': 'Affiliate Referrals',
    '/wallet/wallet-liabilities': 'User Liabilities'
}
const voucherBreadcrumbNameMap = {
    '/voucher/campaigns': 'Voucher Campaigns',
    '/voucher/generics': 'Voucher Generics',
    '/voucher/voucher-list': 'Voucher List',
    '/voucher/giftcard-list': 'Giftcards Purchase'
}
const systemBreadcrumbNameMap = {
    '/system/administrators': 'ITALKI Administrator',
    '/system/operation-log': 'FMS Operation Log'
}
const creditBreadcrumbNameMap = {
    '/credit/purchase-list': 'Purchase Records',
    '/credit/expired-list': 'Expired Credits',
    '/credit/payment-config': 'Payment Config',
}
const withdrawalBreadcrumbNameMap = {
    '/withdrawal/teacher-withdrawals': 'Teacher Withdrawals',
    '/withdrawal/affiliate-withdrawals': 'Affiliate Withdrawals',
    '/withdrawal/teacher-withdrawal-config': 'Teacher Withdrawal Configs',
}

const breadcrumbNameMap = {
    '/dashboard': '首页',
    ...budgetBreadcrumbNameMap,
    ...internalBreadcrumbNameMap,
    ...walletBreadcrumbNameMap,
    ...creditBreadcrumbNameMap,
    ...withdrawalBreadcrumbNameMap,
    ...voucherBreadcrumbNameMap,
    ...systemBreadcrumbNameMap
};
const BreadCrumbMenu = withRouter(props => {
    const { location } = props;
    const findMenu = (path) => {
        let result = Object.keys(breadcrumbNameMap).filter(crumb => path.includes(crumb))
        return breadcrumbNameMap[result[0]]
    }
    return (
        <Breadcrumb>
            {[
                <Breadcrumb.Item key="home">
                    <Link to="/dashboard" className="padding-left-10">Home</Link>
                </Breadcrumb.Item>,
                <Breadcrumb.Item key={location.pathname}>
                    {location.pathname.length > 3 
                    ? <Link to={location.pathname} className='BreadcrumbItemColor'>
                        {findMenu(location.pathname)}
                      </Link>
                    : null}
                </Breadcrumb.Item>
            ]}
        </Breadcrumb>
    );
});

export default BreadCrumbMenu;