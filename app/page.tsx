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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRecall, setSelectedRecall] =
    useState<Recall | null>(null);

  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchRecalls();
  }, [page]);

  async function fetchRecalls(searchTerm = "") {
    setLoading(true);

    const PAGE_SIZE = 50;
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("recalls")
      .select("*")
      .range(from, to);

    if (searchTerm) {
      query = query.or(
        `Manufacturer.ilike.%${searchTerm}%,Subject.ilike.%${searchTerm}%,Component.ilike.%${searchTerm}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("SUPABASE ERROR:", error);
      setLoading(false);
      return;
    }

    console.log("DATA:", data);

    setRecalls(data || []);
    setLoading(false);
  }

  function handleSearch(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const value = e.target.value;

    setSearch(value);
    setPage(1);

    fetchRecalls(value);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "40px 20px",
        fontFamily: "Arial",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: 52,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          Recall Intelligence Platform
        </h1>

        <p
          style={{
            fontSize: 24,
            color: "#555",
            marginBottom: 40,
          }}
        >
          Every Failure has some lessons to learn
        </p>

        {/* SEARCH */}

        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 40,
          }}
        >
          <input
            type="text"
            placeholder="Search OEM, Component, Subject..."
            value={search}
            onChange={handleSearch}
            style={{
              flex: 1,
              padding: 18,
              borderRadius: 12,
              border: "1px solid #ccc",
              fontSize: 16,
            }}
          />

          <button
            onClick={() => {
              setSearch("");
              fetchRecalls("");
            }}
            style={{
              padding: "0 24px",
              borderRadius: 12,
              border: "none",
              background: "#dc2626",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>

        {/* LOADING */}

        {loading ? (
          <div
            style={{
              background: "white",
              padding: 30,
              borderRadius: 16,
            }}
          >
            Loading recalls...
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 20,
            }}
          >
            {recalls.map((recall, index) => {
              const isSelected =
                selectedRecall?.Subject ===
                  recall.Subject &&
                selectedRecall?.Manufacturer ===
                  recall.Manufacturer;

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
                      padding: 24,
                      borderRadius: 16,
                      cursor: "pointer",
                      boxShadow:
                        "0 2px 10px rgba(0,0,0,0.08)",
                      border: isSelected
                        ? "2px solid #2563eb"
                        : "none",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: 24,
                        marginBottom: 10,
                      }}
                    >
                      {recall.Manufacturer}
                    </h2>

                    <p
                      style={{
                        fontSize: 18,
                        marginBottom: 14,
                      }}
                    >
                      {recall.Subject}
                    </p>

                    <div
                      style={{
                        display: "inline-block",
                        background: "#dbeafe",
                        padding: "8px 14px",
                        borderRadius: 10,
                        marginBottom: 16,
                      }}
                    >
                      {recall.Component}
                    </div>

                    <div>
                      <a
                        href={`https://www.nhtsa.gov/recalls?nhtsaId=${recall["NHTSA Campaign Number"]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#2563eb",
                          fontWeight: "bold",
                          textDecoration: "none",
                        }}
                      >
                        View Official NHTSA Recall →
                      </a>
                    </div>
                  </div>

                  {/* EXPANDED PANEL */}

                  {isSelected && (
                    <div
                      style={{
                        background: "white",
                        marginTop: 12,
                        padding: 24,
                        borderRadius: 16,
                        boxShadow:
                          "0 2px 10px rgba(0,0,0,0.08)",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: 28,
                          marginBottom: 20,
                        }}
                      >
                        Recall Details
                      </h3>

                      <p
                        style={{
                          marginBottom: 10,
                        }}
                      >
                        <strong>Manufacturer:</strong>{" "}
                        {recall.Manufacturer}
                      </p>

                      <p
                        style={{
                          marginBottom: 10,
                        }}
                      >
                        <strong>Component:</strong>{" "}
                        {recall.Component}
                      </p>

                      <p
                        style={{
                          marginBottom: 20,
                        }}
                      >
                        <strong>Report Date:</strong>{" "}
                        {
                          recall[
                            "Report Received Date"
                          ]
                        }
                      </p>

                      <div
                        style={{
                          background: "#f9fafb",
                          padding: 20,
                          borderRadius: 12,
                          lineHeight: 1.7,
                        }}
                      >
                        <h4
                          style={{
                            marginBottom: 12,
                          }}
                        >
                          Recall Description
                        </h4>

                        <p>
                          {
                            recall[
                              "Recall Description"
                            ]
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 50,
          }}
        >
          <button
            onClick={() => {
              if (page > 1) {
                setPage(page - 1);
              }
            }}
            style={{
              padding: "12px 22px",
              borderRadius: 10,
              border: "none",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
            }}
          >
            Previous
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            Page {page}
          </div>

          <button
            onClick={() => {
              setPage(page + 1);
            }}
            style={{
              padding: "12px 22px",
              borderRadius: 10,
              border: "none",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
