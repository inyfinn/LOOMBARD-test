import { RankingsTable } from "@/components/RankingsTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";

export default function Rankings() {
  const continents = [
    "Europe",
    "North America",
    "South America",
    "Asia",
    "Africa",
    "Oceania",
    "Middle East",
  ];

  const [continent, setContinent] = useState<string>("All");

  const ExpandableCard: React.FC<{ title: string; children: (expanded:boolean)=>React.ReactNode }> = ({ title, children }) => {
    const [expanded, setExpanded] = React.useState(false);
    return (
      <Card className={`${title==='Wszystkie' ? 'md:col-span-2':''}`}>
        <CardHeader className="flex flex-row items-center justify-between py-4 px-4">
          <CardTitle>{title}</CardTitle>
          <div className="flex gap-2">
            {!expanded && (
              <button
                className="flex items-center text-[10px] px-3 py-2 rounded-md border-2 border-green-600 text-green-600 hover:bg-green-600/10"
                onClick={() => setExpanded(true)}
              >
                <ArrowDown className="h-3 w-3 mr-1" /> Rozwiń
              </button>
            )}
            {expanded && (
              <button
                className="flex items-center text-[10px] px-3 py-2 rounded-md border-2 border-white text-white hover:bg-white/10"
                onClick={() => setExpanded(false)}
              >
                <ArrowUp className="h-3 w-3 mr-1" /> Zwiń
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {children(expanded)}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-4">
      <div className="container max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Rankingi 24h</h1>
        </div>

        {/* Continent selector */}
        <div className="flex items-center gap-2">
          <Tabs value={continent} onValueChange={setContinent} className="flex-1">
            <TabsList className="flex gap-1 overflow-x-auto scrollbar-hide">
              <TabsTrigger value="All" className="text-xs sm:text-sm whitespace-nowrap">
                Wszystko
              </TabsTrigger>
              {continents.map((c) => (
                <TabsTrigger key={c} value={c} className="text-xs sm:text-sm whitespace-nowrap">
                  {c}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExpandableCard title="Wszystko">
            {(exp)=> <RankingsTable category="all" continent={continent} showCategoryTabs={false} maxRows={exp?undefined:6} />}
          </ExpandableCard>

          {/* Zyski */}
          <ExpandableCard title="Największe zyski">
            {(exp)=> <RankingsTable category="gains" continent={continent} showCategoryTabs={false} maxRows={exp?undefined:6} />}
          </ExpandableCard>

          {/* Straty */}
          <ExpandableCard title="Największe straty">
            {(exp)=> <RankingsTable category="losses" continent={continent} showCategoryTabs={false} maxRows={exp?undefined:6} />}
          </ExpandableCard>

          {/* Najwyższy */}
          <ExpandableCard title="Najwyższy kurs">
            {(exp)=> <RankingsTable category="highest" continent={continent} showCategoryTabs={false} maxRows={exp?undefined:6} />}
          </ExpandableCard>

          {/* Najniższy */}
          <ExpandableCard title="Najniższy kurs">
            {(exp)=> <RankingsTable category="lowest" continent={continent} showCategoryTabs={false} maxRows={exp?undefined:6} />}
          </ExpandableCard>
        </div>
      </div>
    </div>
  );
}