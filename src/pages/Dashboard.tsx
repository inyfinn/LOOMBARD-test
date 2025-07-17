import { TopNavigation } from "@/components/TopNavigation";
import { PortfolioSection } from "@/components/PortfolioSection";
import { PromoBanner } from "@/components/PromoBanner";
import { CurrencyRatesTable } from "@/components/CurrencyRatesTable";
import { RankingsSection } from "@/components/RankingsSection";
import { QuickActions } from "@/components/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      
      <main className="container max-w-7xl mx-auto px-4 py-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Portfolio */}
          <div className="lg:col-span-1 space-y-6">
            <PortfolioSection />
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Szybkie akcje</CardTitle>
              </CardHeader>
              <CardContent>
                <QuickActions />
              </CardContent>
            </Card>
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
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">USD</span>
                    </div>
                    <div>
                      <p className="font-medium">Wymiana USD → PLN</p>
                      <p className="text-sm text-muted-foreground">Wczoraj, 14:30</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+1,205.00 PLN</p>
                    <p className="text-sm text-muted-foreground">-300.00 USD</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">EUR</span>
                    </div>
                    <div>
                      <p className="font-medium">Przelew EUR</p>
                      <p className="text-sm text-muted-foreground">2 dni temu</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">-500.00 EUR</p>
                    <p className="text-sm text-muted-foreground">Do Niemiec</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">PLN</span>
                    </div>
                    <div>
                      <p className="font-medium">Wpłata gotówki</p>
                      <p className="text-sm text-muted-foreground">3 dni temu</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+2,000.00 PLN</p>
                    <p className="text-sm text-muted-foreground">Bank PKO BP</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}