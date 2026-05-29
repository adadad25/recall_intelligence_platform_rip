"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Recall = {
  Manufacturer?: string;
  Subject?: string;
  Component?: string;
  "Recall Description"?: string;
  link?: string;
  [key: string]: any;
};

export default function Home() {
  const [recalls, setRecalls] = useState<Recall[]>([]);
  const [search, setSearch] = useState("");
  const [loadingRecalls, setLoadingRecalls] =
    useState(false);

  useEffect(() => {
    fetchRecalls();
  }, []);

  async function fetchRecalls() {
    setLoadingRecalls(true);

    const { data, error } = await supabase
      .from("recalls")
      .select("*")
      .limit(20);

    console.log("SUPABASE DATA:", data);

    if (error) {
      console.error(error);
      setLoadingRecalls(false);
      return;
    }

    setRecalls(data || []);
    setLoadingRecalls(false);
  }

  function handleSearch(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setSearch(e.target.value);
  }

  const filteredRecalls = recalls.filter((recall) => {
    const q = search.toLowerCase();

    return (
      recall.Manufacturer
        ?.toLowerCase()
        .includes(q) ||
      recall.Subject?.toLowerCase().includes(q) ||
      recall.Component?.toLowerCase().includes(q)
    );
  });

  return (
    <div
      style={{
        padding: 40,
        background: "#f3f4f6",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >
      <h1
        style={{
          fontSize: 42,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Recall Intelligence Platform
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: 30,
        }}
      >
        Every Failure has some lessons to learn
      </p>

      <input
        type="text"
        placeholder="Search recalls..."
        value={search}
        onChange={handleSearch}
        style={{
          width: "100%",
          padding: 16,
          borderRadius: 12,
          border: "1px solid #ccc",
          marginBottom: 30,
          fontSize: 16,
        }}
      />

      {loadingRecalls ? (
        <p>Loading recalls...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 20,
          }}
        >
          {filteredRecalls.map((recall, index) => (
            <div
              key={index}
              style={{
                background: "white",
                padding: 24,
                borderRadius: 14,
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <h2>{recall.Manufacturer}</h2>

              <p>{recall.Subject}</p>

              <div
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  background: "#eef2ff",
                  borderRadius: 8,
                  marginTop: 10,
                }}
              >
                {recall.Component}
              </div>

              {/* DEBUG ALL FIELDS */}

              <pre
                style={{
                  marginTop: 20,
                  background: "#111",
                  color: "#0f0",
                  padding: 10,
                  borderRadius: 8,
                  overflow: "auto",
                  fontSize: 12,
                }}
              >
                {JSON.stringify(recall, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
