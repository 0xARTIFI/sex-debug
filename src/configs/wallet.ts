import { InjectedConnector } from '@wagmi/core';
import { arbitrum, arbitrumGoerli } from '@wagmi/core/chains';
import { publicProvider } from '@wagmi/core/providers/public';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { isProd } from './common';

const chainId = isProd ? [arbitrum] : [arbitrumGoerli];

export const injectedConnector = new InjectedConnector({
  chains: [...chainId],
});

const { provider, webSocketProvider } = configureChains([...chainId], [publicProvider()]);

const client = createClient({
  autoConnect: true,
  connectors: [injectedConnector],
  provider,
  // provider: getDefaultProvider(),
  webSocketProvider,
});

console.log('client', client);
// const client = createClient({
//   provider: Object.assign(getDefaultProvider(), { chains: chainId }),
// });

export { client, WagmiConfig };
