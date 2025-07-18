import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import React, { useEffect, useRef, useState } from "react";

interface Row {
  symbol: string;
  name: string;
  rate: number;
  change: number; // percent
}

type SortCol = "symbol" | "rate" | "change";

type SortDir = "asc" | "desc";

const currencyMeta: Record<string, { continent: string }> = {
  PLN: { continent: "Europe" },
  EUR: { continent: "Europe" },
  GBP: { continent: "Europe" },
  CHF: { continent: "Europe" },
  CZK: { continent: "Europe" },
  HUF: { continent: "Europe" },
  NOK: { continent: "Europe" },
  SEK: { continent: "Europe" },
  DKK: { continent: "Europe" },
  USD: { continent: "North America" },
  CAD: { continent: "North America" },
  MXN: { continent: "North America" },
  AUD: { continent: "Oceania" },
  NZD: { continent: "Oceania" },
  BRL: { continent: "South America" },
  ARS: { continent: "South America" },
  CLP: { continent: "South America" },
  CNY: { continent: "Asia" },
  JPY: { continent: "Asia" },
  KRW: { continent: "Asia" },
  INR: { continent: "Asia" },
  IDR: { continent: "Asia" },
  THB: { continent: "Asia" },
  MYR: { continent: "Asia" },
  TWD: { continent: "Asia" },
  HKD: { continent: "Asia" },
  AED: { continent: "Middle East" },
  QAR: { continent: "Middle East" },
  SAR: { continent: "Middle East" },
  OMR: { continent: "Middle East" },
  KWD: { continent: "Middle East" },
  BHD: { continent: "Middle East" },
  ZAR: { continent: "Africa" },
};

interface Props {
  category?: string; // "gains" | "losses" | "highest" | "lowest" | "all"
  continent?: string;
  showCategoryTabs?: boolean;
}

export function RankingsTable({ category: propCategory, continent: propContinent, showCategoryTabs = true }: Props) {
  const { rates } = useWallet();
  const snapshot = useRef<Record<string, number>>(rates);
  const lastBaselineTs = useRef<number>(Date.now());
  const [rows, setRows] = useState<Row[]>([]);

  const [sortCol, setSortCol] = useState<SortCol>("change");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [tab, setTab] = useState<string>(propCategory || "gains");
  const [continent, setContinent] = useState<string>(propContinent || "All");

  useEffect(() => {
    const now = Date.now();
    if (now - lastBaselineTs.current > 86400000) {
      snapshot.current = rates;
      lastBaselineTs.current = now;
    }

    const list: Row[] = Object.entries(rates).map(([symbol, rate]) => {
      const old = snapshot.current[symbol] ?? rate;
      const change = ((rate - old) / old) * 100;
      return { symbol, name: symbol, rate: parseFloat(rate.toFixed(4)), change };
    });
    setRows(list);
  }, [rates]);

  const categories: Record<
    string,
    { label: string; filter: (r: Row) => boolean; defaultSort?: { col: SortCol; dir: SortDir } }
  > = {
    gains: {
      label: "Zyski",
      filter: (r) => r.change > 0,
      defaultSort: { col: "change", dir: "desc" },
    },
    losses: {
      label: "Straty",
      filter: (r) => r.change < 0,
      defaultSort: { col: "change", dir: "asc" },
    },
    highest: {
      label: "Najwyższy kurs",
      filter: () => true,
      defaultSort: { col: "rate", dir: "desc" },
    },
    lowest: {
      label: "Najniższy kurs",
      filter: () => true,
      defaultSort: { col: "rate", dir: "asc" },
    },
    all: {
      label: "Wszystkie",
      filter: () => true,
    },
  };

  // Get filtered rows based on category & continent
  let filtered = rows.filter(categories[tab].filter);
  if (continent !== "All") {
    filtered = filtered.filter((r) => currencyMeta[r.symbol]?.continent === continent);
  }

  const applySort = (a: Row, b: Row) => {
    const dirMult = sortDir === "asc" ? 1 : -1;
    if (sortCol === "symbol") return a.symbol.localeCompare(b.symbol) * dirMult;
    if (sortCol === "rate") return (a.rate - b.rate) * dirMult;
    return (a.change - b.change) * dirMult;
  };

  const sorted = [...filtered].sort(applySort);

  const toggleSort = (col: SortCol) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const continents = [
    "All",
    "Europe",
    "North America",
    "South America",
    "Asia",
    "Africa",
    "Oceania",
    "Middle East",
  ];

  useEffect(() => {
    // Reset sort when tab changes to its default if defined
    const def = categories[tab].defaultSort;
    if (def) {
      setSortCol(def.col);
      setSortDir(def.dir);
    }
  }, [tab]);

  return (
    <div className="space-y-4">
      {showCategoryTabs && (
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="flex flex-wrap gap-1">
            {Object.entries(categories).map(([key, { label }]) => (
              <TabsTrigger key={key} value={key} className="text-xs sm:text-sm">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Continent Filter */}
      {propCategory === undefined && (
      <div className="flex items-center gap-2">
        <label htmlFor="continent" className="text-sm text-muted-foreground">
          Kontynent:
        </label>
        <select
          id="continent"
          value={continent}
          onChange={(e) => setContinent(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm bg-background"
        >
          {continents.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => toggleSort("symbol")}
            >
              <div className="flex items-center gap-1">
                Symbol {sortCol === "symbol" && <ArrowUpDown size={12} />}
              </div>
            </TableHead>
            <TableHead className="hidden sm:table-cell">Nazwa</TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => toggleSort("rate")}
            >
              <div className="flex items-center gap-1">
                Kurs {sortCol === "rate" && <ArrowUpDown size={12} />}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer select-none text-right"
              onClick={() => toggleSort("change")}
            >
              <div className="flex items-center gap-1 justify-end">
                Zmiana 24h {sortCol === "change" && <ArrowUpDown size={12} />}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((r) => (
            <TableRow key={r.symbol}>
              <TableCell className="font-medium">{r.symbol}</TableCell>
              <TableCell className="hidden sm:table-cell">{r.name}</TableCell>
              <TableCell>{r.rate.toFixed(4)}</TableCell>
              <TableCell className="text-right">
                <Badge variant={r.change >= 0 ? "default" : "destructive"} className="text-xs">
                  {r.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {r.change.toFixed(2)}%
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {sorted.length === 0 && (
        <p className="text-sm text-muted-foreground">Brak danych dla wybranego filtra.</p>
      )}
    </div>
  );
} 