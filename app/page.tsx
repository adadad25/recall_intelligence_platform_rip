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
      console.error(error);
      setLoading(false);
      return;
    }

    setRecalls(data || []);

    if (data && data.length > 0 && !selectedRecall) {
      setSelectedRecall(data[0]);
    }

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
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      {/* TOP HEADER */}

      <div
        style={{
          padding: "30px 40px",
          borderBottom: "1px solid #1e293b",
          background: "#111827",
          position: "sticky",
          top: 0,
          zIndex: 100,
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
            color: "#94a3b8",
            fontSize: 18,
          }}
        >
          Every Failure has some lessons to learn
        </p>
      </div>

      {/* SEARCH */}

      <div
        style={{
          padding: "25px 40px",
          borderBottom: "1px solid #1e293b",
          background: "#0f172a",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          <input
            type="text"
            placeholder="Search recalls..."
            value={search}
            onChange={handleSearch}
            style={{
              flex: 1,
              padding: 18,
              borderRadius: 14,
              border: "1px solid #334155",
              background: "#111827",
              color: "white",
              fontSize: 16,
              outline: "none",
            }}
          />

          <button
            onClick={() => {
              setSearch("");
              fetchRecalls("");
            }}
            style={{
              padding: "0 24px",
              borderRadius: 14,
              border: "none",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "40% 60%",
          minHeight: "calc(100vh - 180px)",
        }}
      >
        {/* LEFT PANEL */}

        <div
          style={{
            borderRight: "1px solid #1e293b",
            overflowY: "auto",
            height: "calc(100vh - 180px)",
            padding: 20,
          }}
        >
          {loading ? (
            <div
              style={{
                padding: 30,
                color: "#94a3b8",
              }}
            >
              Loading recalls...
            </div>
          ) : (
            recalls.map((recall, index) => {
              const isSelected =
                selectedRecall?.Subject ===
                  recall.Subject &&
                selectedRecall?.Manufacturer ===
                  recall.Manufacturer;

              return (
                <div
                  key={index}
                  onClick={() =>
                    setSelectedRecall(recall)
                  }
                  style={{
                    background: isSelected
                      ? "#1e293b"
                      : "#111827",

                    padding: 22,
                    borderRadius: 18,
                    marginBottom: 16,
                    cursor: "pointer",

                    border: isSelected
                      ? "1px solid #2563eb"
                      : "1px solid #1e293b",

                    transition: "0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <h2
                      style={{
                        fontSize: 22,
                        fontWeight: "bold",
                      }}
                    >
                      {recall.Manufacturer}
                    </h2>

                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: 13,
                      }}
                    >
                      {
                        recall[
                          "Report Received Date"
                        ]
                      }
                    </div>
                  </div>

                  <p
                    style={{
                      color: "#e2e8f0",
                      marginBottom: 18,
                      lineHeight: 1.5,
                    }}
                  >
                    {recall.Subject}
                  </p>

                  <div
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      borderRadius: 10,
                      background: "#2563eb",
                      fontSize: 13,
                      fontWeight: "bold",
                    }}
                  >
                    {recall.Component}
                  </div>
                </div>
              );
            })
          )}

          {/* PAGINATION */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              marginTop: 30,
              marginBottom: 30,
            }}
          >
            <button
              onClick={() => {
                if (page > 1) {
                  setPage(page - 1);
                }
              }}
              style={{
                padding: "12px 20px",
                borderRadius: 12,
                border: "none",
                background: "#1e293b",
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
                color: "#94a3b8",
              }}
            >
              Page {page}
            </div>

            <button
              onClick={() => {
                setPage(page + 1);
              }}
              style={{
                padding: "12px 20px",
                borderRadius: 12,
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

        {/* RIGHT PANEL */}

        <div
          style={{
            padding: 40,
            overflowY: "auto",
            height: "calc(100vh - 180px)",
          }}
        >
          {selectedRecall ? (
            <>
              <div
                style={{
                  marginBottom: 30,
                }}
              >
                <div
                  style={{
                    color: "#60a5fa",
                    fontWeight: "bold",
                    marginBottom: 12,
                  }}
                >
                  {selectedRecall.Component}
                </div>

                <h1
                  style={{
                    fontSize: 38,
                    lineHeight: 1.3,
                    marginBottom: 20,
                  }}
                >
                  {selectedRecall.Subject}
                </h1>

                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    color: "#94a3b8",
                    marginBottom: 30,
                  }}
                >
                  <div>
                    <strong>
                      Manufacturer:
                    </strong>{" "}
                    {
                      selectedRecall.Manufacturer
                    }
                  </div>

                  <div>
                    <strong>Campaign:</strong>{" "}
                    {
                      selectedRecall[
                        "NHTSA Campaign Number"
                      ]
                    }
                  </div>
                </div>

                <a
                  href={`https://www.nhtsa.gov/recalls?nhtsaId=${selectedRecall["NHTSA Campaign Number"]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    padding: "14px 20px",
                    borderRadius: 12,
                    background: "#2563eb",
                    color: "white",
                    textDecoration: "none",
                    fontWeight: "bold",
                    marginBottom: 40,
                  }}
                >
                  View Official NHTSA Recall →
                </a>
              </div>

              {/* DESCRIPTION */}

              <div
                style={{
                  background: "#111827",
                  borderRadius: 20,
                  padding: 30,
                  border: "1px solid #1e293b",
                }}
              >
                <h2
                  style={{
                    marginBottom: 20,
                    fontSize: 26,
                  }}
                >
                  Recall Description
                </h2>

                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: 1.8,
                    fontSize: 17,
                  }}
                >
                  {
                    selectedRecall[
                      "Recall Description"
                    ]
                  }
                </p>
              </div>
            </>
          ) : (
            <div
              style={{
                color: "#94a3b8",
                fontSize: 20,
              }}
            >
              Select a recall to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
