import { renderHook } from '@/tests/test-utils'
import { useCompatibleNetworks } from '../useCompatibleNetworks'
import { type ReplayedSafeProps } from '@/store/slices'
import { faker } from '@faker-js/faker'
import { Safe__factory } from '@/types/contracts'
import { EMPTY_DATA, ZERO_ADDRESS } from '@safe-global/protocol-kit/dist/src/utils/constants'
import { ECOSYSTEM_ID_ADDRESS } from '@/config/constants'
import { chainBuilder } from '@/tests/builders/chains'
import {
  getSafeSingletonDeployments,
  getSafeL2SingletonDeployments,
  getProxyFactoryDeployments,
} from '@safe-global/safe-deployments'
import * as useChains from '@/hooks/useChains'

const safeInterface = Safe__factory.createInterface()

const L1_111_MASTERCOPY_DEPLOYMENTS = getSafeSingletonDeployments({ version: '1.1.1' })?.deployments
const L1_130_MASTERCOPY_DEPLOYMENTS = getSafeSingletonDeployments({ version: '1.3.0' })?.deployments
const L1_141_MASTERCOPY_DEPLOYMENTS = getSafeSingletonDeployments({ version: '1.4.1' })?.deployments

const L2_130_MASTERCOPY_DEPLOYMENTS = getSafeL2SingletonDeployments({ version: '1.3.0' })?.deployments
const L2_141_MASTERCOPY_DEPLOYMENTS = getSafeL2SingletonDeployments({ version: '1.4.1' })?.deployments

const PROXY_FACTORY_111_DEPLOYMENTS = getProxyFactoryDeployments({ version: '1.1.1' })?.deployments
const PROXY_FACTORY_130_DEPLOYMENTS = getProxyFactoryDeployments({ version: '1.3.0' })?.deployments
const PROXY_FACTORY_141_DEPLOYMENTS = getProxyFactoryDeployments({ version: '1.4.1' })?.deployments

describe('useReplayableNetworks', () => {
  beforeAll(() => {
    jest.spyOn(useChains, 'default').mockReturnValue({
      configs: [
        chainBuilder().with({ chainId: '1' }).build(),
        chainBuilder().with({ chainId: '10' }).build(), // This has the eip155 and then the canonical addresses
        chainBuilder().with({ chainId: '100' }).build(), // This has the canonical and then the eip155 addresses
        chainBuilder().with({ chainId: '324' }).build(), // ZkSync has different addresses for all versions
        chainBuilder().with({ chainId: '480' }).build(), // Worldchain has 1.4.1 but not 1.1.1
      ],
    })
  })

  it('should return empty list without any creation data', () => {
    const { result } = renderHook(() => useCompatibleNetworks(undefined))
    expect(result.current).toHaveLength(0)
  })

  it('should return empty list for incomplete creation data', () => {
    const callData = {
      owners: [faker.finance.ethereumAddress()],
      threshold: 1,
      to: ZERO_ADDRESS,
      data: EMPTY_DATA,
      fallbackHandler: faker.finance.ethereumAddress(),
      paymentToken: ZERO_ADDRESS,
      payment: 0,
      paymentReceiver: ECOSYSTEM_ID_ADDRESS,
    }

    const setupData = safeInterface.encodeFunctionData('setup', [
      callData.owners,
      callData.threshold,
      callData.to,
      callData.data,
      callData.fallbackHandler,
      callData.paymentToken,
      callData.payment,
      callData.paymentReceiver,
    ])

    const creationData: ReplayedSafeProps = {
      factoryAddress: faker.finance.ethereumAddress(),
      masterCopy: null,
      saltNonce: '0',
      setupData,
    }
    const { result } = renderHook(() => useCompatibleNetworks(creationData))
    expect(result.current).toHaveLength(0)
  })

  it('should return empty list for unknown masterCopies', () => {
    const callData = {
      owners: [faker.finance.ethereumAddress()],
      threshold: 1,
      to: ZERO_ADDRESS,
      data: EMPTY_DATA,
      fallbackHandler: faker.finance.ethereumAddress(),
      paymentToken: ZERO_ADDRESS,
      payment: 0,
      paymentReceiver: ECOSYSTEM_ID_ADDRESS,
    }

    const setupData = safeInterface.encodeFunctionData('setup', [
      callData.owners,
      callData.threshold,
      callData.to,
      callData.data,
      callData.fallbackHandler,
      callData.paymentToken,
      callData.payment,
      callData.paymentReceiver,
    ])

    const creationData: ReplayedSafeProps = {
      factoryAddress: faker.finance.ethereumAddress(),
      masterCopy: faker.finance.ethereumAddress(),
      saltNonce: '0',
      setupData,
    }
    const { result } = renderHook(() => useCompatibleNetworks(creationData))
    expect(result.current).toHaveLength(0)
  })

  it('should return empty list for unknown masterCopies', () => {
    const callData = {
      owners: [faker.finance.ethereumAddress()],
      threshold: 1,
      to: ZERO_ADDRESS,
      data: EMPTY_DATA,
      fallbackHandler: faker.finance.ethereumAddress(),
      paymentToken: ZERO_ADDRESS,
      payment: 0,
      paymentReceiver: ECOSYSTEM_ID_ADDRESS,
    }

    const setupData = safeInterface.encodeFunctionData('setup', [
      callData.owners,
      callData.threshold,
      callData.to,
      callData.data,
      callData.fallbackHandler,
      callData.paymentToken,
      callData.payment,
      callData.paymentReceiver,
    ])

    const creationData: ReplayedSafeProps = {
      factoryAddress: faker.finance.ethereumAddress(),
      masterCopy: faker.finance.ethereumAddress(),
      saltNonce: '0',
      setupData,
    }
    const { result } = renderHook(() => useCompatibleNetworks(creationData))
    expect(result.current).toHaveLength(0)
  })

  it('should return everything but zkSync for 1.4.1 Safes', () => {
    const callData = {
      owners: [faker.finance.ethereumAddress()],
      threshold: 1,
      to: ZERO_ADDRESS,
      data: EMPTY_DATA,
      fallbackHandler: faker.finance.ethereumAddress(),
      paymentToken: ZERO_ADDRESS,
      payment: 0,
      paymentReceiver: ECOSYSTEM_ID_ADDRESS,
    }
    const setupData = safeInterface.encodeFunctionData('setup', [
      callData.owners,
      callData.threshold,
      callData.to,
      callData.data,
      callData.fallbackHandler,
      callData.paymentToken,
      callData.payment,
      callData.paymentReceiver,
    ])
    {
      const creationData: ReplayedSafeProps = {
        factoryAddress: PROXY_FACTORY_141_DEPLOYMENTS?.canonical?.address!,
        masterCopy: L1_141_MASTERCOPY_DEPLOYMENTS?.canonical?.address!,
        saltNonce: '0',
        setupData,
      }
      const { result } = renderHook(() => useCompatibleNetworks(creationData))
      expect(result.current).toHaveLength(4)
      expect(result.current.map((chain) => chain.chainId)).toEqual(['1', '10', '100', '480'])
    }

    {
      const creationData: ReplayedSafeProps = {
        factoryAddress: PROXY_FACTORY_141_DEPLOYMENTS?.canonical?.address!,
        masterCopy: L2_141_MASTERCOPY_DEPLOYMENTS?.canonical?.address!,
        saltNonce: '0',
        setupData,
      }
      const { result } = renderHook(() => useCompatibleNetworks(creationData))
      expect(result.current).toHaveLength(4)
      expect(result.current.map((chain) => chain.chainId)).toEqual(['1', '10', '100', '480'])
    }
  })

  it('should return correct chains for 1.3.0 Safes', () => {
    const callData = {
      owners: [faker.finance.ethereumAddress()],
      threshold: 1,
      to: ZERO_ADDRESS,
      data: EMPTY_DATA,
      fallbackHandler: faker.finance.ethereumAddress(),
      paymentToken: ZERO_ADDRESS,
      payment: 0,
      paymentReceiver: ECOSYSTEM_ID_ADDRESS,
    }

    const setupData = safeInterface.encodeFunctionData('setup', [
      callData.owners,
      callData.threshold,
      callData.to,
      callData.data,
      callData.fallbackHandler,
      callData.paymentToken,
      callData.payment,
      callData.paymentReceiver,
    ])

    // 1.3.0, L1 and canonical
    {
      const creationData: ReplayedSafeProps = {
        factoryAddress: PROXY_FACTORY_130_DEPLOYMENTS?.canonical?.address!,
        masterCopy: L1_130_MASTERCOPY_DEPLOYMENTS?.canonical?.address!,
        saltNonce: '0',
        setupData,
      }
      const { result } = renderHook(() => useCompatibleNetworks(creationData))
      expect(result.current).toHaveLength(4)
      expect(result.current.map((chain) => chain.chainId)).toEqual(['1', '10', '100', '480'])
    }

    // 1.3.0, L2 and canonical
    {
      const creationData: ReplayedSafeProps = {
        factoryAddress: PROXY_FACTORY_130_DEPLOYMENTS?.canonical?.address!,
        masterCopy: L2_130_MASTERCOPY_DEPLOYMENTS?.canonical?.address!,
        saltNonce: '0',
        setupData,
      }
      const { result } = renderHook(() => useCompatibleNetworks(creationData))
      expect(result.current).toHaveLength(4)
      expect(result.current.map((chain) => chain.chainId)).toEqual(['1', '10', '100', '480'])
    }

    // 1.3.0, L1 and EIP155 is not available on Worldchain
    {
      const creationData: ReplayedSafeProps = {
        factoryAddress: PROXY_FACTORY_130_DEPLOYMENTS?.eip155?.address!,
        masterCopy: L1_130_MASTERCOPY_DEPLOYMENTS?.eip155?.address!,
        saltNonce: '0',
        setupData,
      }
      const { result } = renderHook(() => useCompatibleNetworks(creationData))
      expect(result.current).toHaveLength(3)
      expect(result.current.map((chain) => chain.chainId)).toEqual(['1', '10', '100'])
    }

    // 1.3.0, L2 and EIP155
    {
      const creationData: ReplayedSafeProps = {
        factoryAddress: PROXY_FACTORY_130_DEPLOYMENTS?.eip155?.address!,
        masterCopy: L2_130_MASTERCOPY_DEPLOYMENTS?.eip155?.address!,
        saltNonce: '0',
        setupData,
      }
      const { result } = renderHook(() => useCompatibleNetworks(creationData))
      expect(result.current).toHaveLength(3)
      expect(result.current.map((chain) => chain.chainId)).toEqual(['1', '10', '100'])
    }
  })

  it('should return empty list for 1.1.1 Safes', () => {
    const callData = {
      owners: [faker.finance.ethereumAddress()],
      threshold: 1,
      to: ZERO_ADDRESS,
      data: EMPTY_DATA,
      fallbackHandler: faker.finance.ethereumAddress(),
      paymentToken: ZERO_ADDRESS,
      payment: 0,
      paymentReceiver: ECOSYSTEM_ID_ADDRESS,
    }

    const setupData = safeInterface.encodeFunctionData('setup', [
      callData.owners,
      callData.threshold,
      callData.to,
      callData.data,
      callData.fallbackHandler,
      callData.paymentToken,
      callData.payment,
      callData.paymentReceiver,
    ])

    const creationData: ReplayedSafeProps = {
      factoryAddress: PROXY_FACTORY_111_DEPLOYMENTS?.canonical?.address!,
      masterCopy: L1_111_MASTERCOPY_DEPLOYMENTS?.canonical?.address!,
      saltNonce: '0',
      setupData,
    }
    const { result } = renderHook(() => useCompatibleNetworks(creationData))
    expect(result.current).toHaveLength(0)
  })
})