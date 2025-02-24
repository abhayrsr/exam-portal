import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import backgroundImage from "../../src/assets/flag.jpg";
// import { useExamDetails } from '../hooks/useExamDetails';


export function ExamDetailsPage() {
    const { exam_id } = useParams();
    const { data: exam, isLoading } = useQuery({
        queryKey: ['exam-details', exam_id],
        queryFn: async () => {
          const { data } = await api.get(`/exams/${exam_id}`);
          console.log("questions", data)
          return data;
        },
      });

      if (isLoading) {
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading dashboard...</div>
          </div>
        );
      }
  
    return (
      <div
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}>
      <div className="container mx-auto p-4">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-green-600">{exam?.exam_name}</h1>
                <p className="mt-2 text-sm text-gray-500">{exam?.course_id}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex space-x-4">
                <Link to ={`/exams/take/${exam?.exam_id}`}>
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Take Exam
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }

export default ExamDetailsPage;