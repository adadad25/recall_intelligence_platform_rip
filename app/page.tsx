"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Recall = {
  Manufacturer: string;
  Subject: string;
  Component: string;
  "Recall Description": string;
  "Report Received Date": string;
  "NHTSA Campaign Number": string;
};

export default function Home() {
  const [recalls, setRecalls] = useState<Recall[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRecall, setSelectedRecall] =
    useState<Recall | null>(null);

  const [page, setPage] = useState(1);
  const [loadingRecalls, setLoadingRecalls] =
    useState(false);

  useEffect(() => {
    fetchRecalls(search, page);
  }, [page]);

  async function fetchRecalls(
    searchTerm = "",
    page = 1
  ) {
    setLoadingRecalls(true);

    const PAGE_SIZE = 50;

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("recalls")
      .select("*")
      .range(from, to);

    if (searchTerm) {
      query = query.or(
        `Manufacturer.ilike.%${searchTerm}%,Component.ilike.%${searchTerm}%,Subject.ilike.%${searchTerm}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      setLoadingRecalls(false);
      return;
    }

    setRecalls((data as Recall[]) || []);
    setLoadingRecalls(false);
  }

  function handleSearch(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const value = e.target.value;

    setSearch(value);
    setPage(1);

    fetchRecalls(value, 1);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "40px 20px",
        fontFamily:
          "Inter, Arial, Helvetica, sans-serif",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto 40px auto",
        }}
      >
        <h1
          style={{
            fontSize: 44,
            fontWeight: 800,
            marginBottom: 10,
            color: "#111827",
          }}
        >
          Recall Intelligence Platform
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "#6b7280",
          }}
        >
          Every Failure has some lessons to learn
        </p>
      </div>

      {/* SEARCH */}

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto 40px auto",
          display: "flex",
          gap: 12,
        }}
      >
        <input
          type="text"
          placeholder="Search manufacturer, component, subject..."
          value={search}
          onChange={handleSearch}
          style={{
            flex: 1,
            padding: 18,
            borderRadius: 14,
            border: "1px solid #d1d5db",
            fontSize: 16,
            background: "white",
            outline: "none",
          }}
        />

        <button
          onClick={() => {
            setSearch("");
            setPage(1);
            setSelectedRecall(null);
            fetchRecalls("", 1);
          }}
          style={{
            padding: "0 24px",
            borderRadius: 14,
            border: "none",
            background: "#dc2626",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 15,
          }}
        >
          Clear
        </button>
      </div>

      {/* LOADING */}

      {loadingRecalls && (
        <div
          style={{
            textAlign: "center",
            marginTop: 60,
            fontSize: 18,
            color: "#6b7280",
          }}
        >
          Loading recalls...
        </div>
      )}

      {/* RECALL CARDS */}

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gap: 22,
        }}
      >
        {!loadingRecalls &&
          recalls.map((recall, index) => {
            const isSelected =
              selectedRecall?.Subject ===
                recall.Subject &&
              selectedRecall?.Manufacturer ===
                recall.Manufacturer;

            const campaignNumber =
              recall["NHTSA Campaign Number"];

            const nhtsaUrl = campaignNumber
              ? `https://www.nhtsa.gov/vehicle/${campaignNumber}/recalls`
              : null;

            return (
              <div key={index}>
                {/* CARD */}

                <div
                  onClick={() => {
                    if (isSelected) {
                      setSelectedRecall(null);
                    } else {
                      setSelectedRecall(recall);
                    }
                  }}
                  style={{
                    background: "white",
                    borderRadius: 22,
                    padding: 28,
                    cursor: "pointer",
                    boxShadow:
                      "0 4px 18px rgba(0,0,0,0.06)",
                    border: isSelected
                      ? "2px solid #2563eb"
                      : "1px solid #e5e7eb",
                    transition: "0.2s ease",
                  }}
                >
                  {/* TOP */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "start",
                      gap: 20,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          fontSize: 24,
                          fontWeight: 700,
                          marginBottom: 12,
                          color: "#111827",
                        }}
                      >
                        {recall.Manufacturer}
                      </h2>

                      <p
                        style={{
                          fontSize: 17,
                          lineHeight: 1.5,
                          color: "#374151",
                          marginBottom: 18,
                        }}
                      >
                        {recall.Subject}
                      </p>

                      <div
                        style={{
                          display: "inline-block",
                          padding:
                            "8px 14px",
                          borderRadius: 10,
                          background:
                            "#eff6ff",
                          color: "#1d4ed8",
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        {recall.Component}
                      </div>
                    </div>

                    {/* DATE */}

                    <div
                      style={{
                        fontSize: 14,
                        color: "#6b7280",
                        background:
                          "#f9fafb",
                        padding:
                          "10px 14px",
                        borderRadius: 12,
                      }}
                    >
                      {recall[
                        "Report Received Date"
                      ] || "No Date"}
                    </div>
                  </div>

                  {/* LINKS */}

                  <div
                    style={{
                      marginTop: 22,
                      display: "flex",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    {campaignNumber && (
                      <a
                        href={`https://www.nhtsa.gov/recalls?nhtsaId=${campaignNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                        style={{
                          color: "#2563eb",
                          fontWeight: 700,
                          textDecoration:
                            "none",
                          fontSize: 15,
                        }}
                      >
                        View NHTSA Recall →
                      </a>
                    )}

                    {nhtsaUrl && (
                      <a
                        href={nhtsaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                        style={{
                          color: "#059669",
                          fontWeight: 700,
                          textDecoration:
                            "none",
                          fontSize: 15,
                        }}
                      >
                        Vehicle Recall Details →
                      </a>
                    )}
                  </div>
                </div>

                {/* EXPANDED PANEL */}

                {isSelected && (
                  <div
                    style={{
                      marginTop: 14,
                      background: "white",
                      borderRadius: 22,
                      padding: 30,
                      boxShadow:
                        "0 4px 18px rgba(0,0,0,0.06)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        marginBottom: 20,
                        color: "#111827",
                      }}
                    >
                      Recall Details
                    </h3>

                    <div
                      style={{
                        background:
                          "#f9fafb",
                        borderRadius: 16,
                        padding: 24,
                        lineHeight: 1.8,
                        color: "#374151",
                        fontSize: 16,
                      }}
                    >
                      {
                        recall[
                          "Recall Description"
                        ]
                      }
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* PAGINATION */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          marginTop: 50,
        }}
      >
        <button
          onClick={() => {
            if (page > 1) {
              const newPage = page - 1;
              setPage(newPage);
              fetchRecalls(search, newPage);
            }
          }}
          style={{
            padding: "14px 24px",
            borderRadius: 14,
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Previous
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: 700,
            fontSize: 16,
            color: "#111827",
          }}
        >
          Page {page}
        </div>

        <button
          onClick={() => {
            const newPage = page + 1;
            setPage(newPage);
            fetchRecalls(search, newPage);
          }}
          style={{
            padding: "14px 24px",
            borderRadius: 14,
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
