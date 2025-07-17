# Loombard - Waluty

Polska aplikacja do wymiany walut z interfejsem mobilnym, kursy na żywo i funkcje weryfikacji KYC.

## Funkcje

- 📱 Mobile-first design z bottom navigation
- 💱 Kursy walut na żywo z API exchangerate.host  
- 📊 Rankingi 24h (wzrosty, spadki, popularne)
- ⚙️ Ustawienia KYC, tryb ciemny/jasny/auto
- 🎨 Paleta zielona z kontrastem 4.5:1

## Instalacja

```bash
npm install
npm run dev
npm run build
```

## Struktura

- `src/pages/` - Dashboard, Rates, Rankings, Settings
- `src/components/` - BottomNav, CurrencyCard, QuickActions
- Tailwind z custom primary-50 do primary-900
