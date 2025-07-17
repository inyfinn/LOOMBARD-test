import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CurrencyCardProps {
  currency: string;
  balance: number;
  rate?: number;
  change?: number;
  isPrimary?: boolean;
}

export function CurrencyCard({ currency, balance, rate, change, isPrimary }: CurrencyCardProps) {
  const [displayBalance, setDisplayBalance] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayBalance(balance);
    }, 100);
    return () => clearTimeout(timer);
  }, [balance]);

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className={`${isPrimary ? 'bg-primary text-primary-foreground' : ''} transition-all duration-300`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className={`text-sm ${isPrimary ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              Saldo {currency}
            </p>
            <p className="text-2xl font-bold transition-all duration-300 ease-out">
              {formatBalance(displayBalance)} {currency}
            </p>
          </div>
          {change && (
            <Badge variant={isPositive ? "default" : "destructive"} className="flex items-center gap-1">
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(change).toFixed(2)}%
            </Badge>
          )}
        </div>
        {rate && (
          <p className={`text-sm ${isPrimary ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
            1 {currency} = {rate.toFixed(4)} PLN
          </p>
        )}
      </CardContent>
    </Card>
  );
}