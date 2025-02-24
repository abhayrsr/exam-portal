import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { Workbook } from "exceljs";

export const ResultsDownloadPage = () => {
  const { data: allResults, isLoading } = useQuery({
    queryKey: ["all-results"],
    queryFn: async () => {
      const { data } = await api.get("/admin/results");
      console.log("data", data);
      return data;
    },
  });

  const [results, setResults] = useState([]);

  useEffect(() => {
    if (allResults) {
      setResults(allResults);
    }
  }, [allResults]);

  const handleDownloadResults = async () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Results");

    worksheet.columns = [
      { header: "Student Name", key: "studentName" },
      { header: "Army Number", key: "armyNumber" },
      { header: "Rank", key: "rank" },
      { header: "Course", key: "course" },
      { header: "Exam Name", key: "examName" },
      { header: "Score", key: "score" },
      { header: "Percentage", key: "percentage" },
      { header: "Grade", key: "grade" },
    ];

    results.forEach((result) => {
      worksheet.addRow({
        studentName: result?.User?.username,
        armyNumber: result?.User?.army_number,
        rank: result?.User?.userrank,
        course: result?.User?.course_enrolled,
        examName: result?.Exam?.exam_name,
        score: result?.score,
        percentage: result?.percentage,
        grade: result?.grade,
      });
    });

    const excelFile = await workbook.xlsx.writeBuffer();
    const blob = new Blob([excelFile], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "results.xlsx";
    a.click();
  };

  return (
    <div className="space-y-8 p-6 flex flex-col items-center">
      {/* Top Section: Title (Left) & Button (Right) */}
      <div className="flex justify-between items-center w-full">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Results Download Page
        </h1>
        <button
          onClick={handleDownloadResults}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          Download Results
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Loading results...
        </div>
      ) : (
        // Table Section
        <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Army Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Exam Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Percentage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result) => (
                <tr
                  key={result?.id}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-6 py-4 text-gray-700">
                    {result?.User?.username}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {result?.User?.army_number}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {result?.User?.userrank}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {result?.User?.course_enrolled}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {result?.Exam?.exam_name}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{result?.score}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {result?.percentage}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{result?.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center"></div>
    </div>
  );
};

export default ResultsDownloadPage;
