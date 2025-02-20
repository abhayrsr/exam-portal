export interface User {
  user_id: string;
  army_number: string;
  name: string;
  role: 'Student' | 'Admin';
}

export interface Exam {
  exam_id?: number | string;
  exam_name: string;
  course_id: string;
  duration: number;
  questions: Question[];
}

export interface ExamDetails{
  exam_id: number;
  exam_name: string;
  course_id: string;
  Questions: Question[];
}

export interface Question {
  id?: number | string;
  question_id?: number;
  question_text: string;
  question_type: 'MCQ' | 'True/False' | 'Fill in the Blank';
  options?: string[];
  correct_answer?: string;
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