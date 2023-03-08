import { arbitrum, arbitrumGoerli } from '@wagmi/chains';
import { publicProvider } from '@wagmi/core/providers/public';
import { configureChains, createClient, WagmiConfig } from 'wagmi';

const { provider, webSocketProvider } = configureChains([arbitrum, arbitrumGoerli], [publicProvider()]);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

export { client, WagmiConfig };
