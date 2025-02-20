import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { api } from '../lib/axios';
import type { Exam } from '../types';
import { Clock } from 'lucide-react';

export function ExamList() {
  const { role } = useAuth();
  const { data: exams, isLoading } = useQuery({
    queryKey: ['exams', role],
    queryFn: async () => {
      const endpoint = role === 'Admin' ? '/admin/exams' : '/exams';
      const { data } = await api.get<{ exams: Exam[]}>(endpoint);
      console.log("data", data.exams);
      return data.exams;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading exams...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Available Exams</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {exams?.map((exam) => (
            <li key={exam.exam_id}>
              <Link
                to={`/exams/${exam.exam_id}`}
                className="block hover:bg-gray-50"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {exam.exam_name}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        {exam.course_id}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {exam.duration} minutes
                      </div>
                      {/* <div className="flex items-center text-sm text-gray-500">
                      {/* <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(exam.upload_date).toLocaleDateString()}
                      </div> */}
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
}