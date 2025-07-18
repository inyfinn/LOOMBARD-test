import { useWallet } from "@/context/WalletContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ArrowUpDown, Wallet, PiggyBank } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExchangeDialog } from "@/components/ExchangeDialog";
import { DepositDialog } from "@/components/DepositDialog";
import { WithdrawDialog } from "@/components/WithdrawDialog";

interface PortfolioItem {
  currency: string;
  balance: number;
  rate: number;
}

export function PortfolioSection() {
  const { balances, rates, rates10sAgo, isLiveMode, lastUpdate } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("PortfolioSection mounted", { balances, rates, isLiveMode });
  }, [balances, rates, isLiveMode]);

  const portfolioData: PortfolioItem[] = useMemo(() => {
    try {
      return Object.entries(balances).map(([currency, balance]) => ({
        currency,
        balance,
        rate: rates[currency] || 1,
      }));
    } catch (error) {
      console.error("Error in portfolioData calculation:", error);
      return [];
    }
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

  const calculatePortfolioChange = useMemo(() => {
    try {
      const oldRates = isLiveMode ? historicalRates24h : rates10sAgo;
      
      let totalValueNow = 0;
      let totalValue24hAgo = 0;

      portfolioData.forEach(({ currency, balance, rate }) => {
        const currentValue = balance * rate;
        totalValueNow += currentValue;

        const oldRate = oldRates[currency];
        if (oldRate) {
          const oldValue = balance * oldRate;
          totalValue24hAgo += oldValue;
        } else {
          totalValue24hAgo += currentValue; // fallback
        }
      });

      const changeAmount = totalValueNow - totalValue24hAgo;
      const changePercentage = totalValue24hAgo > 0 ? (changeAmount / totalValue24hAgo) * 100 : 0;

      return {
        changeAmount,
        changePercentage,
        isPositive: changeAmount > 0,
        totalValueNow,
        totalValue24hAgo
      };
    } catch (error) {
      console.error("Error in calculatePortfolioChange:", error);
      return {
        changeAmount: 0,
        changePercentage: 0,
        isPositive: false,
        totalValueNow: 0,
        totalValue24hAgo: 0
      };
    }
  }, [portfolioData, rates, rates10sAgo, isLiveMode, lastUpdate]); // Added lastUpdate dependency

  const totalPln = portfolioData.reduce((sum,item)=> sum + (item.currency==='PLN'? item.balance : item.balance*(item.rate||0)),0);
  const totalUsdValue = totalPln / (rates['USD']||4);

  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Main Balance Display */}
      <Card className="bg-[#02c349] text-white dark:bg-card dark:text-primary border border-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-white dark:text-white">Całkowite saldo</p>
            <div className="flex items-center gap-1">
              {calculatePortfolioChange.isPositive ? (
                <TrendingUp size={16} className="text-green-300" />
              ) : (
                <TrendingDown size={16} className="text-red-300" />
              )}
              <span className={`text-xs ${calculatePortfolioChange.isPositive ? 'text-green-300' : 'text-red-300'}`}>
                {calculatePortfolioChange.isPositive ? '+' : ''}{calculatePortfolioChange.changePercentage.toFixed(2)}%
              </span>
              <span className="text-xs text-white/70 ml-1">
                ({isLiveMode ? '24h' : '10s'})
              </span>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white">
            {formatCurrency(totalPln, 'PLN')}
          </h2>
          <p className="text-sm text-white/80 mt-1">
            ≈ {formatCurrency(totalUsdValue, 'USD')}
          </p>
          {Math.abs(calculatePortfolioChange.changeAmount) > 0.01 && (
            <p className={`text-sm mt-2 ${calculatePortfolioChange.isPositive ? 'text-green-300' : 'text-red-300'}`}>
              {calculatePortfolioChange.isPositive ? '+' : ''}{formatCurrency(calculatePortfolioChange.changeAmount, 'PLN')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Portfel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {portfolioData.map((item) => {
            const oldRates = isLiveMode ? historicalRates24h : rates10sAgo;
            const oldRate = oldRates[item.currency];
            const change = oldRate ? ((item.rate - oldRate) / oldRate) * 100 : 0;
            const isPositive = change > 0;
            
            return (
              <div key={item.currency} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {item.currency}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{item.currency}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(animatedBalances[item.currency] || 0, item.currency)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.rate.toFixed(4)} PLN</p>
                  {Math.abs(change) > 0.001 && (
                    <div className="flex items-center gap-1 justify-end mt-1">
                      {isPositive ? (
                        <TrendingUp size={12} className="text-green-500" />
                      ) : (
                        <TrendingDown size={12} className="text-red-500" />
                      )}
                      <span className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? '+' : ''}{change.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="ghost"
          className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-accent relative group"
          onClick={() => setExchangeOpen(true)}
        >
          <ArrowUpDown className="text-primary h-8 w-8" />
          <span className="text-sm font-medium text-center">Wymień</span>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-gray-600 group-hover:w-3 group-hover:bg-green-500 transition-all duration-200"></div>
        </Button>
        <Button
          variant="ghost"
          className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-accent relative group"
          onClick={() => setDepositOpen(true)}
        >
          <svg className="text-blue-500 h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="text-sm font-medium text-center">Dodaj</span>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-gray-600 group-hover:w-3 group-hover:bg-green-500 transition-all duration-200"></div>
        </Button>
        <Button
          variant="ghost"
          className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-accent relative group"
          onClick={() => setWithdrawOpen(true)}
        >
          <svg className="text-orange-500 h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-sm font-medium text-center">Wypłać</span>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-gray-600 group-hover:w-3 group-hover:bg-green-500 transition-all duration-200"></div>
        </Button>
      </div>

      {/* Dialogs */}
      <ExchangeDialog open={exchangeOpen} onOpenChange={setExchangeOpen} />
      <DepositDialog open={depositOpen} onOpenChange={setDepositOpen} />
      <WithdrawDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} />
    </div>
  );
}