"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Logo from "../ui/logo";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signUp, signIn } from "../../lib/auth-client";
import { RegisterFormData } from "../../types/user";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export function RegisterForm() {
  const [isShowPass, setIsShowPass] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: "/",
      });

      if (res.error) {
        toast.error(res.error.message || "Failed to create account");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);

      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to sign in with Google",
      );

      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="my-16 w-full max-w-md border-border/60 bg-card/80 text-card-foreground shadow-2xl backdrop-blur-xl">
      <CardHeader className="space-y-3 pt-8 pb-3 text-center">
        <div className="mx-auto flex justify-center scale-105 transition-transform duration-300 hover:scale-110">
          <Logo />
        </div>

        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Create an account
          </CardTitle>

          <CardDescription className="text-xs text-muted-foreground">
            Enter your details below to set up your OsudhX credentials
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-6 pt-2 pb-6">
        <div className="space-y-4">
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-border/60" />

            <span className="mx-4 flex-shrink text-[10px] uppercase tracking-widest text-muted-foreground">
              continue with email
            </span>

            <div className="flex-grow border-t border-border/60" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Full Name
              </Label>

              <Input
                id="name"
                type="text"
                placeholder="Abdur Rahman"
                {...register("name", {
                  required: "Full name is required",
                })}
                className="h-10 rounded-xl border-border/80 bg-background/50 text-sm focus-visible:ring-primary"
              />

              {errors.name && (
                <p className="mt-1 text-[11px] font-medium text-destructive">
                  {String(errors.name.message)}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Email Address
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email", {
                  required: "Email is required",
                })}
                className="h-10 rounded-xl border-border/80 bg-background/50 text-sm focus-visible:ring-primary"
              />

              {errors.email && (
                <p className="mt-1 text-[11px] font-medium text-destructive">
                  {String(errors.email.message)}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={isShowPass ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="h-10 rounded-xl border-border/80 bg-background/50 pr-10 text-sm focus-visible:ring-primary"
                />

                <button
                  type="button"
                  onClick={() => setIsShowPass((prev) => !prev)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground/70 transition-colors hover:text-foreground"
                  aria-label={isShowPass ? "Hide password" : "Show password"}
                >
                  {isShowPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-[11px] font-medium text-destructive">
                  {String(errors.password.message)}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-3 h-10 w-full cursor-pointer rounded-xl text-sm font-semibold shadow-sm transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-border/60" />

            <span className="mx-4 flex-shrink text-[10px] uppercase tracking-widest text-muted-foreground">
              or
            </span>

            <div className="flex-grow border-t border-border/60" />
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={isGoogleLoading}
            onClick={handleGoogleSignIn}
            className="h-10 w-full cursor-pointer rounded-xl border-border/80 bg-background/50 text-sm font-medium transition-all duration-200 hover:bg-muted/50"
          >
            {isGoogleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FcGoogle className="mr-2 h-4 w-4" />
            )}
            Continue with Google
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center border-t border-border/40 bg-muted/20 pt-4 pb-6 text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-1.5">
          <span>Already have an account?</span>

          <Link
            href="/login"
            className="cursor-pointer font-semibold text-primary transition-colors hover:underline"
          >
            Sign In
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
