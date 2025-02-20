export interface User {
  user_id: string;
  army_number: string;
  name: string;
  role: 'Student' | 'Admin';
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  startTime: string;
  endTime: string;
  questions: Question[];
  createdBy: string;
}

export interface ExamDetails{
  exam_id: number;
  exam_name: string;
  course_id: string;
  Questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'MCQ' | 'True/False' | 'Fill in the Blank';
  options?: string[];
  correctAnswer?: string;
  points: number;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  userId: string;
  answers: Answer[];
  submittedAt: string;
  score?: number;
}

export interface Answer {
  questionId: string;
  answer: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
}