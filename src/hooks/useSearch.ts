import { useState } from "react";

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  source: string;
  lastUpdated: Date;
  tags: string[];
  relevanceScore: number;
}

export type SearchMode = "vector" | "semantic";

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const search = async (query: string, mode: SearchMode = "semantic") => {
    setLoading(true);
    try {
      // Mock API call - replace with actual search endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // const mockResults: SearchResult[] = [
      //   {
      //     id: "1",
      //     title: "Contract Formation Requirements",
      //     snippet:
      //       "A contract requires offer, acceptance, consideration, and mutual assent...",
      //     source: "Restatement (Second) of Contracts",
      //     lastUpdated: new Date("2024-01-01"),
      //     tags: ["contract", "formation", "elements"],
      //     relevanceScore: 0.95,
      //   },
      //   {
      //     id: "2",
      //     title: "Breach of Contract Remedies",
      //     snippet:
      //       "When a contract is breached, the non-breaching party may seek damages...",
      //     source: "UCC Article 2",
      //     lastUpdated: new Date("2024-01-02"),
      //     tags: ["contract", "breach", "remedies"],
      //     relevanceScore: 0.88,
      //   },
      // ];
      const response = await fetch(`http://localhost:5000/api/documents`);
      const data = await response.json();
      const parsedData: SearchResult[] = data.map((c: any) => ({
        ...c,
        lastUpdated: new Date(c.lastUpdated),
      }));

      setResults(parsedData);
    } finally {
      setLoading(false);
    }
  };

  return { search, loading, results };
};
