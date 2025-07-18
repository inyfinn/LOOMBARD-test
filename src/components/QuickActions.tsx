import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Plus, ArrowUpRight } from "lucide-react";
import { ExchangeDialog } from "@/components/ExchangeDialog";
import { DepositDialog } from "@/components/DepositDialog";
import { WithdrawDialog } from "@/components/WithdrawDialog";

const actions = [
  { icon: ArrowUpDown, label: "Wymień", color: "text-primary" },
  { icon: Plus, label: "Dodaj", color: "text-blue-500" },
  { icon: ArrowUpRight, label: "Wypłać", color: "text-orange-500" },
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
      case "Dodaj":
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
            className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-accent relative group"
            onClick={() => handleClick(label)}
          >
          <Icon className={`${color} h-10 w-10`} />
          <span className="text-sm font-medium text-center">{label}</span>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[7px] h-[2px] bg-[#27272a] group-hover:w-[11px] group-hover:bg-green-500 transition-all duration-200"></div>
        </Button>
      ))}
    </div>
      <ExchangeDialog open={exchangeOpen} onOpenChange={setExchangeOpen} />
      <DepositDialog open={depositOpen} onOpenChange={setDepositOpen} />
      <WithdrawDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} />
    </>
  );
}