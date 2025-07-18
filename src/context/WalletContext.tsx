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
  deposit: (currency: string, amount: number) => Transaction | null;
  withdraw: (currency: string, amount: number) => { success: boolean; error?: string; tx?: Transaction };
  exchange: (from: string, to: string, amount: number) => { success: boolean; error?: string; tx?: Transaction };
  rollback: (tx: Transaction) => void;
}

const initialRates: Record<string, number> = {
  PLN: 1,
  USD: 3.6625,
  EUR: 4.2588,
  GBP: 4.9207,
  INR: 0.0426,
  AUD: 2.3838,
  CAD: 2.6659,
  SGD: 2.8524,
  CHF: 4.5640,
  MYR: 0.8629,
  JPY: 0.0247,
  ARS: 0.0029,
  BHD: 9.7408,
  BWP: 0.2635,
  BRL: 0.6601,
  BGN: 2.1775,
  CLP: 0.0038,
  CNY: 0.5101,
  COP: 0.0009,
  CZK: 0.1728,
  DKK: 0.5707,
  HKD: 0.4666,
  HUF: 0.0107,
  ISK: 0.0300,
  IDR: 0.0002,
  IRR: 0.0001,
  ILS: 1.0896,
  KZT: 0.0069,
  KRW: 0.0026,
  KWD: 11.9848,
  LYD: 0.6754,
  MUR: 0.0802,
  MXN: 0.1953,
  NPR: 0.0266,
  NZD: 2.1831,
  NOK: 0.3567,
  OMR: 9.5167,
  PKR: 0.0129,
  PHP: 0.0641,
  QAR: 1.0062,
  RON: 0.8393,
  RUB: 0.0470,
  SAR: 0.9767,
  ZAR: 0.2057,
  LKR: 0.0122,
  SEK: 0.3768,
  TWD: 0.1245,
  THB: 0.1130,
  TTD: 0.5400,
  TRY: 0.0908,
  AED: 0.9973,
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balances, setBalances] = useState<Record<string, number>>({
    PLN: 4000,
    EUR: 1000,
    USD: 1000,
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

  const deposit = (currency: string, amount: number):Transaction|null => {
    if (amount <= 0) return null;
    setBalances((prev) => ({ ...prev, [currency]: parseFloat(((prev[currency] || 0) + amount).toFixed(2)) }));
    const tx:Transaction={ type: "deposit", currency, amount, timestamp: Date.now() };
    addTransaction(tx);
    return tx;
  };

  const withdraw = (currency: string, amount: number) => {
    const bal = balances[currency] || 0;
    if (amount > bal) return { success: false, error: "Brak środków" };
    setBalances((prev) => ({ ...prev, [currency]: parseFloat((bal - amount).toFixed(2)) }));
    const tx:Transaction={ type:"withdraw",currency,amount,timestamp:Date.now() };
    addTransaction(tx);
    return { success: true, tx };
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

    const tx:Transaction={ type:"exchange",from,to,amount,received,timestamp:Date.now() };
    addTransaction(tx);
    return { success: true, tx };
  };

  const rollback = (tx: Transaction) => {
    if(tx.type==='deposit'){
       withdraw(tx.currency, tx.amount);
    }else if(tx.type==='withdraw'){
       deposit(tx.currency, tx.amount);
    }else if(tx.type==='exchange'){
       // reverse exchange
       setBalances(prev=>{
         const n={...prev};
         n[tx.from]= (n[tx.from]||0)+tx.amount;
         n[tx.to]= (n[tx.to]||0)-tx.received;
         return n;
       });
    }
  };

  return (
    <WalletContext.Provider
      value={{ balances, rates: ratesData, transactions, lastUpdate, deposit, withdraw, exchange, rollback }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}; 