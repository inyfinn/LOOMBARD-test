import { useWallet } from "@/context/WalletContext";
import { useEffect, useState } from "react";

export function UpdateInfo(){
  const { lastUpdate } = useWallet();
  const [text,setText]=useState('');

  useEffect(()=>{
    const interval=setInterval(()=>{
      const diff = Math.round((Date.now()-lastUpdate)/1000);
      setText(`Aktualizacja ${diff}s temu`);
    },1000);
    return ()=>clearInterval(interval);
  },[lastUpdate]);

  return <span className="fixed bottom-2 right-4 text-xs text-muted-foreground select-none">{text}</span>;
} 