import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/context/WalletContext";
import { useEffect, useState } from "react";

export function showTransactionToast(
  tx: Transaction | null | undefined,
  rollback: (tx: Transaction) => void
) {
  if (!tx) return;

  const CountdownToast: React.FC<{ toastId: number }> = ({ toastId }) => {
    const [remaining, setRemaining] = useState<number>(15);
    const [shake, setShake] = useState(false);

    useEffect(() => {
      const iv = setInterval(() => {
        setRemaining((r) => r - 1);
      }, 1000);
      return () => clearInterval(iv);
    }, []);

    useEffect(() => {
      const t = setTimeout(() => {
        setShake(true);
        setTimeout(() => setShake(false), 500); // reset
      }, 5000);
      return () => clearTimeout(t);
    }, []);

    useEffect(() => {
      if (remaining <= 0) {
        rollback(tx!);
        toast.dismiss(toastId);
      }
    }, [remaining]);

    return (
      <div
        className={`flex flex-col items-center p-7 space-y-4 animate-in slide-in-from-top rounded-md bg-background shadow-lg border border-green-600 ${shake ? 'shake' : ''}`}
        style={{
          width: typeof window !== 'undefined' && window.innerWidth < 640 ? 'calc(100vw - 60px)' : 'auto',
          marginTop: typeof window !== 'undefined' && window.innerWidth >= 640 ? '20vh' : undefined,
          paddingLeft: typeof window !== 'undefined' && window.innerWidth >= 640 ? 50 + 28 : undefined,
          paddingRight: typeof window !== 'undefined' && window.innerWidth >= 640 ? 50 + 28 : undefined,
          paddingTop: typeof window !== 'undefined' && window.innerWidth >= 640 ? 30 + 28 : undefined,
          paddingBottom: 28,
        }}
      >
        <p className="text-sm font-medium text-center">Transakcja oczekuje potwierdzenia</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => toast.dismiss(toastId)}>
            Potwierdź
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              rollback(tx!);
              toast.dismiss(toastId);
            }}
          >
            Cofnij
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">Brak potwierdzenia za {remaining}s</p>
      </div>
    );
  };

  const id = toast.custom((t) => <CountdownToast toastId={t.id} />, {
    position: "top-center",
    duration: 15000,
    className: "!p-0", // padding handled inside
  });
} 