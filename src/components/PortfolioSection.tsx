import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Wallet, ArrowRight, PiggyBank, Wallet as WalletIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ExchangeDialog } from "@/components/ExchangeDialog";
import { DepositDialog } from "@/components/DepositDialog";
import { WithdrawDialog } from "@/components/WithdrawDialog";
import { useWallet } from "@/context/WalletContext";

interface PortfolioItem {
  currency: string;
  balance: number;
  rate?: number;
}

export function PortfolioSection() {
  const { balances, rates } = useWallet();
  const navigate = useNavigate();

  const portfolioData: PortfolioItem[] = useMemo(() => {
    return Object.entries(balances).map(([currency, balance]) => ({
      currency,
      balance,
      rate: rates[currency],
    }));
  }, [balances, rates]);

  const [animatedBalances, setAnimatedBalances] = useState<Record<string, number>>({});

  // animate on balances change
  useEffect(() => {
    portfolioData.forEach((item, index) => {
      setTimeout(() => {
        setAnimatedBalances(prev => ({ ...prev, [item.currency]: item.balance }));
      }, index * 80);
    });
  }, [portfolioData]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pl-PL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + ` ${currency}`;
  };

  const totalPln = portfolioData.reduce((sum,item)=> sum + (item.currency==='PLN'? item.balance : item.balance*(item.rate||0)),0);
  const totalUsdValue = totalPln / (rates['USD']||4);

  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Main Balance Display */}
      <Card className="bg-primary text-white dark:bg-card dark:text-primary border border-primary">
        <CardContent className="p-6">
          <p className="text-sm mb-1 text-white dark:text-white">Całkowite saldo</p>
          <h2 className="text-4xl font-bold text-white">
                {formatCurrency(totalPln, 'PLN')}
              </h2>
          <p className="text-white/80 dark:text-primary/80 text-sm mb-5">≈ ${totalUsdValue.toFixed(2)} USD</p>

          <div className="flex gap-3 mt-5">
            <Button
              className="bg-white text-primary hover:bg-primary/10 dark:bg-primary dark:hover:bg-primary/90 dark:text-white border border-white dark:border-transparent"
              onClick={() => setExchangeOpen(true)}
            >
                <ArrowUpDown size={16} className="mr-1" />
                Wymień
              </Button>
            <Button className="bg-white text-primary hover:bg-primary/10 dark:bg-transparent dark:border dark:border-primary dark:text-primary" onClick={()=> setWithdrawOpen(true)}>
              <PiggyBank size={16} className="mr-1" />
              Wypłać
              </Button>

             <Button className="bg-white text-primary hover:bg-primary/10 dark:bg-transparent dark:border dark:border-primary dark:text-primary" onClick={()=> setDepositOpen(true)}>
                <WalletIn size={16} className="mr-1" />
                Wpłać
              </Button>
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
          {portfolioData.slice(0,5).map((item) => (
            <div key={item.currency} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-primary">{item.currency[0]}</span>
                </div>
                <div>
                  <p className="font-medium">{item.currency}</p>
                  {item.rate && item.currency !== 'PLN' && (
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
                {item.currency !== 'USD' && (
                  <p className="text-sm text-muted-foreground">
                    ≈ ${(item.currency === 'PLN' ? item.balance / (rates['USD'] || 4) : item.balance * (item.rate || 0) / (rates['USD'] || 4)).toFixed(2)} USD
                  </p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Show more button if more than 5 */}
      {portfolioData.length > 5 && (
        <div className="flex justify-end pr-2">
          <Button variant="ghost" onClick={() => navigate('/portfel')} className="rounded-full bg-green-600 hover:bg-green-700 text-white p-3 shadow-md">
            <ArrowRight size={20} />
          </Button>
        </div>
      )}

      <ExchangeDialog open={exchangeOpen} onOpenChange={setExchangeOpen} />
      <DepositDialog open={depositOpen} onOpenChange={setDepositOpen} />
      <WithdrawDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} />
    </div>
  );
}