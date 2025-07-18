import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Wallet, PiggyBank } from "lucide-react";
import { ExchangeDialog } from "@/components/ExchangeDialog";
import { DepositDialog } from "@/components/DepositDialog";
import { WithdrawDialog } from "@/components/WithdrawDialog";

const actions = [
  { icon: ArrowUpDown, label: "Wymień", color: "text-primary" },
  { icon: Wallet, label: "Wpłać", color: "text-blue-500" },
  { icon: PiggyBank, label: "Wypłać", color: "text-orange-500" },
];

export function QuickActions() {
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const handleClick = (label: string) => {
    switch (label) {
      case "Wymień":
        setExchangeOpen(true);
        break;
      case "Wpłać":
        setDepositOpen(true);
        break;
      case "Wypłać":
        setWithdrawOpen(true);
        break;
    }
  };

  return (
    <>
    <div className="grid grid-cols-3 gap-2">
      {actions.map(({ icon: Icon, label, color }) => (
          <Button
            key={label}
            variant="ghost"
            className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-accent"
            onClick={() => handleClick(label)}
          >
          <Icon className={`${color} h-5 w-5`} />
          <span className="text-xs font-medium text-center">{label}</span>
        </Button>
      ))}
    </div>
      <ExchangeDialog open={exchangeOpen} onOpenChange={setExchangeOpen} />
      <DepositDialog open={depositOpen} onOpenChange={setDepositOpen} />
      <WithdrawDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} />
    </>
  );
}