import { CurrencyCard } from "@/components/CurrencyCard";
import { QuickActions } from "@/components/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background pb-20 pt-4">
      <div className="container max-w-md mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Loombard</h1>
          <p className="text-muted-foreground">Waluty</p>
        </div>

        {/* Promo Banner */}
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5" />
              <Badge variant="secondary" className="text-primary-900">PROMOCJA</Badge>
            </div>
            <h3 className="font-bold mb-1">Wymień bez prowizji!</h3>
            <p className="text-sm opacity-90">
              Pierwszy przelew międzynarodowy za darmo dla nowych klientów.
            </p>
          </CardContent>
        </Card>

        {/* Balance Cards */}
        <div className="space-y-3">
          <CurrencyCard
            currency="PLN"
            balance={15842.75}
            isPrimary={true}
          />
          <CurrencyCard
            currency="USD"
            balance={2456.80}
            rate={4.0234}
            change={-0.15}
          />
          <CurrencyCard
            currency="EUR"
            balance={1875.20}
            rate={4.3456}
            change={0.23}
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Szybkie akcje</h2>
          <QuickActions />
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Ostatnia aktywność</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Wymiana USD → PLN</p>
                <p className="text-sm text-muted-foreground">Wczoraj, 14:30</p>
              </div>
              <div className="text-right">
                <p className="font-medium">+1,205.00 PLN</p>
                <p className="text-sm text-muted-foreground">-300.00 USD</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Przelew EUR</p>
                <p className="text-sm text-muted-foreground">2 dni temu</p>
              </div>
              <div className="text-right">
                <p className="font-medium">-500.00 EUR</p>
                <p className="text-sm text-muted-foreground">Do Niemiec</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}