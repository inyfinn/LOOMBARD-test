import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";

export function showConfirmToast(
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) {
  const CountdownToast: React.FC<{ toastId: number }> = ({ toastId }) => {
    const [remaining, setRemaining] = useState<number>(15);
    const [shake, setShake] = useState(false);
    const [pulseColor, setPulseColor] = useState(false);
    const toastRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      // Prevent body scroll
      document.body.classList.add('modal-open');
      
      const iv = setInterval(() => {
        setRemaining((r) => r - 1);
      }, 1000);
      
      return () => {
        clearInterval(iv);
        document.body.classList.remove('modal-open');
      };
    }, []);

    useEffect(() => {
      const shakeAt = [13000, 9000, 5000]; // shake at 13s, 9s, 5s
      const timers = shakeAt.map(delay => 
        setTimeout(() => {
          setShake(true);
          setTimeout(() => setShake(false), 1000);
        }, delay)
      );
      return () => timers.forEach(t => clearTimeout(t));
    }, []);

    // Pulsowanie czerwonego koloru w ostatnich 5 sekundach
    useEffect(() => {
      if (remaining <= 5) {
        const pulseInterval = setInterval(() => {
          setPulseColor(prev => !prev);
        }, 700);
        return () => clearInterval(pulseInterval);
      }
    }, [remaining]);

    useEffect(() => {
      if (remaining <= 0) {
        onCancel?.()
        toast.dismiss(toastId);
      }
    }, [remaining]);

    // Handle outside clicks
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (toastRef.current && !toastRef.current.contains(event.target as Node)) {
          setShake(true);
          setTimeout(() => setShake(false), 1000);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setShake(true);
          setTimeout(() => setShake(false), 1000);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, []);

    const progressPercentage = (remaining / 15) * 100;
    const isLast5Seconds = remaining <= 5;
    const progressColor = isLast5Seconds 
      ? (pulseColor ? '#dc2626' : '#991b1b') // Czerwony pulsujący
      : '#16a34a'; // Zielony

    return (
      <>
        {/* Modal overlay */}
        <div 
          className="fixed inset-0 bg-black/50 z-[9999]"
          style={{ pointerEvents: 'auto' }}
        />
        
        {/* Toast content */}
        <div
          ref={toastRef}
          className={`flex flex-col items-center p-7 space-y-4 rounded-md bg-background shadow-lg border border-green-600 ${shake ? 'shake' : ''}`}
          style={{
            width: typeof window !== 'undefined' && window.innerWidth < 640 ? 'calc(100vw - 60px)' : 'auto',
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
            zIndex: 10000,
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
          
          {/* Progress bar - converging to center */}
          <div 
            className="w-full h-1 bg-gray-200 rounded-full overflow-hidden relative"
            style={{ 
              position: 'absolute', 
              bottom: '0', 
              left: '0', 
              right: '0',
              height: '5px',
              borderBottomLeftRadius: '0.375rem',
              borderBottomRightRadius: '0.375rem'
            }}
          >
            <div
              className="h-full transition-all duration-1000 ease-linear"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: progressColor,
                position: 'absolute',
                left: `${50 - (progressPercentage / 2)}%`,
                right: `${50 - (progressPercentage / 2)}%`,
                minWidth: '0%',
                maxWidth: '100%'
              }}
            />
          </div>
        </div>
      </>
    );
  };

  toast.custom((t) => <CountdownToast toastId={t.id} />, {
    position: "top-center",
    duration: 15000,
    className: "!p-0 !bg-transparent !shadow-none !border-none",
  });
} 