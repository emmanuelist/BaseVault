import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { base } from 'wagmi/chains';

interface NFT {
  id: string;
  name: string;
  collection: string;
  image: string;
  value: string;
}

export function useNFTs() {
  const { address, isConnected } = useAccount();

  const { data: nfts, isLoading } = useQuery({
    queryKey: ['nfts', address, base.id],
    queryFn: async () => {
      if (!address) return [];
      
      // Using Alchemy API for Base network NFTs
      // You'll need to add VITE_ALCHEMY_API_KEY to .env
      const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
      
      if (!alchemyKey) {
        console.warn('Alchemy API key not found. Using mock NFT data.');
        return [];
      }

      try {
        const response = await fetch(
          `https://base-mainnet.g.alchemy.com/nft/v3/${alchemyKey}/getNFTsForOwner?owner=${address}&withMetadata=true`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          }
        );

        if (!response.ok) {
          console.error('Failed to fetch NFTs');
          return [];
        }

        const data = await response.json();
        
        return data.ownedNfts?.map((nft: any) => ({
          id: `${nft.contract.address}-${nft.tokenId}`,
          name: nft.name || nft.title || `#${nft.tokenId}`,
          collection: nft.contract.name || 'Unknown Collection',
          image: nft.image?.cachedUrl || nft.image?.originalUrl || nft.image?.thumbnailUrl || 'https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=400&h=400&fit=crop',
          value: '0.1 ETH', // Mock value - would need floor price API
        })) || [];
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        return [];
      }
    },
    enabled: !!address && isConnected,
  });

  return {
    nfts: nfts || [],
    isLoading,
    isConnected,
  };
}
