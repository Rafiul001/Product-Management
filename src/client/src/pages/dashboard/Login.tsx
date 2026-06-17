import UIPasswordInput from "@/components/molecules/formInputs/UIPasswordInput";
import UITextInput from "@/components/molecules/formInputs/UITextInput";
import useAdminAuthStore from "@/store/adminAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginBodySchemaValidator,
  type TLoginBodySchema,
} from "@shared/validators/admin.validator";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router";

const Login: React.FC = () => {
  const { login, isLoggedIn } = useAdminAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginBodySchemaValidator),
  });

  const onSubmit = async (data: TLoginBodySchema) => {
    await login(data);
  };

  useEffect(() => {
    if (isLoggedIn) navigate("/admin");
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-500 p-3 rounded-full">
                <FaSignInAlt className="text-white text-2xl" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600 text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <UITextInput
              label="Username"
              placeholder="Enter username"
              {...register("adminUserName")}
              error={errors.adminUserName?.message as string | undefined}
            />

            <UIPasswordInput
              label="Password"
              placeholder="Enter password"
              {...register("password")}
              error={errors.password?.message as string | undefined}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center ${
                isSubmitting
                  ? "bg-primary-400 cursor-not-allowed"
                  : "bg-primary-500 hover:bg-primary-600"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 22 6.477 22 12h-4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <FaSignInAlt className="mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
