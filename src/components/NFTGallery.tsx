import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye } from "lucide-react";
import { useState } from "react";
import { useNFTs } from "@/hooks/useNFTs";
import { NFTSkeleton } from "./skeletons/NFTSkeleton";

export function NFTGallery() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { nfts, isLoading, isConnected } = useNFTs();
  
  if (!isConnected) {
    return null;
  }
  
  if (isLoading) {
    return <NFTSkeleton />;
  }
  
  if (nfts.length === 0) {
    return (
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">NFT Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No NFTs found in your wallet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">NFT Collection</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {nfts.length} NFTs
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              className="group relative overflow-hidden rounded-lg border border-border/50 hover-lift cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredId(nft.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="aspect-square relative">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content on hover */}
                <div className="absolute inset-0 p-4 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="space-y-2">
                    <p className="text-white font-semibold text-sm">
                      {nft.name}
                    </p>
                    <p className="text-white/80 text-xs">{nft.collection}</p>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Badge className="bg-primary/90 text-primary-foreground text-xs backdrop-blur-sm">
                        {nft.value}
                      </Badge>
                      
                      {hoveredId === nft.id && (
                        <div className="flex gap-1 animate-fade-in">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Open in marketplace
                            }}
                          >
                            <Eye className="h-3 w-3 text-white" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Open external link
                            }}
                          >
                            <ExternalLink className="h-3 w-3 text-white" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
