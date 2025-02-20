import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { ExamList } from "./pages/ExamList";
import { ExamDetails } from "./pages/ExamDetails";
import { ExamDetailsPage } from "./pages/ExamDetailsPage";
import { TakeExamPage } from "./pages/TakeExamPage";
import { CreateExam } from "./pages/CreateExam";
import { NotFound } from "./pages/NotFound";

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
              <Route path="/admin/exams" element={<ExamList />} />
              <Route path="/exams/:exam_id" element={<ExamDetailsPage />} />
              <Route path="/exams/take/:exam_id" element={<TakeExamPage />} />


              <Route path="exams/:id" element={<ExamDetails />} />
              <Route
                path="exams/create"
                element={
                  <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                    <CreateExam />
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

export default App;
