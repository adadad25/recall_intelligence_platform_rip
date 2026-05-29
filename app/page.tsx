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
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}

      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold text-gray-900">
            Recall Intelligence Platform
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            Every Failure has some lessons to
            learn
          </p>

          {/* SEARCH */}

          <div className="flex gap-3 mt-6">
            <input
              type="text"
              placeholder="Search OEM, Component, Subject..."
              value={search}
              onChange={handleSearch}
              className="flex-1 p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={() => {
                setSearch("");
                setPage(1);
                setSelectedRecall(null);
                fetchRecalls("", 1);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-6 rounded-xl font-semibold transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* LOADING */}

        {loadingRecalls && (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <div className="text-xl font-semibold text-gray-700">
              Loading recalls...
            </div>
          </div>
        )}

        {/* RESULTS */}

        <div className="grid gap-6">
          {!loadingRecalls &&
            recalls.map((recall, index) => {
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
                    className={`bg-white rounded-2xl p-6 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-xl border ${
                      isSelected
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {recall.Manufacturer}
                        </h2>

                        <p className="text-lg text-gray-700 mt-2">
                          {recall.Subject}
                        </p>

                        <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold">
                          {recall.Component}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <a
                          href={`https://www.nhtsa.gov/recalls?nhtsaId=${recall["NHTSA Campaign Number"]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                          className="text-blue-600 font-semibold hover:text-blue-800"
                        >
                          View Official NHTSA Recall →
                        </a>

                        <div className="text-sm text-gray-500">
                          Campaign #:{" "}
                          {
                            recall[
                              "NHTSA Campaign Number"
                            ]
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DETAILS */}

                  {isSelected && (
                    <div className="bg-white rounded-2xl mt-4 p-8 shadow-lg border border-gray-200 animate-in fade-in">
                      <h2 className="text-3xl font-bold mb-6">
                        Recall Details
                      </h2>

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <div className="text-sm text-gray-500">
                            Manufacturer
                          </div>

                          <div className="font-semibold text-lg">
                            {
                              selectedRecall.Manufacturer
                            }
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-500">
                            Report Date
                          </div>

                          <div className="font-semibold text-lg">
                            {
                              selectedRecall[
                                "Report Received Date"
                              ]
                            }
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-500">
                            Component
                          </div>

                          <div className="font-semibold text-lg">
                            {
                              selectedRecall.Component
                            }
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-500">
                            Campaign Number
                          </div>

                          <div className="font-semibold text-lg">
                            {
                              selectedRecall[
                                "NHTSA Campaign Number"
                              ]
                            }
                          </div>
                        </div>
                      </div>

                      {/* DESCRIPTION */}

                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4">
                          Recall Description
                        </h3>

                        <p className="text-gray-700 leading-8 whitespace-pre-wrap">
                          {
                            selectedRecall[
                              "Recall Description"
                            ]
                          }
                        </p>
                      </div>

                      {/* NHTSA BUTTON */}

                      <div className="mt-6">
                        <a
                          href={`https://www.nhtsa.gov/recalls?nhtsaId=${selectedRecall["NHTSA Campaign Number"]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                        >
                          Open Official NHTSA Recall
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* PAGINATION */}

        <div className="flex justify-center items-center gap-4 mt-10 mb-10">
          <button
            onClick={() => {
              if (page > 1) {
                const newPage = page - 1;

                setPage(newPage);
                setSelectedRecall(null);

                fetchRecalls(search, newPage);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Previous
          </button>

          <div className="bg-white px-6 py-3 rounded-xl shadow-sm font-bold">
            Page {page}
          </div>

          <button
            onClick={() => {
              const newPage = page + 1;

              setPage(newPage);
              setSelectedRecall(null);

              fetchRecalls(search, newPage);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
