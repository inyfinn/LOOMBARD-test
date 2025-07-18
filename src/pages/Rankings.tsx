import { RankingsTable } from "@/components/RankingsTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";

export default function Rankings() {
  const continents = [
    "All",
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
                className="flex items-center text-[10px] px-3 py-2 rounded-md border border-green-600 dark:bg-black dark:text-white dark:hover:bg-black/80 bg-white text-black hover:bg-white/80"
                onClick={() => setExpanded(true)}
              >
                <ArrowDown className="h-3 w-3 mr-1" /> Rozwiń
              </button>
            )}
            {expanded && (
              <button
                className="flex items-center text-[10px] px-3 py-2 rounded-md border border-white text-white bg-black hover:bg-black/80"
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
        <Tabs value={continent} onValueChange={setContinent} className="w-full">
          <TabsList className="flex flex-wrap gap-1 justify-center">
            {continents.map((c) => (
              <TabsTrigger key={c} value={c} className="text-xs sm:text-sm">
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExpandableCard title="Wszystkie">
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