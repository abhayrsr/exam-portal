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
                    {stats?.exams?.length ?? 0}
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

        {role !== "Admin" && (<div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Link to={`/exams/results/${userId}`}>
                <div className="flex-shrink-0">
                  <Trophy className="h-6 w-6 text-indigo-600" />
                </div>
              </Link>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Check Results
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.completedExams ?? 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>)}
      </div>

      {/* <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <div className="mt-4 divide-y divide-gray-200">
            {stats?.recentActivity?.map((activity: Activity) => (
              <div key={activity.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* <div className="space-y-6">
  <h2 className="text-lg font-bold">Upcoming Exams</h2>
  <ul>
    {stats?.data?.map((exam: ExamDetails ) => (
      <li key={exam.exam_id}>
        <div className="flex items-center">
          <div className="text-lg">{exam.exam_name.slice(0,2)}</div>
          <div className="text-gray-500">{exam.course_id}</div>
        </div>
      </li>
    ))}
  </ul>
</div> */}
    </div>
  );
}
