import {lazy} from 'react';
const UserWallet = lazy(() => import('../pages/Wallet/UserWallets/index'))
const CreditHistory = lazy(() => import('../pages/Wallet/CreditHistory/index'))
const BOSWallets = lazy(() => import('../pages/Wallet/BOSWallets/index'))
const BOSHistory = lazy(() => import('../pages/Wallet/BOSHistory/index'))
const AffiliateReferral = lazy(() => import('../pages/Wallet/AffiliateReferral/index'))
const UserLiabilities = lazy(() => import('../pages/Wallet/UserLiabilities/index'))

const wallet = [
  {
    path: '/wallet/user',
    component: UserWallet
  },
  {
    path: '/wallet/adjustment-records',
    component: CreditHistory
  },
  {
    path: '/wallet/organization',
    component: BOSWallets
  },
  {
    path: '/wallet/transfer',
    component: BOSHistory
  },
  {
    path: '/wallet/affiliate-referrals',
    component: AffiliateReferral
  },
  {
    path: '/wallet/wallet-liabilities',
    component: UserLiabilities
  },

]
export default wallet