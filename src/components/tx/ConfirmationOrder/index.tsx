import StakingOrderConfirmationView from '@/features/stake/components/StakingOrderConfirmationView'
import SwapOrderConfirmationView from '@/features/swap/components/SwapOrderConfirmationView'
import type useDecodeTx from '@/hooks/useDecodeTx'
import { isAnySwapConfirmationViewOrder, isStakingConfirmationOrder } from '@/utils/transaction-guards'

type OrderConfirmationViewProps = {
  decodedData: ReturnType<typeof useDecodeTx>[0]
  toAddress: string
  value?: string
}

const ConfirmationOrder = ({ decodedData, value, toAddress }: OrderConfirmationViewProps) => {
  if (isAnySwapConfirmationViewOrder(decodedData)) {
    return <SwapOrderConfirmationView order={decodedData} settlementContract={toAddress} />
  }

  if (isStakingConfirmationOrder(decodedData)) {
    return <StakingOrderConfirmationView order={decodedData} contractAddress={toAddress} value={value} />
  }

  return null
}

export default ConfirmationOrder