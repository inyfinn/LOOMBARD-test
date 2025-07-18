import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useWallet } from "@/context/WalletContext";
import { useNavigate } from "react-router-dom";

interface RateRow {
  code:string;
  rate:number;
  change:number;
  volume:string;
}

export function CurrencyRatesTable() {
  const { rates } = useWallet();
  const prevRates = useRef<Record<string, number>>(rates);
  const [favorites, setFavorites] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(()=>{
    prevRates.current = rates;
  },[rates]);

  const rows:RateRow[] = Object.entries(rates).slice(0,8).map(([code,rate])=>{
    const old = prevRates.current[code] ?? rate;
    const change = ((rate-old)/old)*100;
    return {code,rate,change,volume:`${(Math.random()*5+0.1).toFixed(1)} mld`};
  });

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
          {rows.map((rate) => (
            <div key={rate.code} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(rate.code)}
                  className="p-1 h-8 w-8"
                >
                  <Star 
                    size={16} 
                    className={favorites.includes(rate.code) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"} 
                  />
                </Button>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {rate.code.split('/')[0].slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{rate.code}/PLN</p>
                  <p className="text-sm text-muted-foreground">{rate.code}</p>
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
          <Button variant="outline" className="w-full" onClick={()=>navigate('/kursy')}>
            Zobacz wszystkie kursy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}