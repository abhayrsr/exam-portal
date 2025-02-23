import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { BookOpen, Clock, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
// import { Activity, ExamDetails } from '../types';

export function Dashboard() {
  const { user, role, userId } = useAuth();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const endpoint = role === "Admin" ? "/admin/exams" : "/exams";
      const { data } = await api.get(endpoint);
      console.log("exam", data);
      if (role === "Admin") {
        return data.data;
      }
      else{
        return data.exams;
      }
    },
  });

  const { data: result } = useQuery({
    queryKey: ["dashboard-result"],
    queryFn: async () => {
      const { data } = await api.get(`/results/${userId}`);
      console.log("result", data);
      return data;
    },
  });

  console.log("stats", stats);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back, {user?.name}
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Exams
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.length ?? 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Upcoming Exams
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.upcomingExams ?? 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {role !== "Admin" && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <Link to={`/exams/results/${userId}`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Trophy className="h-6 w-6 text-indigo-600" />
                  </div>

                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Check Results
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {result?.length ?? 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
