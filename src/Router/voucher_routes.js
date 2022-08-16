import {lazy} from 'react';
const Campaigns = lazy(() => import('../pages/Vourcher/Campaigns/index'))
const GenericCoupon = lazy(() => import('../pages/Vourcher/GenericCoupon/index'))
const GiftcardsPurchase = lazy(() => import('../pages/Vourcher/GiftcardsPurchase/index'))
const VoucherList = lazy(() => import('../pages/Vourcher/VoucherList/index'))

const voucher = [
  {
    path: '/voucher/campaigns',
    component: Campaigns
  },
  {
    path: '/voucher/generics',
    component: GenericCoupon
  },
  {
    path: '/voucher/voucher-list',
    component: VoucherList
  },
  {
    path: '/voucher/giftcard-list',
    component: GiftcardsPurchase
  }
]
export default voucher