import { LOGIN, VERIFY_EMAIL } from "@/api/clientURL";
import UIPasswordInput from "@/components/molecules/formInputs/UIPasswordInput";
import UITextInput from "@/components/molecules/formInputs/UITextInput";
import useUserAuthStore from "@/store/userAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner, FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { z } from "zod";

const registerSchema = z
  .object({
    userName: z.string().min(1, "Name is required").max(50),
    userEmail: z.email("Enter a valid email"),
    userPhoneNumber: z
      .string()
      .length(11, "Phone number must be exactly 11 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    street: z.string().min(1, "Street / road is required").max(100),
    area: z.string().min(1, "Area / thana is required").max(100),
    city: z.string().min(1, "City / district is required").max(50),
    postalCode: z
      .string()
      .min(1, "Postal code is required")
      .max(10)
      .regex(/^\d+$/, "Postal code must be numeric"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type TRegisterForm = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const { register: registerUser, isLoggedIn } = useUserAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<TRegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  const onSubmit = async (data: TRegisterForm) => {
    const success = await registerUser({
      userName: data.userName,
      userEmail: data.userEmail,
      userPhoneNumber: data.userPhoneNumber,
      password: data.password,
      dateOfBirth: new Date(data.dateOfBirth),
      address: `${data.street}\n${data.area}\n${data.city}\n${data.postalCode}`,
    });

    if (success) {
      navigate(
        `${VERIFY_EMAIL}?email=${encodeURIComponent(getValues("userEmail"))}`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-primary p-3 rounded-full">
                <FaUserPlus className="text-white text-2xl" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Create account
            </h1>
            <p className="text-gray-500 text-sm">
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <UITextInput
              label="Full name"
              placeholder="John Doe"
              {...register("userName")}
              error={errors.userName?.message}
            />

            <UITextInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              {...register("userEmail")}
              error={errors.userEmail?.message}
            />

            <UITextInput
              label="Phone number"
              type="tel"
              placeholder="01XXXXXXXXX"
              {...register("userPhoneNumber")}
              error={errors.userPhoneNumber?.message}
            />

            <UIPasswordInput
              label="Password"
              placeholder="Minimum 6 characters"
              {...register("password")}
              error={errors.password?.message}
            />

            <UIPasswordInput
              label="Confirm password"
              placeholder="Repeat your password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            <UITextInput
              label="Date of birth"
              type="date"
              {...register("dateOfBirth")}
              error={errors.dateOfBirth?.message}
            />

            <UITextInput
              label="Street / Road"
              placeholder="House no., road name"
              {...register("street")}
              error={errors.street?.message}
            />

            <UITextInput
              label="Area / Thana"
              placeholder="Area or thana"
              {...register("area")}
              error={errors.area?.message}
            />

            <div className="grid grid-cols-2 gap-4">
              <UITextInput
                label="City / District"
                placeholder="Dhaka"
                {...register("city")}
                error={errors.city?.message}
              />
              <UITextInput
                label="Postal code"
                placeholder="1200"
                {...register("postalCode")}
                error={errors.postalCode?.message}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center mt-2 ${
                isSubmitting
                  ? "bg-primary/60 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  <FaUserPlus className="mr-2" />
                  Create account
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
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

export default Register;
