import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useWallet } from "@/context/WalletContext";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export const WithdrawDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  const { withdraw, balances, rates } = useWallet();
  const currencyList = Object.keys(balances).filter(c=>balances[c]>0);
  const [currency, setCurrency] = useState("PLN");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const bal = balances[currency] || 0;

  const handle = (all: boolean = false) => {
    const amt = all ? bal : parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;
    const res = withdraw(currency, amt);
    if (!res.success) {
      setError(res.error || "");
      return;
    }
    setError(null);
    onOpenChange(false);
    setAmount("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Wypłać środki</DialogTitle>
          <DialogDescription>Usuń środki z portfela.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium">Waluta</label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {currencyList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 mt-4">
          <label className="text-sm font-medium flex items-center justify-between">Kwota
            <Button variant="link" className="p-0" onClick={() => handle(true)}>Wypłać wszystko</Button>
          </label>
          <Input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00" />
          <p className="text-xs text-muted-foreground">Saldo: {bal.toFixed(2)} {currency}</p>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={() => handle(false)}>Wypłać</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 