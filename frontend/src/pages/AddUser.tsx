import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/axios';
import backgroundImage from "../../src/assets/flag.jpg";

interface UserForm {
  username: string;
  password: string;
  army_number: string;
  userrank: string;
  role: 'Admin' | 'Student';
  course_enrolled: string;
  coy: string;
}

export function AddUser() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<UserForm>();
  const [message, setMessage] = useState<string | null>(null);

  const addUserMutation = useMutation({
    mutationFn: async (data: UserForm) => {
      const { data: response } = await api.post('/admin/user/add', data);
      return response;
    },
    onSuccess: () => {
      setMessage('User added successfully');
    },
    onError: (error: any) => {
      setMessage(error.response?.data?.error || 'Failed to add user');
    },
  });

  const onSubmit = (data: UserForm) => {
    setMessage(null);
    addUserMutation.mutate(data);
  };

  return (
    <div
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="space-y-6">
        <div className="bg-white shadow sm:rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
              <p className="mt-1 text-sm text-gray-500">
                Fill in the details below to add a new user.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  {...register('username', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600 sm:text-sm bg-gray-100 h-8 px-3"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">Username is required</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  {...register('password', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600 sm:text-sm bg-gray-100 h-8 px-3"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">Password is required</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="army_number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Army Number
                </label>
                <input
                  type="text"
                  {...register('army_number', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600 sm:text-sm bg-gray-100 h-8 px-3"
                />
                {errors.army_number && (
                  <p className="mt-1 text-sm text-red-600">Army Number is required</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="userrank"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rank
                </label>
                <input
                  type="text"
                  {...register('userrank', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600 sm:text-sm bg-gray-100 h-8 px-3"
                />
                {errors.userrank && (
                  <p className="mt-1 text-sm text-red-600">Rank is required</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  {...register('role', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600 sm:text-sm bg-gray-100 h-8 px-3"
                >
                  <option value="Student">Student</option>
                  <option value="Admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">Role is required</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="course_enrolled"
                  className="block text-sm font-medium text-gray-700"
                >
                  Course Enrolled
                </label>
                <input
                  type="text"
                  {...register('course_enrolled', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600 sm:text-sm bg-gray-100 h-8 px-3"
                />
                {errors.course_enrolled && (
                  <p className="mt-1 text-sm text-red-600">Course Enrolled is required</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="coy"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company
                </label>
                <input
                  type="text"
                  {...register('coy', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600 sm:text-sm bg-gray-100 h-8 px-3"
                />
                {errors.coy && (
                  <p className="mt-1 text-sm text-red-600">Company is required</p>
                )}
              </div>
            </div>

            {message && (
              <div className="mt-4 text-sm text-center text-red-600">
                {message}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={addUserMutation.isPending}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
              >
                {addUserMutation.isPending ? 'Adding...' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}