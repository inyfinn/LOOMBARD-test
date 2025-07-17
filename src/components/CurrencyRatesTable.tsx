import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Star } from "lucide-react";
import { useState } from "react";

interface CurrencyRate {
  symbol: string;
  name: string;
  rate: number;
  change: number;
  volume: string;
  isFavorite?: boolean;
}

const mockRates: CurrencyRate[] = [
  { symbol: "USD/PLN", name: "Dolar amerykański", rate: 4.0234, change: -0.15, volume: "2.4 mld" },
  { symbol: "EUR/PLN", name: "Euro", rate: 4.3456, change: 0.23, volume: "1.8 mld" },
  { symbol: "GBP/PLN", name: "Funt brytyjski", rate: 5.1234, change: -0.45, volume: "845 mln" },
  { symbol: "CHF/PLN", name: "Frank szwajcarski", rate: 4.4567, change: 0.12, volume: "320 mln" },
  { symbol: "SEK/PLN", name: "Korona szwedzka", rate: 0.3789, change: -0.08, volume: "180 mln" },
  { symbol: "NOK/PLN", name: "Korona norweska", rate: 0.3654, change: 0.34, volume: "150 mln" },
  { symbol: "CZK/PLN", name: "Korona czeska", rate: 0.1789, change: -0.12, volume: "290 mln" },
  { symbol: "JPY/PLN", name: "Jen japoński", rate: 0.0273, change: 0.18, volume: "720 mln" },
];

export function CurrencyRatesTable() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const formatChange = (change: number) => {
    const isPositive = change > 0;
    return (
      <Badge variant={isPositive ? "default" : "destructive"} className="flex items-center gap-1">
        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {isPositive ? '+' : ''}{change.toFixed(2)}%
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kursy walut na żywo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockRates.map((rate) => (
            <div key={rate.symbol} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(rate.symbol)}
                  className="p-1 h-8 w-8"
                >
                  <Star 
                    size={16} 
                    className={favorites.includes(rate.symbol) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"} 
                  />
                </Button>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {rate.symbol.split('/')[0].slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{rate.symbol}</p>
                  <p className="text-sm text-muted-foreground">{rate.name}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-medium">{rate.rate.toFixed(4)}</p>
                <p className="text-sm text-muted-foreground">{rate.volume}</p>
              </div>
              
              <div className="w-20 flex justify-end">
                {formatChange(rate.change)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="outline" className="w-full">
            Zobacz wszystkie kursy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}