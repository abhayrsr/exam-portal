import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import type { Exam } from '../types';
import { Clock, Calendar, HelpCircle } from 'lucide-react';

export function ExamDetails() {
  const { id } = useParams();
  const { data: exam, isLoading } = useQuery({
    queryKey: ['exam', id],
    queryFn: async () => {
      const { data } = await api.get<Exam>(`/exams/${id}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading exam details...</div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Exam not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{exam.description}</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                Duration: {exam.duration} minutes
              </div>
            </div>
            <div className="sm:col-span-1">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                Start Time: {new Date(exam.startTime).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Questions</h2>
            <div className="mt-4 space-y-6">
              {exam.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="bg-gray-50 p-4 rounded-lg space-y-2"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <HelpCircle className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        Question {index + 1} ({question.points} points)
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {question.text}
                      </p>
                      {question.type === 'multiple-choice' && (
                        <div className="mt-4 space-y-2">
                          {question.options?.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center"
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                className="h-4 w-4 text-indigo-600 border-gray-300"
                              />
                              <label className="ml-3 text-sm text-gray-600">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      {question.type === 'Fill in the Blank' && (
                        <textarea
                          rows={4}
                          className="mt-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter your answer here..."
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}