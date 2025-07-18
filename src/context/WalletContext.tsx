import React, { createContext, useContext, useState, useEffect } from "react";

export type Transaction =
  | { type: "deposit"; currency: string; amount: number; timestamp: number }
  | { type: "withdraw"; currency: string; amount: number; timestamp: number }
  | { type: "exchange"; from: string; to: string; amount: number; received: number; timestamp: number };

interface WalletContextValue {
  balances: Record<string, number>;
  rates: Record<string, number>;
  transactions: Transaction[];
  lastUpdate: number;
  deposit: (currency: string, amount: number) => void;
  withdraw: (currency: string, amount: number) => { success: boolean; error?: string };
  exchange: (from: string, to: string, amount: number) => { success: boolean; error?: string };
}

const initialRates: Record<string, number> = {
  PLN: 1,
  USD: 4.0234,
  EUR: 4.3456,
  NOK: 0.3789,
  SEK: 0.3654,
  DKK: 0.5834,
  CHF: 4.4567,
  TRY: 0.1445,
  ARS: 0.0112,
  BRL: 0.8234,
  RUB: 0.0434,
  JPY: 0.0271,
  GBP: 5.1234,
  CZK: 0.1756,
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balances, setBalances] = useState<Record<string, number>>({
    PLN: 10000,
  });

  const [ratesData, setRates] = useState<Record<string, number>>(initialRates);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  const sampleTx: Transaction[] = Array.from({length:15}).map((_,i)=>({type:"deposit",currency:"PLN",amount:50*i+10,timestamp:Date.now()-i*3600*1000}));

  const [transactions, setTransactions] = useState<Transaction[]>(sampleTx);

  // Mock rate update every 1s ➜ ±0.5% random drift
  useEffect(() => {
    const id = setInterval(() => {
      setBalances((prev) => ({ ...prev })); // trigger dependents
      setRates((r) => {
        const next: Record<string, number> = { ...r };
        Object.keys(next).forEach((k) => {
          const delta = Math.random() * 0.0009 + 0.0001; // 0.01%–0.1%
          const drift = 1 + (Math.random() < 0.5 ? -delta : delta);
          next[k] = parseFloat((next[k] * drift).toFixed(4));
        });
        next["PLN"] = 1;
        return next;
      });
      setLastUpdate(Date.now());
    }, 500);
    return () => clearInterval(id);
  }, []);

  const addTransaction = (t: Transaction) =>
    setTransactions((prev) => [t, ...prev.slice(0, 19)]); // keep max 20

  const deposit = (currency: string, amount: number) => {
    if (amount <= 0) return;
    setBalances((prev) => ({ ...prev, [currency]: parseFloat(((prev[currency] || 0) + amount).toFixed(2)) }));
    addTransaction({ type: "deposit", currency, amount, timestamp: Date.now() });
  };

  const withdraw = (currency: string, amount: number) => {
    const bal = balances[currency] || 0;
    if (amount > bal) return { success: false, error: "Brak środków" };
    setBalances((prev) => ({ ...prev, [currency]: parseFloat((bal - amount).toFixed(2)) }));
    addTransaction({ type: "withdraw", currency, amount, timestamp: Date.now() });
    return { success: true };
  };

  const exchange = (from: string, to: string, amount: number) => {
    if (amount <= 0) return { success: false, error: "Kwota musi być dodatnia" };
    const fromBalance = balances[from] || 0;
    if (amount > fromBalance) {
      // adjust to max available
      amount = fromBalance;
    }

    const rateFrom = initialRates[from];
    const rateTo = initialRates[to];

    if (!rateFrom || !rateTo) {
      return { success: false, error: "Brak kursu waluty" };
    }

    const valueInPln = from === "PLN" ? amount : amount * rateFrom;
    const received = to === "PLN" ? valueInPln : parseFloat((valueInPln / rateTo).toFixed(2));

    setBalances((prev) => {
      const next = { ...prev };
      next[from] = parseFloat((prev[from] - amount).toFixed(2));
      next[to] = parseFloat(((prev[to] || 0) + received).toFixed(2));
      return next;
    });

    addTransaction({ type: "exchange", from, to, amount, received, timestamp: Date.now() });
    return { success: true };
  };

  return (
    <WalletContext.Provider
      value={{ balances, rates: ratesData, transactions, lastUpdate, deposit, withdraw, exchange }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}; 