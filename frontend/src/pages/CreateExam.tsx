import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import type { Exam, Question } from '../types';

interface ExamForm {
  title: string;
  description: string;
  duration: number;
  questions: Question[];
}

export function CreateExam() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const { register, handleSubmit, formState: { errors } } = useForm<ExamForm>();

  const createExamMutation = useMutation({
    mutationFn: async (data: Exam) => {
      const { data: response } = await api.post('/exams/upload-exam', data);
      return response;
    },
    onSuccess: () => {
      alert('Exam created successfully');
      navigate('/');
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
    const examData = {
      exam_name: data.title,
      course_id: data.description, // assuming course_id is stored in description field
      duration: data.duration,
      questions: questions,
    };
  
    createExamMutation.mutate(examData);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Exam</h1>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below to create a new exam.
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
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Course ID
              </label>
              <input 
                type="text"
                {...register('description', { required: true })}
                
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  Description is required
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

              {/* <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  {...register('startTime', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.startTime && (
                  <p className="mt-1 text-sm text-red-600">
                    Start time is required
                  </p>
                )}
              </div> */}
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
              disabled={createExamMutation.isPending}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {createExamMutation.isPending ? 'Creating...' : 'Create Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}