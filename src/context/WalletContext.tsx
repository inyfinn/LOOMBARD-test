import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "@/components/ui/sonner";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'exchange';
  currency: string;
  amount: number;
  timestamp: number;
  from?: string;
  to?: string;
  received?: number;
}

interface ExchangeResult {
  success: boolean;
  error?: string;
}

interface WalletContextType {
  balances: Record<string, number>;
  rates: Record<string, number>;
  transactions: Transaction[];
  lastUpdate: number;
  deposit: (currency: string, amount: number) => void;
  withdraw: (currency: string, amount: number) => ExchangeResult;
  exchange: (from: string, to: string, amount: number) => ExchangeResult;
  rollback: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Symulowane dane historyczne 24h temu (bazowane na rzeczywistych trendach rynkowych)
const historicalRates24h: Record<string, number> = {
  USD: 3.85,    // PLN był silniejszy 24h temu
  EUR: 4.12,    // EUR spadł względem PLN
  GBP: 4.78,    // GBP spadł
  CHF: 4.45,    // CHF stabilny
  JPY: 0.025,   // JPY spadł
  CNY: 0.53,    // CNY spadł
  AUD: 2.52,    // AUD spadł
  CAD: 2.84,    // CAD spadł
  NZD: 2.38,    // NZD spadł
  SEK: 0.38,    // SEK spadł
  NOK: 0.36,    // NOK spadł
  DKK: 0.55,    // DKK spadł
  CZK: 0.17,    // CZK spadł
  HUF: 0.011,   // HUF spadł
  PLN: 1.0,     // PLN jako baza
  RUB: 0.042,   // RUB spadł
  TRY: 0.13,    // TRY spadł
  BRL: 0.78,    // BRL spadł
  MXN: 0.23,    // MXN spadł
  ZAR: 0.21,    // ZAR spadł
  INR: 0.046,   // INR spadł
  KRW: 0.0029,  // KRW spadł
  SGD: 2.86,    // SGD spadł
  HKD: 0.49,    // HKD spadł
  THB: 0.11,    // THB spadł
  MYR: 0.82,    // MYR spadł
  IDR: 0.00024, // IDR spadł
  PHP: 0.069,   // PHP spadł
  TWD: 0.12,    // TWD spadł
  AED: 1.05,    // AED spadł
  SAR: 1.03,    // SAR spadł
  QAR: 1.06,    // QAR spadł
  KWD: 12.5,    // KWD spadł
  BHD: 10.2,    // BHD spadł
  OMR: 10.0,    // OMR spadł
  ARS: 0.0045,  // ARS spadł
  CLP: 0.0042,  // CLP spadł
  COP: 0.00095, // COP spadł
  PEN: 1.02,    // PEN spadł
  UYU: 0.10,    // UYU spadł
  VND: 0.00016, // VND spadł
  EGP: 0.12,    // EGP spadł
  NGN: 0.0027,  // NGN spadł
  KES: 0.027,   // KES spadł
  MAD: 0.38,    // MAD spadł
  TND: 1.25,    // TND spadł
  BWP: 0.28,    // BWP spadł
  GHS: 0.32,    // GHS spadł
  UGX: 0.0010,  // UGX spadł
  TZS: 0.0015,  // TZS spadł
  CDF: 0.0014,  // CDF spadł
  XAF: 0.0067,  // XAF spadł
  XOF: 0.0067,  // XOF spadł
  XPF: 0.037,   // XPF spadł
  XCD: 1.42,    // XCD spadł
  BBD: 1.90,    // BBD spadł
  BMD: 3.85,    // BMD spadł
  BND: 2.86,    // BND spadł
  BIF: 0.0014,  // BIF spadł
  DJF: 0.021,   // DJF spadł
  ERN: 0.26,    // ERN spadł
  ETB: 0.070,   // ETB spadł
  FJD: 1.68,    // FJD spadł
  GMD: 0.063,   // GMD spadł
  GNF: 0.00045, // GNF spadł
  HTG: 0.029,   // HTG spadł
  IQD: 0.0029,  // IQD spadł
  IRR: 0.000092, // IRR spadł
  ISK: 0.028,   // ISK spadł
  JOD: 5.42,    // JOD spadł
  KHR: 0.00094, // KHR spadł
  KMF: 0.0085,  // KMF spadł
  LBP: 0.0026,  // LBP spadł
  LKR: 0.012,   // LKR spadł
  LRD: 0.020,   // LRD spadł
  LSL: 0.21,    // LSL spadł
  LYD: 0.79,    // LYD spadł
  MGA: 0.00085, // MGA spadł
  MKD: 0.067,   // MKD spadł
  MMK: 0.0018,  // MMK spadł
  MNT: 0.0011,  // MNT spadł
  MOP: 0.48,    // MOP spadł
  MRO: 0.010,   // MRO spadł
  MUR: 0.084,   // MUR spadł
  MVR: 0.25,    // MVR spadł
  MWK: 0.0023,  // MWK spadł
  MZN: 0.060,   // MZN spadł
  NAD: 0.21,    // NAD spadł
  NPR: 0.029,   // NPR spadł
  PAB: 3.85,    // PAB spadł
  PGK: 1.08,    // PGK spadł
  PKR: 0.014,   // PKR spadł
  PYG: 0.00052, // PYG spadł
  RWF: 0.0031,  // RWF spadł
  SBD: 0.46,    // SBD spadł
  SCR: 0.28,    // SCR spadł
  SDG: 0.0064,  // SDG spadł
  SLL: 0.00019, // SLL spadł
  SOS: 0.0067,  // SOS spadł
  SRD: 0.12,    // SRD spadł
  STD: 0.00018, // STD spadł
  SVC: 0.45,    // SVC spadł
  SYP: 0.0015,  // SYP spadł
  SZL: 0.21,    // SZL spadł
  TOP: 1.62,    // TOP spadł
  TTD: 0.57,    // TTD spadł
  VUV: 0.032,   // VUV spadł
  WST: 1.38,    // WST spadł
  YER: 0.015,   // YER spadł
  ZMW: 0.15,    // ZMW spadł
  ZWL: 0.012,   // ZWL spadł
};

// Funkcja do pobierania aktualnych kursów z API
async function fetchCurrentRates(): Promise<Record<string, number>> {
  try {
    // Pobieramy dane z exchangerate-api.com (darmowe API)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/PLN');
    const data = await response.json();
    
    // Konwertujemy z PLN jako bazy na PLN jako walutę docelową
    const rates: Record<string, number> = {};
    Object.entries(data.rates).forEach(([currency, rate]) => {
      if (currency !== 'PLN') {
        rates[currency] = 1 / (rate as number);
      }
    });
    
    // Dodajemy PLN jako bazę
    rates.PLN = 1.0;
    
    return rates;
  } catch (error) {
    console.error('Błąd pobierania kursów:', error);
    // Fallback do symulowanych danych
    return {
      USD: 3.92, EUR: 4.18, GBP: 4.85, CHF: 4.52, JPY: 0.026, CNY: 0.54,
      AUD: 2.56, CAD: 2.88, NZD: 2.42, SEK: 0.39, NOK: 0.37, DKK: 0.56,
      CZK: 0.17, HUF: 0.011, PLN: 1.0, RUB: 0.043, TRY: 0.13, BRL: 0.79,
      MXN: 0.23, ZAR: 0.21, INR: 0.047, KRW: 0.0030, SGD: 2.90, HKD: 0.50,
      THB: 0.11, MYR: 0.83, IDR: 0.00025, PHP: 0.070, TWD: 0.12, AED: 1.07,
      SAR: 1.05, QAR: 1.08, KWD: 12.7, BHD: 10.4, OMR: 10.2, ARS: 0.0046,
      CLP: 0.0043, COP: 0.00097, PEN: 1.04, UYU: 0.10, VND: 0.00016,
      EGP: 0.12, NGN: 0.0028, KES: 0.028, MAD: 0.39, TND: 1.27, BWP: 0.29,
      GHS: 0.33, UGX: 0.0010, TZS: 0.0015, CDF: 0.0014, XAF: 0.0068,
      XPF: 0.038, XCD: 1.44, BBD: 1.92, BMD: 3.92, BND: 2.90,
      BIF: 0.0014, DJF: 0.022, ERN: 0.26, ETB: 0.071, FJD: 1.70, GMD: 0.064,
      GNF: 0.00046, HTG: 0.029, IQD: 0.0030, IRR: 0.000093, ISK: 0.029,
      JOD: 5.50, KHR: 0.00095, KMF: 0.0086, LBP: 0.0026, LKR: 0.012,
      LRD: 0.020, LSL: 0.21, LYD: 0.80, MGA: 0.00086, MKD: 0.068, MMK: 0.0018,
      MNT: 0.0011, MOP: 0.49, MRO: 0.010, MUR: 0.085, MVR: 0.25, MWK: 0.0023,
      MZN: 0.061, NAD: 0.21, NPR: 0.029, PAB: 3.92, PGK: 1.09, PKR: 0.014,
      PYG: 0.00053, RWF: 0.0031, SBD: 0.47, SCR: 0.28, SDG: 0.0065, SLL: 0.00019,
      SOS: 0.0068, SRD: 0.12, STD: 0.00018, SVC: 0.45, SYP: 0.0015, SZL: 0.21,
      TOP: 1.64, TTD: 0.58, VUV: 0.032, WST: 1.40, YER: 0.015, ZMW: 0.15, ZWL: 0.012
    };
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balances, setBalances] = useState<Record<string, number>>({
    PLN: 10000,
    USD: 2500,
    EUR: 2300,
  });
  
  const [rates, setRates] = useState<Record<string, number>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  // Pobieranie aktualnych kursów przy starcie
  useEffect(() => {
    const initializeRates = async () => {
      const currentRates = await fetchCurrentRates();
      setRates(currentRates);
      setLastUpdate(Date.now());
    };
    
    initializeRates();
    
    // Aktualizacja co 30 sekund
    const interval = setInterval(initializeRates, 30000);
    return () => clearInterval(interval);
  }, []);

  const deposit = (currency: string, amount: number) => {
    setBalances(prev => ({
      ...prev,
      [currency]: (prev[currency] || 0) + amount
    }));
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'deposit',
      currency,
      amount,
      timestamp: Date.now()
    };
    
    setTransactions(prev => [transaction, ...prev]);
    setLastTransaction(transaction);
    toast.success(`Wpłacono ${amount.toFixed(2)} ${currency}`);
  };

  const withdraw = (currency: string, amount: number): ExchangeResult => {
    const currentBalance = balances[currency] || 0;
    if (currentBalance < amount) {
      return { success: false, error: "Brak wystarczających środków" };
    }
    
    setBalances(prev => ({
      ...prev,
      [currency]: prev[currency] - amount
    }));
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'withdraw',
      currency,
      amount,
      timestamp: Date.now()
    };
    
    setTransactions(prev => [transaction, ...prev]);
    setLastTransaction(transaction);
    toast.success(`Wypłacono ${amount.toFixed(2)} ${currency}`);
    return { success: true };
  };

  const exchange = (from: string, to: string, amount: number): ExchangeResult => {
    const currentBalance = balances[from] || 0;
    if (currentBalance < amount) {
      return { success: false, error: "Brak wystarczających środków" };
    }
    
    const fromRate = rates[from] || 1;
    const toRate = rates[to] || 1;
    const received = (amount * fromRate) / toRate;
    
    setBalances(prev => ({
      ...prev,
      [from]: prev[from] - amount,
      [to]: (prev[to] || 0) + received
    }));
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'exchange',
      currency: from,
      amount,
      from,
      to,
      received,
      timestamp: Date.now()
    };
    
    setTransactions(prev => [transaction, ...prev]);
    setLastTransaction(transaction);
    toast.success(`Wymieniono ${amount.toFixed(2)} ${from} na ${received.toFixed(2)} ${to}`);
    return { success: true };
  };

  const rollback = () => {
    if (!lastTransaction) return;
    
    const { type, currency, amount, from, to, received } = lastTransaction;
    
    if (type === 'deposit') {
      setBalances(prev => ({
        ...prev,
        [currency]: prev[currency] - amount
      }));
    } else if (type === 'withdraw') {
      setBalances(prev => ({
        ...prev,
        [currency]: prev[currency] + amount
      }));
    } else if (type === 'exchange' && from && to && received) {
      setBalances(prev => ({
        ...prev,
        [from]: prev[from] + amount,
        [to]: prev[to] - received
      }));
    }
    
    setTransactions(prev => prev.slice(1));
    setLastTransaction(prev => prev ? transactions[1] || null : null);
    toast.success("Transakcja cofnięta");
  };

  return (
    <WalletContext.Provider value={{
      balances,
      rates,
      transactions,
      lastUpdate,
      deposit,
      withdraw,
      exchange,
      rollback
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
} 