import { useState, useEffect } from "react";
import { showConfirmToast } from "@/lib/txToast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useWallet } from "@/context/WalletContext";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export const ExchangeDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  const { balances, rates, exchange, rollback } = useWallet();
  const [fromCur, setFromCur] = useState<string>("PLN");
  const [toCur, setToCur] = useState<string>("EUR");
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [lastEdited, setLastEdited] = useState<'from' | 'to'>("from");
  const [error, setError] = useState<string | null>(null);

  const currencyList = Object.keys(rates);

  const format = (n: number, c: string) => `${n.toFixed(2)} ${c === 'PLN' ? 'zł' : c}`;

  // Synchronize fields based on which side user edytował
  useEffect(() => {
    if (lastEdited === 'from') {
      if (!fromAmount) {
        setToAmount('');
        return;
      }
      const amt = parseFloat(fromAmount);
      if (isNaN(amt)) return;
      const res = amt * (rates[fromCur] || 1) / (rates[toCur] || 1);
      const formatted = res.toFixed(2);
      if (formatted !== toAmount) setToAmount(formatted);
    }
  }, [fromAmount, fromCur, toCur, rates, lastEdited]);

  useEffect(() => {
    if (lastEdited === 'to') {
      if (!toAmount) {
        setFromAmount('');
        return;
      }
      const amt = parseFloat(toAmount);
      if (isNaN(amt)) return;
      const res = amt * (rates[toCur] || 1) / (rates[fromCur] || 1);
      const formatted = res.toFixed(2);
      if (formatted !== fromAmount) setFromAmount(formatted);
    }
  }, [toAmount, fromCur, toCur, rates, lastEdited]);

  const handleSubmit = () => {
    const amt = parseFloat(fromAmount);
    if (isNaN(amt) || amt <= 0) return;
    // pre-check
    if (amt > maxBalance) { setError("Brak środków"); return; }
    showConfirmToast(
      `Wymiana ${amt.toFixed(2)} ${fromCur} na ${toCur}. Potwierdź`,
      () => {
        const res = exchange(fromCur, toCur, amt);
        if (!res.success && res.error) {
          setError(res.error);
          return;
        }
        onOpenChange(false);
        setFromAmount("");
        setError(null);
      },
      undefined
    );
  };

  const maxBalance = balances[fromCur] || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full max-w-md top-[150px] translate-y-0 sm:top-[50%] sm:translate-y-[-50%]"
        onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); handleSubmit(); }}}
      >
        <DialogHeader>
          <DialogTitle>Wymiana walut</DialogTitle>
          <DialogDescription>Wybierz waluty i kwotę transakcji.</DialogDescription>
        </DialogHeader>

        {/* From Currency & Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Wymieniasz</label>
          <div className="grid grid-cols-3 gap-2">
            <Select value={fromCur} onValueChange={setFromCur}>
              <SelectTrigger className="col-span-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {currencyList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={fromAmount}
              onChange={(e) => { setFromAmount(e.target.value); setLastEdited('from'); }}
              placeholder="Kwota"
              className="col-span-2"
            />
          </div>
          <p className="text-xs text-muted-foreground">Saldo: {format(maxBalance, fromCur)}</p>
        </div>

        {/* To Currency & Amount */}
        <div className="space-y-2 mt-4">
          <label className="text-sm font-medium">Otrzymujesz</label>
          <div className="grid grid-cols-3 gap-2">
            <Select value={toCur} onValueChange={setToCur}>
              <SelectTrigger className="col-span-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {currencyList.map(c => c !== fromCur && <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={toAmount}
              onChange={(e) => { setToAmount(e.target.value); setLastEdited('to'); }}
              placeholder="Kwota"
              className="col-span-2"
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit}>Potwierdź wymianę</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 