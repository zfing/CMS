import {lazy} from 'react';
const CreditBudgeting = lazy(() => import('../pages/Budget/CreditBudgeting/index'))
const GBAFunding = lazy(() => import('../pages/Budget/GBAFunding/index'))
const CreditAllocation = lazy(() => import('../pages/Budget/CreditAllocation/index'))
const RevenueRecognition = lazy(() => import('../pages/Budget/RevenueRecognition/index'))

const budget = [
  {
    path: '/budget/credit-budgeting',
    component: CreditBudgeting
  },
  {
    path: '/budget/GBA-funding',
    component: GBAFunding
  },
  {
    path: '/budget/credit-allocation',
    component: CreditAllocation
  },
  {
    path: '/budget/revenue-recognition',
    component: RevenueRecognition
  },

]
export default budget