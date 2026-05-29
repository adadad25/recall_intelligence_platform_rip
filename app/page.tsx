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
      .select(`
        Manufacturer,
        Subject,
        Component,
        "Recall Description",
        "Report Received Date",
        "NHTSA Campaign Number"
      `)
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

    setRecalls(data || []);
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
        background: "#f3f4f6",
        minHeight: "100vh",
        paddingBottom: 60,
        fontFamily: "Arial",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          background: "white",
          padding: 30,
          borderBottom: "1px solid #ddd",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              fontSize: 48,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Recall Intelligence Platform
          </h1>

          <p
            style={{
              color: "#666",
              fontSize: 20,
              marginBottom: 25,
            }}
          >
            Every Failure has some lessons to learn
          </p>

          {/* SEARCH */}

          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <input
              type="text"
              placeholder="Search OEM, Component, Subject..."
              value={search}
              onChange={handleSearch}
              style={{
                flex: 1,
                padding: 16,
                borderRadius: 12,
                border: "1px solid #ccc",
                fontSize: 16,
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
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: "0 24px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}

      <div
        style={{
          maxWidth: 1200,
          margin: "30px auto",
          padding: "0 20px",
        }}
      >
        {loadingRecalls ? (
          <div
            style={{
              background: "white",
              padding: 40,
              borderRadius: 20,
              textAlign: "center",
              fontSize: 20,
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.08)",
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
                style={{
                  marginBottom: 20,
                }}
              >
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
                    padding: 28,
                    borderRadius: 20,
                    cursor: "pointer",
                    boxShadow:
                      "0 4px 12px rgba(0,0,0,0.08)",
                    border: isSelected
                      ? "2px solid #2563eb"
                      : "2px solid transparent",
                    transition: "0.2s",
                  }}
                >
                  <h2
                    style={{
                      fontSize: 30,
                      marginBottom: 12,
                    }}
                  >
                    {recall.Manufacturer}
                  </h2>

                  <p
                    style={{
                      fontSize: 20,
                      marginBottom: 16,
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
                      marginBottom: 20,
                    }}
                  >
                    {recall.Component}
                  </div>

                  <div>
                    <a
                      href={`https://www.nhtsa.gov/recalls?nhtsaId=${recall["NHTSA Campaign Number"]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) =>
                        e.stopPropagation()
                      }
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

                {/* DETAILS */}

                {isSelected && (
                  <div
                    style={{
                      background: "white",
                      marginTop: 15,
                      padding: 30,
                      borderRadius: 20,
                      boxShadow:
                        "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: 34,
                        marginBottom: 20,
                      }}
                    >
                      Recall Details
                    </h2>

                    <div
                      style={{
                        marginBottom: 25,
                      }}
                    >
                      <strong>
                        Report Date:
                      </strong>{" "}
                      {
                        selectedRecall[
                          "Report Received Date"
                        ]
                      }
                    </div>

                    <div
                      style={{
                        background: "#f9fafb",
                        padding: 24,
                        borderRadius: 16,
                        lineHeight: 1.8,
                      }}
                    >
                      <h3
                        style={{
                          marginBottom: 14,
                          fontSize: 24,
                        }}
                      >
                        Recall Description
                      </h3>

                      <p>
                        {
                          selectedRecall[
                            "Recall Description"
                          ]
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* PAGINATION */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 40,
          }}
        >
          <button
            onClick={() => {
              if (page > 1) {
                const newPage = page - 1;

                setPage(newPage);
                setSelectedRecall(null);

                fetchRecalls(search, newPage);
              }
            }}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "14px 24px",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Previous
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            Page {page}
          </div>

          <button
            onClick={() => {
              const newPage = page + 1;

              setPage(newPage);
              setSelectedRecall(null);

              fetchRecalls(search, newPage);
            }}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "14px 24px",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
