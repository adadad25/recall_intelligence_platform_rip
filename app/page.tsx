"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [recalls, setRecalls] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedRecall, setSelectedRecall] =
    useState(null);

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

    const PAGE_SIZE = 100;

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

    console.log("SUPABASE DATA:", data);
    console.log("SUPABASE ERROR:", error);

    if (error) {
      console.error(error);
      setLoadingRecalls(false);
      return;
    }

    setRecalls(data || []);
    setLoadingRecalls(false);
  }

  function handleSearch(e) {
    const value = e.target.value;

    setSearch(value);
    setPage(1);

    fetchRecalls(value, 1);
  }

  return (
    <div
      style={{
        padding: 40,
        background: "#f3f4f6",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >
      {/* HEADER */}

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
        Enterprise Recall Analytics &
        Root Cause Intelligence
      </p>

      {/* SEARCH */}

      <div
        style={{
          display: "flex",
          gap: 10,
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
            padding: "0 20px",
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

      {/* RECALL LIST */}

      <div
        style={{
          display: "grid",
          gap: 20,
        }}
      >
        {loadingRecalls ? (
          <div
            style={{
              background: "white",
              padding: 30,
              borderRadius: 16,
              textAlign: "center",
            }}
          >
            Loading recalls...
          </div>
        ) : recalls.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: 30,
              borderRadius: 16,
              textAlign: "center",
            }}
          >
            No recalls found.
          </div>
        ) : (
          recalls.map((recall, index) => {
            const isSelected =
              selectedRecall?.id === recall.id;

            return (
              <div key={index}>
                {/* RECALL CARD */}

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
                    borderRadius: 14,
                    cursor: "pointer",
                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.08)",
                    border: isSelected
                      ? "2px solid #2563eb"
                      : "none",
                  }}
                >
                  {/* MANUFACTURER */}

                  <h2
                    style={{
                      marginBottom: 10,
                    }}
                  >
                    {recall.Manufacturer}
                  </h2>

                  {/* SUBJECT */}

                  <p
                    style={{
                      fontSize: 18,
                      marginBottom: 10,
                    }}
                  >
                    {recall.Subject}
                  </p>

                  {/* COMPONENT */}

                  <div
                    style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      background: "#eef2ff",
                      borderRadius: 8,
                      marginBottom: 12,
                    }}
                  >
                    {recall.Component}
                  </div>

                  {/* NHTSA LINK */}

                  {recall["NHTSA ID"] && (
                    <div
                      style={{
                        marginTop: 12,
                      }}
                    >
                      <a
                        href={`https://www.nhtsa.gov/recalls?nhtsaId=${recall["NHTSA ID"]}`}
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

                      <div
                        style={{
                          marginTop: 6,
                          color: "#666",
                          fontSize: 14,
                        }}
                      >
                        NHTSA ID:{" "}
                        {recall["NHTSA ID"]}
                      </div>
                    </div>
                  )}
                </div>

                {/* EXPANDED DETAILS */}

                {isSelected && (
                  <div
                    style={{
                      background: "white",
                      padding: 30,
                      borderRadius: 20,
                      marginTop: 15,
                      boxShadow:
                        "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: 28,
                        marginBottom: 20,
                      }}
                    >
                      Recall Details
                    </h2>

                    <h3
                      style={{
                        marginBottom: 10,
                      }}
                    >
                      {recall.Subject}
                    </h3>

                    <p
                      style={{
                        marginBottom: 10,
                      }}
                    >
                      <strong>
                        Manufacturer:
                      </strong>{" "}
                      {recall.Manufacturer}
                    </p>

                    <p
                      style={{
                        marginBottom: 20,
                        color: "#666",
                      }}
                    >
                      <strong>
                        Report Date:
                      </strong>{" "}
                      {
                        recall[
                          "Report Received Date"
                        ]
                      }
                    </p>

                    {/* DESCRIPTION */}

                    <div
                      style={{
                        background: "#f3f4f6",
                        padding: 20,
                        borderRadius: 12,
                        marginBottom: 20,
                      }}
                    >
                      <h4
                        style={{
                          marginBottom: 10,
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

                    {/* ROOT CAUSE */}

                    <div
                      style={{
                        background: "#dbeafe",
                        padding: 20,
                        borderRadius: 12,
                      }}
                    >
                      <h4
                        style={{
                          marginBottom: 10,
                        }}
                      >
                        Root Cause Assessment
                      </h4>

                      <p>
                        This recall likely
                        originated from a failure
                        within the{" "}
                        <strong>
                          {recall.Component}
                        </strong>{" "}
                        system, potentially
                        creating elevated
                        operational and safety
                        risks.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* PAGINATION */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          marginTop: 40,
          marginBottom: 60,
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
            padding: "12px 20px",
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
            const newPage = page + 1;

            setPage(newPage);
            setSelectedRecall(null);

            fetchRecalls(search, newPage);
          }}
          style={{
            padding: "12px 20px",
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
  );
}
