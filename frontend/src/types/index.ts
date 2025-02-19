export interface User {
  user_id: string;
  army_number: string;
  name: string;
  role: 'Student' | 'Admin';
}

export interface Exam {
  exam_name: string;
  course_id: string;
  duration: number;
  questions: Question[];
}

export interface Question {
  id: string;
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