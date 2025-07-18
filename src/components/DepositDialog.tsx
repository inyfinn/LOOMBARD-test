import { useState } from "react";
import { showTransactionToast } from "@/lib/txToast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useWallet } from "@/context/WalletContext";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export const DepositDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  const { deposit, rates, rollback } = useWallet();
  const currencyList = Object.keys(rates);
  const [currency, setCurrency] = useState("PLN");
  const [amount, setAmount] = useState("");

  const handle = () => {
    const amt = parseFloat(amount);
    if (!isNaN(amt) && amt > 0) {
      const tx = deposit(currency, amt);
      showTransactionToast(tx, rollback);
      onOpenChange(false);
      setAmount("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full max-w-md top-[150px] translate-y-0 sm:top-[50%] sm:translate-y-[-50%]"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handle();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Wpłać środki</DialogTitle>
          <DialogDescription>Dodaj środki do swojego portfela.</DialogDescription>
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
          <label className="text-sm font-medium">Kwota</label>
          <Input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00" />
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handle}>Wpłać</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 