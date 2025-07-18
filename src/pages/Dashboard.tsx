import { PortfolioSection } from "@/components/PortfolioSection";
import { PromoBanner } from "@/components/PromoBanner";
import { CurrencyRatesTable } from "@/components/CurrencyRatesTable";
import { RankingsSection } from "@/components/RankingsSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/context/WalletContext";
import { ArrowUp, ArrowDown, ArrowLeftRight } from "lucide-react";
import { useEffect } from "react";

export default function Dashboard() {
  const { transactions } = useWallet();
  
  useEffect(() => {
    console.log("Dashboard component mounted");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-7xl mx-auto px-4 py-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Portfolio */}
          <div className="lg:col-span-1 space-y-6">
            <PortfolioSection />
          </div>

          {/* Middle Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Promo Banner */}
            <PromoBanner />
            
            {/* Currency Rates */}
            <CurrencyRatesTable />
            
            {/* Rankings */}
            <RankingsSection />
            
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Ostatnia aktywność</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {transactions.slice(0,5).map((t,idx)=>{
                  const date = new Date(t.timestamp).toLocaleString('pl-PL',{hour:'2-digit', minute:'2-digit'});
                  if(t.type==='deposit') return (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <ArrowDown className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Wpłata {t.currency}</p>
                          <p className="text-xs text-muted-foreground">{date}</p>
                        </div>
                      </div>
                      <p className="font-medium text-green-600">+{t.amount.toFixed(2)} {t.currency}</p>
                    </div>
                  );
                  if(t.type==='withdraw') return (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                          <ArrowUp className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Wypłata {t.currency}</p>
                          <p className="text-xs text-muted-foreground">{date}</p>
                        </div>
                      </div>
                      <p className="font-medium text-red-600">-{t.amount.toFixed(2)} {t.currency}</p>
                    </div>
                  );
                  if(t.type==='exchange') return (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <ArrowLeftRight className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Wymiana {t.from} → {t.to}</p>
                          <p className="text-xs text-muted-foreground">{date}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-green-600">+{t.received.toFixed(2)} {t.to}</p>
                        <p className="text-red-600">-{t.amount.toFixed(2)} {t.from}</p>
                      </div>
                    </div>
                  );
                })}
                {transactions.length === 0 && <p className="text-sm text-muted-foreground">Brak aktywności.</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}