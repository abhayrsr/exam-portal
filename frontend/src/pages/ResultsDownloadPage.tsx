import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { Workbook } from "exceljs";

export const ResultsDownloadPage = () => {
  const { data: allResults, isLoading } = useQuery({
    queryKey: ["all-results"],
    queryFn: async () => {
      const { data } = await api.get("/admin/exams/results");
      console.log("data", data);
      return data;
    },
  });

  const [results, setResults] = useState([]);
  const [courseId, setCourseId] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (allResults) {
      setResults(allResults);
    }
  }, [allResults]);

  useEffect(() => {
    if (allResults) {
      const allCourses = allResults.map(
        (result) => result?.User?.course_enrolled
      );
      const uniqueCourses = Array.from(new Set(allCourses));
      setCourseId(uniqueCourses);
    }
  }, [allResults]);

  const handleDownloadResult = async (crsId) => {
    const filteredResults = results.filter(
      (result) => result?.User?.course_enrolled === crsId
    );

    const gradeOrder = { A: 1, B: 2, C: 3, F: 4 };
    filteredResults.sort((a, b) => {
      return gradeOrder[a?.grade] - gradeOrder[b?.grade];
    });

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

    filteredResults?.forEach((result) => {
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

        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-green-700"
              id="menu-button"
              onClick={() => setIsOpen(!isOpen)}
            >
              Download Results
              <svg
                className="-mr-1 size-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          {isOpen && (
            <div
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabindex="-1"
            >
              <div className="py-1" role="none">
                {courseId?.map((crsId, index) => (
                  <a
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabindex="-1"
                    id={`menu-item-${index}`}
                    key={index}
                  >
                    <button
                      onClick={() => handleDownloadResult(crsId)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {crsId}
                    </button>
                  </a>
                ))}

                {/* 
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabindex="-1"
                id="menu-item-0"
              >
                Account settings
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabindex="-1"
                id="menu-item-1"
              >
                Support
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabindex="-1"
                id="menu-item-2"
              >
                License
              </a>
              <form method="POST" action="#" role="none">
                <button
                  type="submit"
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-3"
                >
                  Sign out
                </button>
              </form> */}
              </div>
            </div>
          )}
        </div>
        {/* <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
          onClick={handleDownloadResults}
        >
          Download Results
        </button>
        <ul
          className="hidden absolute bg-white shadow-md p-2 w-48"
          id="download-results-dropdown"
        >
          {courseId?.map((crsId, index) => (
            <li key={index}>
              <button
                onClick={() =>
                  handleDownloadResult(crsId)
                }
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                {crsId}
              </button>
            </li>
          ))}
        </ul> */}
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
