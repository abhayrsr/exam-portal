import { BrowserRouter, Routes, Route, useOutletContext } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ExamList } from './pages/ExamList';
import { ExamDetails } from './pages/ExamDetails';
import { EditExam } from './pages/EditExam';
import { ExamDetailsPage } from "./pages/ExamDetailsPage";
import { TakeExamPage } from "./pages/TakeExamPage";
import { CreateExam } from "./pages/CreateExam";
import { NotFound } from "./pages/NotFound";
import { ResultPage } from "./pages/ResultPage";
import { ResultsDownloadPage } from "./pages/ResultsDownloadPage";
import { AddUser } from "./pages/AddUser";
import { useEffect } from 'react';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />

              <Route path="/exams" element={<ExamList />} />
              <Route path="/exams/:exam_id" element={<ExamDetailsPage />} />
              <Route path="/exams/take/:exam_id" element={<TakeExamPageWrapper />} />
              <Route path="/exams/results/:exam_id" element={<ResultPage />} />
              <Route path="/results/download" element={<ResultsDownloadPage />} />

              <Route path="exams/:id" element={<ExamDetails />} />
              <Route
                path="exams/create"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <CreateExam />
                  </ProtectedRoute>
                }
              />
              <Route
                path="exams/edit"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <EditExam />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/user/add"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AddUser />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function TakeExamPageWrapper() {
  const { setIsExamInProgress } = useOutletContext<{ setIsExamInProgress: (value: boolean) => void }>();

  useEffect(() => {
    setIsExamInProgress(true);
    return () => setIsExamInProgress(false);
  }, [setIsExamInProgress]);

  return <TakeExamPage />;
}

export default App;