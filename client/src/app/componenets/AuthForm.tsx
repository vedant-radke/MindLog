"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { saveToken } from "../../lib/auth";

type Mode = "login" | "signup";

interface Props {
  mode: Mode;
}

const getSchema = (mode: Mode) =>
  z.object({
    email: z.string().email(),
    password: z.string().min(3, "Minimum 3 characters"),
    ...(mode === "signup" && {
      name: z.string().min(1, "Name is required"),
    }),
  });

export default function AuthForm({ mode }: Props) {
  const router = useRouter();
  const schema = getSchema(mode);
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const url =
        mode === "login"
          ? "http://localhost:8001/api/auth/login"
          : "http://localhost:8001/api/auth/signup";

      const res = await axios.post(url, data);
      const token = res.data.token;

      if (token) {
        saveToken(token);
        toast.success(`${mode === "login" ? "Logged in" : "Account created"}!`);
        router.push("/journal");
      }
    } catch (err: any) {
      console.log("🔥 ERROR:", err.response?.data?.message);
      toast.error(err.response?.data?.message || "Auth failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {mode === "signup" && (
            <div>
              <Input
                placeholder="Name"
                {...register("name")}
                className="rounded-xl"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          )}

          <div>
            <Input
              placeholder="Email"
              type="email"
              {...register("email")}
              className="rounded-xl"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              placeholder="Password"
              type="password"
              {...register("password")}
              className="rounded-xl"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? mode === "login"
                ? "Logging in..."
                : "Signing up..."
              : mode === "login"
              ? "Login"
              : "Sign Up"}
          </Button>
        </form>

        <div className="text-center text-sm mt-4">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <Link href="/signup" className="text-blue-500 underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 underline">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
