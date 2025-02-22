import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Exam } from '../types';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

export function TakeExamPage() {
  const { userId } = useAuth();
  const { exam_id } = useParams<{ exam_id: string }>();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<number>(0); // 30 minutes in seconds
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const { data: exam, isLoading } = useQuery<Exam>({
    queryKey: ['exam-questions', exam_id],
    queryFn: async () => {
      const { data } = await api.get(`/exams/${exam_id}`);
      return data;
    },
  });

  useEffect(() => {
    if (exam?.duration) {
      setTimeLeft(exam.duration * 60); // Convert minutes to seconds
    }
  }, [exam?.duration]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        alert('You are not allowed to leave the fullscreen during the exam.');
        document.documentElement.requestFullscreen();
      }
    };

    document.documentElement.requestFullscreen();
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    window.onbeforeunload = () => 'Are you sure you want to leave the exam page?';

    document.oncopy = (e) => {
      e.preventDefault();
      alert('Copying is not allowed on this page.');
    };
    document.onpaste = (e) => {
      e.preventDefault();
      alert('Pasting is not allowed on this page.');
    };
    document.oncontextmenu = (e) => {
      e.preventDefault();
      alert('Right-clicking is not allowed on this page.');
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert('Switching tabs is not allowed during the exam.');
        document.documentElement.requestFullscreen();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.onbeforeunload = null;
      document.oncopy = null;
      document.onpaste = null;
      document.oncontextmenu = null;
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (question_id: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [question_id]: answer }));
  };

  const handleSubmit = async () => {
    try {
      if (!exam_id) {
        console.error('exam_id is undefined');
        return;
      }

      const payload = {
        user_id: userId,
        exam_id: parseInt(exam_id, 10),
        answers: Object.entries(answers).map(([question_id, answer]) => ({
          question_id: parseInt(question_id, 10),
          answer,
        })),
      };

      console.log("Submitting payload:", payload);

      await api.post(`/results/submit_exam`, payload);
      alert('Exam submitted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit exam. Try again.');
    }
  };

  if (isLoading) return <div>Loading questions...</div>;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQuestion = exam?.questions[currentQuestionIndex];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Take Exam</h1>
        <div className="text-red-500 font-semibold">Time Left: {formatTime(timeLeft)}</div>
      </div>

      <div className="flex">
        <div className="w-3/4">
          {currentQuestion && (
            <div className="mb-6 p-4 border rounded-lg">
              <h2 className="text-lg font-semibold">{currentQuestion.question_text}</h2>

              {currentQuestion.question_type === 'MCQ' && (
                <ol className="mt-2 space-y-2 list-decimal list-inside">
                  {currentQuestion.options?.map((option, index) => (
                    <li key={index}>
                      <label className="block">
                        <input
                          type="radio"
                          name={`question-${currentQuestion.question_id}`}
                          value={option}
                          checked={answers[currentQuestion.question_id] === option}
                          onChange={() => handleAnswerChange(currentQuestion.question_id, option)}
                        />
                        {option}
                      </label>
                    </li>
                  ))}
                </ol>
              )}

              {currentQuestion.question_type === 'True/False' && (
                <div className="mt-2 space-y-2">
                  {['True', 'False'].map((option) => (
                    <label key={option} className="block">
                      <input
                        type="radio"
                        name={`question-${currentQuestion.question_id}`}
                        value={option}
                        checked={answers[currentQuestion.question_id] === option}
                        onChange={() => handleAnswerChange(currentQuestion.question_id, option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.question_type === 'Fill in the Blank' && (
                <input
                  type="text"
                  className="mt-2 p-2 border rounded w-full"
                  placeholder="Your answer"
                  value={answers[currentQuestion.question_id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.question_id, e.target.value)}
                />
              )}
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, exam?.questions.length - 1))}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              disabled={currentQuestionIndex === exam?.questions.length - 1}
            >
              Next
            </button>
          </div>
        </div>

        <div className="w-1/4 ml-4">
          <h2 className="text-lg font-semibold mb-2">Question Tracker</h2>
          <div className="grid grid-cols-5 gap-2">
            {exam?.questions.map((q, index) => (
              <button
                key={q.question_id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`p-2 rounded ${answers[q.question_id] ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Submit Exam
      </button>
    </div>
  );
}

export default TakeExamPage;