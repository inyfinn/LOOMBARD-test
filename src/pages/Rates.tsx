import { useState, useEffect, useRef } from "react";
import { useWallet } from "@/context/WalletContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, TrendingDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  change: number;
  isFavorite?: boolean;
}

export default function Rates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "rate" | "change">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { rates } = useWallet();
  const prev = useRef(rates);
  const [data,setData]=useState<CurrencyRate[]>([]);

  useEffect(()=>{
    const rows = Object.entries(rates).map(([code,rate])=>{
      const old=prev.current[code]??rate;
      const change=((rate-old)/old)*100;
      return {code,name:code,rate,change,isFavorite:false};
    });
    prev.current=rates;
    setData(rows);
  },[rates]);

  const filteredAndSortedRates = data
    .filter(rate => 
      rate.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "rate":
          comparison = a.rate - b.rate;
          break;
        case "change":
          comparison = a.change - b.change;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const toggleSort = (field: "name" | "rate" | "change") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-4">
      <div className="container max-w-md mx-auto px-4 space-y-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">Kursy walut</h1>
          <p className="text-muted-foreground">Aktualne kursy wymiany</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Szukaj waluty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={sortBy === "name" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleSort("name")}
          >
            Nazwa {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
          </Button>
          <Button
            variant={sortBy === "rate" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleSort("rate")}
          >
            Kurs {sortBy === "rate" && (sortOrder === "asc" ? "↑" : "↓")}
          </Button>
          <Button
            variant={sortBy === "change" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleSort("change")}
          >
            Zmiana {sortBy === "change" && (sortOrder === "asc" ? "↑" : "↓")}
          </Button>
        </div>

        {/* Currency list */}
        <div className="space-y-2">
          {filteredAndSortedRates.map((rate) => {
            const isPositive = rate.change > 0;
            return (
              <Card key={rate.code} className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary">{rate.code}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{rate.code}</p>
                          {rate.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{rate.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{rate.rate.toFixed(4)} PLN</p>
                      <Badge 
                        variant={isPositive ? "default" : "destructive"}
                        className="flex items-center gap-1"
                      >
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(rate.change).toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Update info */}
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Ostatnia aktualizacja: dzisiaj, 15:30
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Kursy aktualizowane co 15 minut
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}