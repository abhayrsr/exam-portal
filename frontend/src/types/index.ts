export interface User {
  user_id: string;
  army_number: string;
  name: string;
  role: 'Student' | 'Admin';
}

export interface Exam {
  exam_id: string;
  exam_name: string;
  course_id: string;
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
  question_id: number;
  exam_id: number;
  question_text: string;
  question_type: 'MCQ' | 'True/False' | 'Fill in the Blank';
  duration: number;
  options: string[] | null;
  correct_answer: string;
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