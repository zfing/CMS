import {lazy} from 'react';
const Administrator = lazy(() => import('../pages/FMSSystem/Administrator/index'))
const OperationLog = lazy(() => import('../pages/FMSSystem/OperationLog/index'))

const system = [
  {
    path: '/system/administrators',
    component: Administrator
  },
  {
    path: '/system/operation-log',
    component: OperationLog
  }
]
export default system