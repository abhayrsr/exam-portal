import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ResultsResponse } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/axios";
import { Clock } from "lucide-react";

export const ResultPage = () => {
  const { userId } = useAuth();
  const { data: results, isLoading } = useQuery<ResultsResponse>({
    queryKey: ["results"],
    queryFn: async () => {
      const { data } = await api.get(`/results/${userId}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Your Exam Results</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {results?.map((result) => (
            <li key={result.result_id} className="hover:bg-gray-100 transition duration-200">
              
                <div className="px-6 py-5">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col space-y-1">
                      <h2 className="text-lg font-semibold text-indigo-600">{result.Exam.exam_name}</h2>
                      <div className="text-gray-600 flex items-center space-x-4 mt-2">
                        <span className="flex items-center">
                          📊 <span className="ml-1">Score: {result.score}</span>
                        </span>
                        <span className="flex items-center">
                          📈 <span className="ml-1">Percentage: {result.percentage}%</span>
                        </span>
                        <span className="flex items-center">
                          🎓 <span className="ml-1">Grade: {result.grade}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" /> {new Date(result.createdAt).toDateString()}
                    </div>
                  </div>
                </div>
            
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultPage;
