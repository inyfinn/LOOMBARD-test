import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ArrowUpDown, Send, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PortfolioData {
  currency: string;
  balance: number;
  rate?: number;
  change?: number;
  isPrimary?: boolean;
  usdValue?: number;
}

const portfolioData: PortfolioData[] = [
  { currency: "PLN", balance: 15842.75, isPrimary: true },
  { currency: "USD", balance: 2456.80, rate: 4.0234, change: -0.15, usdValue: 2456.80 },
  { currency: "EUR", balance: 1875.20, rate: 4.3456, change: 0.23, usdValue: 2031.47 },
];

export function PortfolioSection() {
  const [animatedBalances, setAnimatedBalances] = useState<Record<string, number>>({});

  useEffect(() => {
    portfolioData.forEach((item, index) => {
      setTimeout(() => {
        setAnimatedBalances(prev => ({
          ...prev,
          [item.currency]: item.balance
        }));
      }, index * 150);
    });
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pl-PL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + ` ${currency}`;
  };

  const totalUsdValue = portfolioData.reduce((total, item) => {
    if (item.currency === 'PLN') return total + (item.balance / 4.0234);
    return total + (item.usdValue || 0);
  }, 0);

  const primaryBalance = portfolioData.find(item => item.isPrimary);

  return (
    <div className="space-y-6">
      {/* Main Balance Display */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm">Całkowite saldo</p>
              <h2 className="text-3xl font-bold">
                {formatCurrency(animatedBalances['PLN'] || 0, 'PLN')}
              </h2>
              <p className="text-white/70 text-sm">
                ≈ ${totalUsdValue.toFixed(2)} USD
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <ArrowUpDown size={16} className="mr-1" />
                Wymień
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Send size={16} className="mr-1" />
                Wyślij
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet size={20} />
            Portfel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {portfolioData.map((item) => (
            <div key={item.currency} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-primary">{item.currency[0]}</span>
                </div>
                <div>
                  <p className="font-medium">{item.currency}</p>
                  {item.rate && (
                    <p className="text-sm text-muted-foreground">
                      1 {item.currency} = {item.rate.toFixed(4)} PLN
                    </p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-medium">
                  {formatCurrency(animatedBalances[item.currency] || 0, item.currency)}
                </p>
                {item.usdValue && (
                  <p className="text-sm text-muted-foreground">
                    ${item.usdValue.toFixed(2)}
                  </p>
                )}
                {item.change && (
                  <Badge variant={item.change > 0 ? "default" : "destructive"} className="mt-1">
                    {item.change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(item.change).toFixed(2)}%
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}