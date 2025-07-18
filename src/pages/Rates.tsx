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

  const { rates, isLiveMode } = useWallet();
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
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Kursy walut</h1>
          <p className="text-muted-foreground">
            {isLiveMode ? "Aktualizowane na żywo co 30 sekund" : "Aktualizowane na żywo co pół sekundy"}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Szukaj walut..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wszystkie kursy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort("name")}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Waluta
                      {sortBy === "name" && (
                        <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </Button>
                  </th>
                  <th className="text-right py-3 px-4 font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort("rate")}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Kurs
                      {sortBy === "rate" && (
                        <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </Button>
                  </th>
                  <th className="text-right py-3 px-4 font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort("change")}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Zmiana
                      {sortBy === "change" && (
                        <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedRates.map((rate) => (
                  <tr key={rate.code} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {rate.code.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{rate.code}/PLN</p>
                          <p className="text-sm text-muted-foreground">{rate.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <p className="font-medium">{rate.rate.toFixed(4)}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {formatChange(rate.change)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}