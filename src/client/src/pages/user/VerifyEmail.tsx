import { LOGIN } from "@/api/clientURL";
import UITextInput from "@/components/molecules/formInputs/UITextInput";
import useUserAuthStore from "@/store/userAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEnvelopeOpenText, FaSpinner } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router";
import { z } from "zod";

const verifySchema = z.object({
  userEmail: z.email("Enter a valid email"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type TVerifyForm = z.infer<typeof verifySchema>;

const VerifyEmail: React.FC = () => {
  const { verifyEmail, resendOtp } = useUserAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<TVerifyForm>({
    defaultValues: {
      userEmail: searchParams.get("email") ?? "",
    },
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: TVerifyForm) => {
    const success = await verifyEmail({
      userEmail: data.userEmail,
      otp: data.otp,
    });
    if (success) navigate(LOGIN);
  };

  const handleResend = async () => {
    const email = getValues("userEmail");
    if (!email) return;
    setResending(true);
    await resendOtp({ userEmail: email });
    setResending(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-primary p-3 rounded-full">
                <FaEnvelopeOpenText className="text-white text-2xl" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Verify your email
            </h1>
            <p className="text-gray-500 text-sm">
              Enter the 4-digit code sent to your email
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <UITextInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              {...register("userEmail")}
              error={errors.userEmail?.message}
            />

            <UITextInput
              label="OTP code"
              placeholder="4-digit code"
              maxLength={6}
              {...register("otp")}
              error={errors.otp?.message}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center ${
                isSubmitting
                  ? "bg-primary/60 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                  Verifying...
                </>
              ) : (
                "Verify email"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already verified?{" "}
            <Link
              to={LOGIN}
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
