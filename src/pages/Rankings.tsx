import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Search, Activity, Eye } from "lucide-react";

interface RankingItem {
  code: string;
  name: string;
  value: number;
  change: number;
  rank: number;
}

export default function Rankings() {
  // Mock data for 24h rankings
  const topGainers: RankingItem[] = [
    { code: "NOK", name: "Korona norweska", value: 0.3789, change: 2.34, rank: 1 },
    { code: "SEK", name: "Korona szwedzka", value: 0.3654, change: 1.89, rank: 2 },
    { code: "DKK", name: "Korona duńska", value: 0.5834, change: 1.67, rank: 3 },
    { code: "CHF", name: "Frank szwajcarski", value: 4.4567, change: 1.23, rank: 4 },
    { code: "EUR", name: "Euro", value: 4.3456, change: 0.89, rank: 5 },
  ];

  const topLosers: RankingItem[] = [
    { code: "TRY", name: "Lira turecka", value: 0.1445, change: -3.45, rank: 1 },
    { code: "ARS", name: "Peso argentyńskie", value: 0.0112, change: -2.78, rank: 2 },
    { code: "BRL", name: "Real brazylijski", value: 0.8234, change: -1.98, rank: 3 },
    { code: "RUB", name: "Rubel rosyjski", value: 0.0434, change: -1.56, rank: 4 },
    { code: "JPY", name: "Jen japoński", value: 0.0271, change: -1.12, rank: 5 },
  ];

  const mostSearched: RankingItem[] = [
    { code: "USD", name: "Dolar amerykański", value: 4.0234, change: -0.15, rank: 1 },
    { code: "EUR", name: "Euro", value: 4.3456, change: 0.23, rank: 2 },
    { code: "GBP", name: "Funt brytyjski", value: 5.1234, change: -0.08, rank: 3 },
    { code: "CHF", name: "Frank szwajcarski", value: 4.4567, change: 0.12, rank: 4 },
    { code: "CZK", name: "Korona czeska", value: 0.1756, change: 0.05, rank: 5 },
  ];

  const mostTraded: RankingItem[] = [
    { code: "USD", name: "Dolar amerykański", value: 4.0234, change: -0.15, rank: 1 },
    { code: "EUR", name: "Euro", value: 4.3456, change: 0.23, rank: 2 },
    { code: "GBP", name: "Funt brytyjski", value: 5.1234, change: -0.08, rank: 3 },
    { code: "JPY", name: "Jen japoński", value: 0.0271, change: -0.34, rank: 4 },
    { code: "CHF", name: "Frank szwajcarski", value: 4.4567, change: 0.12, rank: 5 },
  ];

  const RankingCard = ({ 
    title, 
    items, 
    icon: Icon, 
    type 
  }: { 
    title: string; 
    items: RankingItem[]; 
    icon: React.ElementType;
    type: 'gain' | 'loss' | 'search' | 'trade';
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => {
          const isPositive = item.change > 0;
          const badgeColor = type === 'gain' ? 'default' : 
                           type === 'loss' ? 'destructive' : 
                           'secondary';
          
          return (
            <div key={item.code} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">#{item.rank}</span>
                </div>
                <div>
                  <p className="font-medium">{item.code}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-[120px]">
                    {item.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">{item.value.toFixed(4)} PLN</p>
                {(type === 'gain' || type === 'loss') && (
                  <Badge variant={badgeColor} className="flex items-center gap-1 w-fit ml-auto">
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(item.change).toFixed(2)}%
                  </Badge>
                )}
                {type === 'search' && (
                  <Badge variant="secondary" className="flex items-center gap-1 w-fit ml-auto">
                    <Eye className="h-3 w-3" />
                    Popularne
                  </Badge>
                )}
                {type === 'trade' && (
                  <Badge variant="secondary" className="flex items-center gap-1 w-fit ml-auto">
                    <Activity className="h-3 w-3" />
                    Aktywne
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20 pt-4">
      <div className="container max-w-md mx-auto px-4 space-y-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">Rankingi</h1>
          <p className="text-muted-foreground">Waluty w ostatnich 24h</p>
        </div>

        {/* Rankings */}
        <div className="space-y-4">
          <RankingCard
            title="Największe wzrosty"
            items={topGainers}
            icon={TrendingUp}
            type="gain"
          />
          
          <RankingCard
            title="Największe spadki"
            items={topLosers}
            icon={TrendingDown}
            type="loss"
          />
          
          <RankingCard
            title="Najczęściej wyszukiwane"
            items={mostSearched}
            icon={Search}
            type="search"
          />
          
          <RankingCard
            title="Najczęściej wymieniane"
            items={mostTraded}
            icon={Activity}
            type="trade"
          />
        </div>

        {/* Info */}
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Dane z ostatnich 24 godzin
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Aktualizacja co godzinę
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}