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
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import Logo from "../ui/logo";
import { signIn } from "@/lib/auth-client";
import type { LoginFormData } from "@/types/user";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [isShowPass, setIsShowPass] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();
  const router = useRouter();
  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (res.error) {
        toast.error(res.error.message || "Invalid email or password");
        return;
      }

      toast.success("Signed in successfully!");
      router.push("/");
      // window.location.href = "/";
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    }
  };

  return (
    <Card className="w-full max-w-md border-border/60 bg-card/80 backdrop-blur-xl text-card-foreground shadow-2xl">
      <CardHeader className="space-y-3 pt-8 pb-3 text-center">
        <div className="mx-auto flex justify-center scale-105 transition-transform duration-300 hover:scale-110">
          <Logo />
        </div>

        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back
          </CardTitle>

          <CardDescription className="text-xs text-muted-foreground">
            Enter your credentials to access your OsudhX account
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-2 pb-6 px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
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
              className="h-10 text-sm bg-background/50 border-border/80 focus-visible:ring-primary"
            />

            {errors.email && (
              <p className="text-[11px] font-medium text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
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
                })}
                className="h-10 pr-10 text-sm bg-background/50 border-border/80 focus-visible:ring-primary"
              />

              <button
                type="button"
                onClick={() => setIsShowPass((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground/70 transition-colors hover:text-foreground"
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
              <p className="text-[11px] font-medium text-destructive mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 font-semibold text-sm cursor-pointer shadow-sm transition-all duration-200 mt-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center pt-4 pb-6 border-t border-border/40 text-xs text-muted-foreground bg-muted/20">
        <div className="flex items-center justify-center gap-1.5">
          <span>Don&apos;t have an account?</span>

          <Link
            href="/register"
            className="font-semibold text-primary transition-colors hover:underline cursor-pointer"
          >
            Sign Up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
