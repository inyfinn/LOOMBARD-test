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
  const snapshot = useRef<Record<string, number>>(rates);
  const ratesRef = useRef(rates);
  const lastComputeTs = useRef<number>(0);
  const [groupedData, setGroupedData] = useState<{ [k: string]: RankingItem[] }>({ gains: [], losses: [] });

  useEffect(()=>{ ratesRef.current = rates; },[rates]);

  useEffect(() => {
    // compute immediately
    compute();
    // schedule daily recompute
    const daily = setInterval(compute, 86400000);
    return () => clearInterval(daily);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const compute = () => {
    const now = Date.now();
    
    // Symulowane dane historyczne 24h temu
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
    
    const items: RankingItem[] = Object.entries(ratesRef.current).map(([code, rate]) => {
      const old = historicalRates24h[code] ?? rate;
      const change = ((rate - old) / old) * 100;
      return { symbol: code, name: code, value: `${change.toFixed(2)}%`, change, category: change >= 0 ? 'gains' : 'losses' };
    });
    let gains = items.filter(i => i.change > 0).sort((a, b) => b.change - a.change).slice(0, 5);
    let losses = items.filter(i => i.change < 0).sort((a, b) => a.change - b.change).slice(0, 5);
    
    // fallback: if no positive/negative changes (first load), pick top/bottom by rate
    if (gains.length === 0) {
      const allItems = Object.entries(ratesRef.current).map(([code, rate]) => ({
        symbol: code, 
        name: code, 
        value: `${rate.toFixed(4)} PLN`, 
        change: 0, 
        category: 'gains' as const
      }));
      gains = allItems.sort((a, b) => parseFloat(b.value) - parseFloat(a.value)).slice(0, 5);
    }
    if (losses.length === 0) {
      const allItems = Object.entries(ratesRef.current).map(([code, rate]) => ({
        symbol: code, 
        name: code, 
        value: `${rate.toFixed(4)} PLN`, 
        change: 0, 
        category: 'losses' as const
      }));
      losses = allItems.sort((a, b) => parseFloat(a.value) - parseFloat(b.value)).slice(0, 5);
    }
    
    setGroupedData({ gains, losses });
    snapshot.current = ratesRef.current;
    lastComputeTs.current = now;
  };

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