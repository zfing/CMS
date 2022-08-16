import {lazy} from 'react';
const Affiliate = lazy(() => import('../pages/Withdrawal/Affiliate/index'))
const Teacher = lazy(() => import('../pages/Withdrawal/Teacher/index'))
const TeacherConfig = lazy(() => import('../pages/Withdrawal/TeacherConfig/index'))

const withdrawal = [
  {
    path: '/withdrawal/teacher-withdrawals',
    component: Teacher
  },
  {
    path: '/withdrawal/affiliate-withdrawals',
    component: Affiliate
  },
  {
    path: '/withdrawal/teacher-withdrawal-config',
    component: TeacherConfig
  }
]
export default withdrawal