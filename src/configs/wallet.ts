import { InjectedConnector } from '@wagmi/core';
import { arbitrum, arbitrumGoerli } from '@wagmi/core/chains';
import { publicProvider } from '@wagmi/core/providers/public';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { isProd } from './common';

const chainId = isProd ? [arbitrum] : [arbitrumGoerli];

const injectedConnector = new InjectedConnector({
  chains: [...chainId],
});

const { provider, webSocketProvider } = configureChains([...chainId], [publicProvider()]);

const client = createClient({
  autoConnect: true,
  connectors: [injectedConnector],
  provider,
  webSocketProvider,
});

export { client, WagmiConfig };
