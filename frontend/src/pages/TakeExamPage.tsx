import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {Exam} from '../types';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

// interface Question {
//   question_id: number;
//   exam_id: number;
//   question_text: string;
//   question_type: 'MCQ' | 'True/False' | 'Fill in the Blank';
//   options: string[] | null;
//   correct_answer: string;
// }

export function TakeExamPage() {
  const { userId } = useAuth();
  const { exam_id } = useParams<{ exam_id: string }>();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<number>(0); // 30 minutes in seconds
  const [answers, setAnswers] = useState<Record<number, string>>({});

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
  
    window.onbeforeunload = () => {
      return 'Are you sure you want to leave the exam page?';
    };

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

    return () => {
      window.onbeforeunload = null;
      document.oncopy = null;
      document.onpaste = null;
      document.oncontextmenu = null;
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
        exam_id: parseInt(exam_id,  10),
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Take Exam</h1>
        <div className="text-red-500 font-semibold">Time Left: {formatTime(timeLeft)}</div>
      </div>

      {exam?.questions?.map((q) => (
        <div key={q.question_id} className="mb-6 p-4 border rounded-lg">
          <h2 className="text-lg font-semibold">{q.question_text}</h2>

          {q.question_type === 'MCQ' && (
            <div className="mt-2 space-y-2">
              {q.options?.map((option) => (
                <label key={option} className="block">
                  <input
                    type="radio"
                    name={`question-${q.question_id}`}
                    value={option}
                    checked={answers[q.question_id] === option}
                    onChange={() => handleAnswerChange(q.question_id, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {q.question_type === 'True/False' && (
            <div className="mt-2 space-y-2">
              {['True', 'False'].map((option) => (
                <label key={option} className="block">
                  <input
                    type="radio"
                    name={`question-${q.question_id}`}
                    value={option}
                    checked={answers[q.question_id] === option}
                    onChange={() => handleAnswerChange(q.question_id, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {q.question_type === 'Fill in the Blank' && (
            <input
              type="text"
              className="mt-2 p-2 border rounded w-full"
              placeholder="Your answer"
              value={answers[q.question_id] || ''}
              onChange={(e) => handleAnswerChange(q.question_id, e.target.value)}
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit Exam
      </button>
    </div>
  );
}

export default TakeExamPage;
