import { REGISTER, VERIFY_EMAIL } from "@/api/clientURL";
import AuthSubmitButton from "@/components/molecules/AuthSubmitButton";
import UIPasswordInput from "@/components/molecules/formInputs/UIPasswordInput";
import UITextInput from "@/components/molecules/formInputs/UITextInput";
import useUserAuthStore from "@/store/userAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { z } from "zod";

const emailLoginSchema = z.object({
  userEmail: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const phoneLoginSchema = z.object({
  userPhoneNumber: z.string().length(11, "Phone number must be 11 digits"),
  password: z.string().min(1, "Password is required"),
});

type TEmailLogin = z.infer<typeof emailLoginSchema>;
type TPhoneLogin = z.infer<typeof phoneLoginSchema>;

const UserLogin: React.FC = () => {
  const { login, isLoggedIn } = useUserAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"email" | "phone">("email");

  const emailForm = useForm<TEmailLogin>({
    resolver: zodResolver(emailLoginSchema),
  });

  const phoneForm = useForm<TPhoneLogin>({
    resolver: zodResolver(phoneLoginSchema),
  });

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  const onEmailSubmit = async (data: TEmailLogin) => {
    await login({ userEmail: data.userEmail, password: data.password });
  };

  const onPhoneSubmit = async (data: TPhoneLogin) => {
    await login({
      userPhoneNumber: data.userPhoneNumber,
      password: data.password,
    });
  };

  const isSubmitting =
    emailForm.formState.isSubmitting || phoneForm.formState.isSubmitting;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-primary p-3 rounded-full">
                <FaSignInAlt className="text-white text-2xl" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm">Sign in to your account</p>
          </div>

          <div className="flex rounded-lg border border-gray-200 mb-6 overflow-hidden">
            {(["email", "phone"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  tab === t
                    ? "bg-primary text-white"
                    : "text-gray-500 hover:text-primary"
                }`}
              >
                {t === "email" ? "Email" : "Phone"}
              </button>
            ))}
          </div>

          {tab === "email" ? (
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="space-y-5"
            >
              <UITextInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                {...emailForm.register("userEmail")}
                error={emailForm.formState.errors.userEmail?.message}
              />
              <UIPasswordInput
                label="Password"
                placeholder="Enter your password"
                {...emailForm.register("password")}
                error={emailForm.formState.errors.password?.message}
              />
              <AuthSubmitButton
                loading={isSubmitting}
                loadingText="Signing in..."
                icon={<FaSignInAlt className="mr-2" />}
                label="Sign In"
              />
            </form>
          ) : (
            <form
              onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
              className="space-y-5"
            >
              <UITextInput
                label="Phone number"
                type="tel"
                placeholder="01XXXXXXXXX"
                {...phoneForm.register("userPhoneNumber")}
                error={phoneForm.formState.errors.userPhoneNumber?.message}
              />
              <UIPasswordInput
                label="Password"
                placeholder="Enter your password"
                {...phoneForm.register("password")}
                error={phoneForm.formState.errors.password?.message}
              />
              <AuthSubmitButton
                loading={isSubmitting}
                loadingText="Signing in..."
                icon={<FaSignInAlt className="mr-2" />}
                label="Sign In"
              />
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to={REGISTER}
              className="text-primary font-medium hover:underline"
            >
              Register
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            Need to verify your email?{" "}
            <Link
              to={VERIFY_EMAIL}
              className="text-primary font-medium hover:underline"
            >
              Verify here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
