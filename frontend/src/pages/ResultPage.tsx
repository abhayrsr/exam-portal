// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { ResultsResponse } from "../types";
// import { useAuth } from "../contexts/AuthContext";
// import { api } from "../lib/axios";
// import { Link } from "react-router-dom";
// import { Clock } from "lucide-react";

// export const ResultPage = () => {
//   const { userId } = useAuth();
//   const { data: results, isLoading } = useQuery<ResultsResponse>({
//     queryKey: ["results"],
//     queryFn: async () => {
//       const { data } = await api.get(`/results/${userId}`);
//       console.log("results", results);
//       return data;
//     },
//   });

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-gray-500">Loading results...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-900">Results</h1>
//       </div>

//       <div className="bg-white shadow overflow-hidden sm:rounded-md">
//         <ul className="divide-y divide-gray-200">
//           {results?.map((result) => (
//             <li key={result.result_id}>
//               <Link
//                 to={`/results/${result.result_id}`}
//                 className="block hover:bg-gray-50"
//               >
//                 <div className="px-4 py-4 sm:px-6">
//                   <div className="flex items-center justify-between">
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-indigo-600 truncate flex justify-between">
//                         <span>
//                           <i className="fas fa-book mr-1 text-gray-500"></i>{" "}
//                           {result.Exam.exam_name}
//                         </span>
//                         <span>
//                           <i className="fas fa-star mr-1 text-gray-500"></i>{" "}
//                           Score: {result.score}
//                         </span>
//                         <span>
//                           <i className="fas fa-percent mr-1 text-gray-500"></i>{" "}
//                           Percentage {result.percentage}%
//                         </span>
//                         <span>
//                           <i className="fas fa-graduation-cap mr-1 text-gray-500"></i>{" "}
//                           Grade: {result.grade}
//                         </span>
//                       </p>
//                       {/* <p className="text-sm font-medium text-indigo-600 truncate">
//                         {result.Exam.exam_name}
//                       </p>
//                       <p className="mt-2 text-sm text-gray-500">
//                         Score: {result.score} ({result.percentage}%)
//                       </p>
//                     </div>
//                     <div className="ml-4 flex-shrink-0 flex space-x-4">
//                       <div className="flex items-center text-sm text-gray-500">
//                         <Clock className="h-4 w-4 mr-1" />
//                         {result.grade}
//                       </div> */}
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default ResultPage;


import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ResultsResponse } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/axios";
import { Link } from "react-router-dom";
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
              <Link to={`/results/${result.result_id}`} className="block">
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
                      <Clock className="h-4 w-4 mr-1" /> {result.createdAt}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultPage;
