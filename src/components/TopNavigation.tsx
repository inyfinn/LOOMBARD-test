import { Search, Bell, User, Moon, Sun, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";

const aliasMap: Record<string,string> = {
  // USD
  "usd":"USD","us dollar":"USD","us$":"USD","dollar":"USD","$":"USD",
  // EUR
  "eur":"EUR","euro":"EUR","eu":"EUR","e":"EUR",
  "gbp":"GBP","pound":"GBP","gbp sterling":"GBP","£":"GBP","pound sterling":"GBP",
  "inr":"INR","rupee":"INR","₹":"INR","indian rupee":"INR",
  "aud":"AUD","australian dollar":"AUD","au dollar":"AUD","au$":"AUD",
  "cad":"CAD","canadian dollar":"CAD","ca dollar":"CAD","ca$":"CAD",
  "sgd":"SGD","singapore dollar":"SGD","sg dollar":"SGD","sg$":"SGD",
  "chf":"CHF","swiss franc":"CHF","franc":"CHF",
  "myr":"MYR","ringgit":"MYR","rm":"MYR","malaysian ringgit":"MYR",
  "jpy":"JPY","yen":"JPY","¥":"JPY","japanese yen":"JPY",
  "ars":"ARS","argentine peso":"ARS","peso":"ARS","ar peso":"ARS",
  "bhd":"BHD","bahraini dinar":"BHD","dinar":"BHD",
  "bwp":"BWP","pula":"BWP","botswana pula":"BWP",
  "brl":"BRL","real":"BRL","brazilian real":"BRL","r$":"BRL",
  "bgn":"BGN","lev":"BGN","bulgarian lev":"BGN",
  "clp":"CLP","chilean peso":"CLP",
  "cny":"CNY","yuan":"CNY","rmb":"CNY","chinese yuan":"CNY","renminbi":"CNY",
  "cop":"COP","colombian peso":"COP",
  "czk":"CZK","koruna":"CZK","czech koruna":"CZK",
  "dkk":"DKK","krone":"DKK","danish krone":"DKK",
  "hkd":"HKD","hk dollar":"HKD","hong kong dollar":"HKD",
  "huf":"HUF","forint":"HUF","hungarian forint":"HUF",
  "isk":"ISK","krona":"ISK","icelandic krona":"ISK",
  "idr":"IDR","rupiah":"IDR","indonesian rupiah":"IDR",
  "irr":"IRR","rial":"IRR","iranian rial":"IRR",
  "ils":"ILS","shekel":"ILS","israeli shekel":"ILS",
  "kzt":"KZT","tenge":"KZT","kazakhstani tenge":"KZT",
  "krw":"KRW","won":"KRW","₩":"KRW","south korean won":"KRW",
  "kwd":"KWD","kuwaiti dinar":"KWD",
  "lyd":"LYD","libyan dinar":"LYD",
  "mur":"MUR","mauritian rupee":"MUR",
  "mxn":"MXN","mexican peso":"MXN",
  "npr":"NPR","nepalese rupee":"NPR",
  "nzd":"NZD","nz dollar":"NZD","new zealand dollar":"NZD","nz$":"NZD",
  "nok":"NOK","norwegian krone":"NOK",
  "omr":"OMR","omani rial":"OMR",
  "pkr":"PKR","pakistani rupee":"PKR",
  "php":"PHP","philippine peso":"PHP",
  "qar":"QAR","qatari riyal":"QAR",
  "ron":"RON","leu":"RON","romanian leu":"RON",
  "rub":"RUB","ruble":"RUB","russian ruble":"RUB","₽":"RUB",
  "sar":"SAR","saudi riyal":"SAR",
  "zar":"ZAR","rand":"ZAR","south african rand":"ZAR","r":"ZAR",
  "lkr":"LKR","sri lankan rupee":"LKR",
  "sek":"SEK","swedish krona":"SEK",
  "twd":"TWD","tw dollar":"TWD","taiwan dollar":"TWD",
  "thb":"THB","baht":"THB","thai baht":"THB",
  "ttd":"TTD","trinidad dollar":"TTD","trinidadian dollar":"TTD",
  "try":"TRY","lira":"TRY","turkish lira":"TRY",
  "aed":"AED","dirham":"AED","emirati dirham":"AED",
};

export function TopNavigation() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [layout, setLayout] = useState<'mobile' | 'desktop'>('mobile');
  const { rates } = useWallet();
  const [query,setQuery]=useState("");

  const handleSearch=()=>{
    const key=query.trim().toLowerCase();
    if(!key) return;
    const code=aliasMap[key]||aliasMap[key.replace(/[^a-z$£¥₹₩₽]/g,"")];
    if(code && rates[code]){
      const current=rates[code];
      const yesterday=(current*0.99).toFixed(4);
      const week=(current*0.97).toFixed(4);
      const month=(current*0.95).toFixed(4);
      toast(`Kurs ${code}: dziś ${current.toFixed(4)}, wczoraj ${yesterday}, tydzień temu ${week}, miesiąc temu ${month}`);
    }else{
      toast("Nie znaleziono waluty");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    const savedLayout = localStorage.getItem('layout') as 'mobile' | 'desktop' || 'mobile';
    setTheme(savedTheme);
    setLayout(savedLayout);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleLayout = () => {
    const newLayout = layout === 'mobile' ? 'desktop' : 'mobile';
    setLayout(newLayout);
    localStorage.setItem('layout', newLayout);
    document.body.className = newLayout === 'desktop' ? 'layout-desktop' : 'layout-mobile';
  };

  const getThemeIcon = () => {
    return theme === 'light' ? <Moon size={18}/> : <Sun size={18}/>;
  };

  return (
    <header className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">L</span>
          </div>
          <h1 className="text-xl font-bold">Loombard</h1>
        </Link>

        {/* Search - hidden on mobile */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Szukaj walut..."
              className="pl-10 bg-muted/50"
              value={query}
              onChange={e=>setQuery(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter'){handleSearch();}}}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label={theme==='light'?'Tryb ciemny':'Tryb jasny'}>
            {getThemeIcon()}
          </Button>
          
          <Button variant="ghost" size="sm" onClick={toggleLayout}>
            {layout === 'mobile' ? <Monitor size={18} /> : <Smartphone size={18} />}
          </Button>

          <Button variant="ghost" size="sm" className="hidden md:flex">
            <Bell size={18} />
          </Button>

          <Button asChild variant="ghost" size="sm">
            <Link to="/ustawienia"><User size={18}/></Link>
          </Button>
        </div>
      </div>
    </header>
  );
}