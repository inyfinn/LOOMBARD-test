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
  maxRows?: number; // if provided, slice rows
}

export function RankingsTable({ category: propCategory, continent: propContinent, showCategoryTabs = true, maxRows }: Props) {
  const { rates } = useWallet();
  const snapshot = useRef<Record<string, number>>(rates);
  const lastComputeTs = useRef<number>(0);
  const [rows, setRows] = useState<Row[]>([]);

  const [sortCol, setSortCol] = useState<SortCol>("change");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [tab, setTab] = useState<string>(propCategory || "gains");
  const [continent, setContinent] = useState<string>(propContinent || "All");

  const ratesRef = useRef(rates);
  useEffect(() => { ratesRef.current = rates; }, [rates]);

  useEffect(() => {
    // compute immediately
    compute();
    // schedule daily recompute
    const daily = setInterval(compute, 86400000);
    return () => clearInterval(daily);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const compute = () => {
    const now = Date.now();
    if (now - lastComputeTs.current < 1000) return; // prevent double
    
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
    
    const list: Row[] = Object.entries(ratesRef.current).map(([symbol, rate]) => {
      const old = historicalRates24h[symbol] ?? rate;
      const change = ((rate - old) / old) * 100;
      return { symbol, name: symbol, rate: parseFloat(rate.toFixed(4)), change };
    });
    setRows(list);
    snapshot.current = ratesRef.current;
    lastComputeTs.current = now;
  };

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
      label: "Wszystko",
      filter: () => true,
    },
  };

  // Get filtered rows based on category & continent
  let filtered = rows.filter(categories[tab].filter);
  if (continent !== "All") {
    filtered = filtered.filter((r) => currencyMeta[r.symbol]?.continent === continent);
  }

  // Fallback: if no data for gains/losses (first load), show top/bottom by rate
  if (filtered.length === 0 && (tab === 'gains' || tab === 'losses')) {
    const allRows = rows.filter(() => true);
    if (continent !== "All") {
      filtered = allRows.filter((r) => currencyMeta[r.symbol]?.continent === continent);
    } else {
      filtered = allRows;
    }
    
    if (tab === 'gains') {
      filtered = filtered.sort((a, b) => b.rate - a.rate).slice(0, 10);
    } else if (tab === 'losses') {
      filtered = filtered.sort((a, b) => a.rate - b.rate).slice(0, 10);
    }
  }

  const applySort = (a: Row, b: Row) => {
    const dirMult = sortDir === "asc" ? 1 : -1;
    if (sortCol === "symbol") return a.symbol.localeCompare(b.symbol) * dirMult;
    if (sortCol === "rate") return (a.rate - b.rate) * dirMult;
    return (a.change - b.change) * dirMult;
  };

  let sorted = [...filtered].sort(applySort);

  if (maxRows && sorted.length > maxRows) {
    sorted = sorted.slice(0, maxRows);
  }

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