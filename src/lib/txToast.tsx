import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/context/WalletContext";

export function showTransactionToast(
  tx: Transaction | null | undefined,
  rollback: (tx: Transaction) => void
) {
  if (!tx) return;
  let confirmed = false;
  const id = toast.custom((t) => (
    <div className="w-[260px] sm:w-[300px] space-y-2">
      <p className="text-sm font-medium">Transakcja oczekuje potwierdzenia</p>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => {
            confirmed = true;
            toast.dismiss(t.id);
          }}
        >
          Potwierdź
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            confirmed = true;
            rollback(tx);
            toast.dismiss(t.id);
          }}
        >
          Cofnij
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Brak potwierdzenia w 15&nbsp;s anuluje transakcję.
      </p>
    </div>
  ),{
    position:"top-center",
    duration:15000
  });
  setTimeout(() => {
    if (!confirmed) {
      rollback(tx);
      toast.dismiss(id);
    }
  }, 15000);
} 