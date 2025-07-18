import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function showConfirmToast(
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) {
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
        setTimeout(() => setShake(false), 500);
      }, 5000);
      return () => clearTimeout(t);
    }, []);

    useEffect(() => {
      if (remaining <= 0) {
        onCancel?.();
        toast.dismiss(toastId);
      }
    }, [remaining]);

    return (
      <div
        className={`flex flex-col items-center p-7 space-y-4 rounded-md bg-background shadow-lg border border-green-600 ${shake ? 'shake' : ''}`}
        style={{
          width: typeof window !== 'undefined' && window.innerWidth < 640 ? 'calc(100vw - 60px)' : 'auto',
          position:'relative',left:'50%',transform:'translateX(-50%)',
          marginTop: typeof window !== 'undefined' && window.innerWidth >= 1024 ? '20vh' : undefined,
          paddingLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 68 : undefined,
          paddingRight: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 68 : undefined,
          paddingTop: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 58 : undefined,
        }}
      >
        <p className="font-medium text-center" style={{fontSize: typeof window!=='undefined' && window.innerWidth>=1024? '1.125rem':'1rem'}}>{message}</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              onConfirm();
              toast.dismiss(toastId);
            }}
          >
            Potwierdź
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onCancel?.();
              toast.dismiss(toastId);
            }}
          >
            Cofnij
          </Button>
        </div>
        <p
          className={`text-xs text-center ${remaining<=5? 'text-red-600':'text-muted-foreground'}`}
        >
          Brak potwierdzenia za {remaining}s
        </p>
      </div>
    );
  };

  toast.custom((t) => <CountdownToast toastId={t.id} />, {
    position: "top-center",
    duration: 15000,
    className: "!p-0",
  });
} 