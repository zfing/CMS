import React from 'react';
const CostCenter = React.lazy(() => import('../pages/InternalAccounts/CostCenters/index'))
const SubAccount = React.lazy(() => import('../pages/InternalAccounts/SubAccounts/index'))

const internal = [
  {
    path: '/internal/cost-centers',
    component: CostCenter
  },
  {
    path: '/internal/sub-accounts',
    component: SubAccount
  }
]
export default internal