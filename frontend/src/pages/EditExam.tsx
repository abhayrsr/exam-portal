import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '../lib/axios';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import type { Exam, Question } from '../types';

interface ExamForm {
  title: string;
  courseId: string;
  duration: number;
  questions: Question[];
}

export function EditExam() {
  const navigate = useNavigate();
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const { data: exams = [], isLoading: isLoadingExams, refetch: refetchExams } = useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Exam[] }>('/admin/exams');
      console.log('Fetched exams:', data.data); // Log the fetched exams
      return data.data || [];
    },
  });

  const { data: exam, isLoading: isLoadingExam, refetch: refetchExam } = useQuery({
    queryKey: ['exam', selectedExamId],
    queryFn: async () => {
      if (selectedExamId) {
        const { data } = await api.get<{ data: Exam[] }>(`/admin/exams/${selectedExamId}`);
        console.log('Fetched exam:', data.data); // Log the fetched exam
        return data.data[0];
      }
      return null;
    },
    enabled: !!selectedExamId,
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ExamForm>();

  useEffect(() => {
    if (exam) {
      setValue('title', exam.exam_name);
      setValue('courseId', exam.course_id);
      setValue('duration', exam.duration);
      setQuestions(exam.questions || []);
    }
  }, [exam, setValue]);

  const updateExamMutation = useMutation({
    mutationFn: async (data: ExamForm) => {
      const { data: response } = await api.put(`/admin/exams/${selectedExamId}`, {
        title: data.title,
        course_id: data.courseId,
        duration: data.duration,
        questions: questions,
      });
      return response;
    },
    onSuccess: () => {
      setSelectedExamId(null);
      refetchExams();
    },
  });

  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      question_text: '',
      question_type: 'MCQ',
      options: ['', '', '', ''],
      correct_answer: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const onSubmit = (data: ExamForm) => {
    updateExamMutation.mutate(data);
  };

  if (isLoadingExams) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {!selectedExamId ? (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900">Exams</h1>
          <div className="mt-6 space-y-4">
            {exams.map((exam) => (
              <div key={exam.exam_id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{exam.exam_name}</h2>
                  <p className="text-sm text-gray-500">Course ID: {exam.course_id}</p>
                </div>
                <button
                  onClick={() => setSelectedExamId(exam.exam_id?.toString() ?? null)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white shadow sm:rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Exam</h1>
              <p className="mt-1 text-sm text-gray-500">
                Update the details below to edit the exam.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  {...register('title', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">Title is required</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="courseId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Course ID
                </label>
                <input 
                  type="text"
                  {...register('courseId', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.courseId && (
                  <p className="mt-1 text-sm text-red-600">
                    Course ID is required
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    {...register('duration', { required: true, min: 1 })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-600">
                      Duration is required and must be at least 1 minute
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Questions</h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </button>
              </div>

              <div className="mt-6 space-y-6">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="bg-gray-50 p-4 rounded-lg space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <HelpCircle className="h-5 w-5 text-indigo-600" />
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          Question {index + 1}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
              
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Question Text
                        </label>
                        <input
                          type="text"
                          value={question.question_text}
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].question_text = e.target.value;
                            setQuestions(newQuestions);
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
              
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Question Type
                        </label>
                        <select
                          value={question.question_type}
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            const typeValue = e.target.value;
                            if (typeValue === 'MCQ' || typeValue === 'True/False' || typeValue === 'Fill in the Blank') {
                              newQuestions[index].question_type = typeValue;
                              setQuestions(newQuestions);
                            }
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="MCQ">Multiple Choice</option>
                          <option value="True/False">True/False</option>
                          <option value="Fill in the Blank">Fill in the Blank</option>
                        </select>
                      </div>
              
                      {question.question_type === 'MCQ' && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Options
                          </label>
                          {question.options?.map((option, optionIndex) => (
                            <input
                              key={optionIndex}
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newQuestions = [...questions];
                                if (newQuestions[index].options) {
                                  newQuestions[index].options![optionIndex] =
                                    e.target.value;
                                  setQuestions(newQuestions);
                                }
                              }}
                              placeholder={`Option ${optionIndex + 1}`}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          ))}
                        </div>
                      )}
              
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Correct Answer
                        </label>
                        <input
                          type="text"
                          value={question.correct_answer}
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].correct_answer = e.target.value;
                            setQuestions(newQuestions);
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updateExamMutation.isPending}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {updateExamMutation.isPending ? 'Updating...' : 'Update Exam'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedExamId(null)}
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}