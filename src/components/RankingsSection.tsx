import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Search, ArrowUpDown } from "lucide-react";

interface RankingItem {
  symbol: string;
  name: string;
  value: string;
  change: number;
  category: 'gains' | 'losses' | 'searched' | 'traded';
}

const rankingData: RankingItem[] = [
  { symbol: "TRY", name: "Lira turecka", value: "+15.23%", change: 15.23, category: 'gains' },
  { symbol: "ARS", name: "Peso argentyńskie", value: "+12.45%", change: 12.45, category: 'gains' },
  { symbol: "RUB", name: "Rubel rosyjski", value: "-8.76%", change: -8.76, category: 'losses' },
  { symbol: "GBP", name: "Funt brytyjski", value: "-5.43%", change: -5.43, category: 'losses' },
  { symbol: "USD", name: "Dolar amerykański", value: "Wyszukiwania: 48k", change: 0, category: 'searched' },
  { symbol: "EUR", name: "Euro", value: "Wyszukiwania: 35k", change: 0, category: 'searched' },
  { symbol: "CHF", name: "Frank szwajcarski", value: "Wolumen: 85k", change: 0, category: 'traded' },
  { symbol: "JPY", name: "Jen japoński", value: "Wolumen: 62k", change: 0, category: 'traded' },
];

const categoryConfig = {
  gains: { title: "Największe zyski", icon: TrendingUp, color: "text-green-500" },
  losses: { title: "Największe straty", icon: TrendingDown, color: "text-red-500" },
  searched: { title: "Najczęściej wyszukiwane", icon: Search, color: "text-blue-500" },
  traded: { title: "Najwyższy wolumen", icon: ArrowUpDown, color: "text-purple-500" },
};

export function RankingsSection() {
  const groupedData = rankingData.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, RankingItem[]>);

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
          {items.slice(0, 2).map((item, index) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(groupedData).map(([category, items]) =>
          renderRankingCard(category as keyof typeof categoryConfig, items)
        )}
      </div>
    </div>
  );
}