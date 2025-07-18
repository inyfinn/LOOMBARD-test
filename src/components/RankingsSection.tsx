import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useRef, useEffect, useState } from "react";

interface RankingItem {
  symbol: string;
  name: string;
  value: string;
  change: number;
  category: 'gains' | 'losses' | 'searched' | 'traded';
}

const categoryConfig = {
  gains: { title: "Największe zyski", icon: TrendingUp, color: "text-green-500" },
  losses: { title: "Największe straty", icon: TrendingDown, color: "text-red-500" },
};

export function RankingsSection(){
  const { rates } = useWallet();
  const snapshot = useRef<Record<string, number>>(rates); // baseline rates
  const lastBaselineTs = useRef<number>(Date.now());
  const [groupedData, setGroupedData] = useState<{ [k: string]: RankingItem[] }>({ gains: [], losses: [] });

  useEffect(() => {
    const now = Date.now();
    // refresh baseline co 24h
    if (now - lastBaselineTs.current > 86400000) {
      snapshot.current = rates;
      lastBaselineTs.current = now;
    }

    const items: RankingItem[] = Object.entries(rates).map(([code, rate]) => {
      const old = snapshot.current[code] ?? rate;
      const change = ((rate - old) / old) * 100;
      return {
        symbol: code,
        name: code,
        value: `${change.toFixed(2)}%`,
        change,
        category: change >= 0 ? "gains" : "losses",
      };
    });

    const gains = items
      .filter((i) => i.change > 0)
      .sort((a, b) => b.change - a.change)
      .slice(0, 5);
    const losses = items
      .filter((i) => i.change < 0)
      .sort((a, b) => a.change - b.change)
      .slice(0, 5);
    setGroupedData({ gains, losses });
  }, [rates]);

  const renderRankingCard = (category: keyof typeof categoryConfig, items: RankingItem[]) => {
    const config = categoryConfig[category];
    const Icon = config.icon;

    return (
      <Card key={category} className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon size={18} className={config.color} />
            {config.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.map((item, index) => (
            <div key={item.symbol} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{item.symbol}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{item.symbol}</p>
                  <p className="text-xs text-muted-foreground">{item.name}</p>
                </div>
              </div>
              
              <div className="text-right">
                {category === 'gains' || category === 'losses' ? (
                  <Badge variant={item.change > 0 ? "default" : "destructive"} className="text-xs">
                    {item.change > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {item.value}
                  </Badge>
                ) : (
                  <p className="text-xs font-medium">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Rankingi 24h</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {Object.entries(groupedData).map(([category, items]) =>
          renderRankingCard(category as keyof typeof categoryConfig, items)
        )}
      </div>
    </div>
  );
}