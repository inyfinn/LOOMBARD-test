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
  const { rates, rates10sAgo, isLiveMode } = useWallet();
  const prevRates = useRef<Record<string, number>>(rates);
  const [favorites, setFavorites] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(()=>{
    prevRates.current = rates;
  },[rates]);

  const rows:RateRow[] = Object.entries(rates).slice(0,8).map(([code,rate])=>{
    // W trybie testowym używamy kursów sprzed 10 sekund, w trybie live - sprzed 24h
    const historicalRates24h: Record<string, number> = {
      USD: 3.85, EUR: 4.12, GBP: 4.78, CHF: 4.45, JPY: 0.025, CNY: 0.53,
      AUD: 2.52, CAD: 2.84, NZD: 2.38, SEK: 0.38, NOK: 0.36, DKK: 0.55,
      CZK: 0.17, HUF: 0.011, PLN: 1.0, RUB: 0.042, TRY: 0.13, BRL: 0.78,
      MXN: 0.23, ZAR: 0.21, INR: 0.046, KRW: 0.0029, SGD: 2.86, HKD: 0.49,
      THB: 0.11, MYR: 0.82, IDR: 0.00024, PHP: 0.069, TWD: 0.12, AED: 1.05,
      SAR: 1.03, QAR: 1.06, KWD: 12.5, BHD: 10.2, OMR: 10.0, ARS: 0.0045,
      CLP: 0.0042, COP: 0.00095, PEN: 1.02, UYU: 0.10, VND: 0.00016,
      EGP: 0.12, NGN: 0.0027, KES: 0.027, MAD: 0.38, TND: 1.25, BWP: 0.28,
      GHS: 0.32, UGX: 0.0010, TZS: 0.0015, CDF: 0.0014, XAF: 0.0067,
      XOF: 0.0067, XPF: 0.037, XCD: 1.42, BBD: 1.90, BMD: 3.85, BND: 2.86,
      BIF: 0.0014, DJF: 0.021, ERN: 0.26, ETB: 0.070, FJD: 1.68, GMD: 0.063,
      GNF: 0.00045, HTG: 0.029, IQD: 0.0029, IRR: 0.000092, ISK: 0.028,
      JOD: 5.42, KHR: 0.00094, KMF: 0.0085, LBP: 0.0026, LKR: 0.012,
      LRD: 0.020, LSL: 0.21, LYD: 0.79, MGA: 0.00085, MKD: 0.067, MMK: 0.0018,
      MNT: 0.0011, MOP: 0.48, MRO: 0.010, MUR: 0.084, MVR: 0.25, MWK: 0.0023,
      MZN: 0.060, NAD: 0.21, NPR: 0.029, PAB: 3.85, PGK: 1.08, PKR: 0.014,
      PYG: 0.00052, RWF: 0.0031, SBD: 0.46, SCR: 0.28, SDG: 0.0064, SLL: 0.00019,
      SOS: 0.0067, SRD: 0.12, STD: 0.00018, SVC: 0.45, SYP: 0.0015, SZL: 0.21,
      TOP: 1.62, TTD: 0.57, VUV: 0.032, WST: 1.38, YER: 0.015, ZMW: 0.15, ZWL: 0.012
    };
    
    const oldRate = isLiveMode ? historicalRates24h[code] : rates10sAgo[code];
    const change = oldRate ? ((rate - oldRate) / oldRate) * 100 : 0;
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
        <CardTitle>
          Kursy walut na żywo 
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({isLiveMode ? '24h' : '10s'})
          </span>
        </CardTitle>
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