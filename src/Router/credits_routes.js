import {lazy} from 'react';
const ExpiredCredits = lazy(() => import('../pages/CreditsPurchase/ExpiredCredits/index'))
const PaymentConfig = lazy(() => import('../pages/CreditsPurchase/PaymentConfig/index'))
const PurchaseRecords = lazy(() => import('../pages/CreditsPurchase/PurchaseRecords/index'))

const credits = [
  {
    path: '/credit/purchase-list',
    component: PurchaseRecords
  },
  {
    path: '/credit/expired-list',
    component: ExpiredCredits
  },
  {
    path: '/credit/payment-config',
    component: PaymentConfig
  }
]
export default credits