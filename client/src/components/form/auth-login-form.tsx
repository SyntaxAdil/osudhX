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
import { Eye, EyeOff, Loader2, UserRound, Store } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";

import Logo from "../ui/logo";
import { signIn } from "@/lib/auth-client";
import type { LoginFormData } from "@/types/user";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [isShowPass, setIsShowPass] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState<
    "customer" | "seller" | null
  >(null);

  const {
    register,
    handleSubmit,
    setValue,
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
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
      );
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);

      await signIn.social({
        provider: "google",
        callbackURL: "https://osudhx.vercel.app/dashboard",
        errorCallbackURL:
          "https://osudhx.vercel.app/login?error=oauth",
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

  const handleDemoLogin = async (
    type: "customer" | "seller",
  ) => {
    try {
      setIsDemoLoading(type);

      const email =
        type === "customer"
          ? "demo.customer@osudhx.com"
          : "demo.seller@osudhx.com";

      const password =
        type === "customer"
          ? "customer@123"
          : "seller@123";

      setValue("email", email);
      setValue("password", password);

      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        toast.error(
          res.error.message || "Demo login failed",
        );
        return;
      }

      toast.success(
        type === "customer"
          ? "Demo customer login successful!"
          : "Demo seller login successful!",
      );

      router.push("/");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Demo login failed",
      );
    } finally {
      setIsDemoLoading(null);
    }
  };

  return (
    <Card className="my-8 w-full max-w-md border-border/60 bg-card/80 text-card-foreground shadow-2xl backdrop-blur-xl">
      <CardHeader className="space-y-3 pb-3 pt-8 text-center">
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

      <CardContent className="px-6 pb-6 pt-2">
        <div className="space-y-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
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
                className="h-10 border-border/80 bg-background/50 text-sm focus-visible:ring-primary"
              />

              {errors.email && (
                <p className="mt-1 text-[11px] font-medium text-destructive">
                  {errors.email.message}
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
                  })}
                  className="h-10 border-border/80 bg-background/50 pr-10 text-sm focus-visible:ring-primary"
                />

                <button
                  type="button"
                  onClick={() =>
                    setIsShowPass((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground/70 transition-colors hover:text-foreground"
                  aria-label={
                    isShowPass
                      ? "Hide password"
                      : "Show password"
                  }
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
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={
                isSubmitting ||
                isGoogleLoading ||
                isDemoLoading !== null
              }
              className="mt-3 h-10 w-full cursor-pointer text-sm font-semibold shadow-sm transition-all duration-200"
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

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-border/60" />

            <span className="mx-4 flex-shrink text-[10px] uppercase tracking-widest text-muted-foreground">
              Demo Login
            </span>

            <div className="flex-grow border-t border-border/60" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={
                isSubmitting ||
                isGoogleLoading ||
                isDemoLoading !== null
              }
              onClick={() => handleDemoLogin("customer")}
              className="h-10 cursor-pointer rounded-xl border-border/80 bg-background/50 text-xs font-medium transition-all duration-200 hover:bg-muted/50"
            >
              {isDemoLoading === "customer" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserRound className="mr-2 h-4 w-4" />
              )}

              Demo Customer
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={
                isSubmitting ||
                isGoogleLoading ||
                isDemoLoading !== null
              }
              onClick={() => handleDemoLogin("seller")}
              className="h-10 cursor-pointer rounded-xl border-border/80 bg-background/50 text-xs font-medium transition-all duration-200 hover:bg-muted/50"
            >
              {isDemoLoading === "seller" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Store className="mr-2 h-4 w-4" />
              )}

              Demo Seller
            </Button>
          </div>

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
            disabled={
              isGoogleLoading ||
              isSubmitting ||
              isDemoLoading !== null
            }
            onClick={handleGoogleSignIn}
            className="h-10 w-full cursor-pointer rounded-xl border-border/80 bg-background/50 text-sm font-medium transition-all duration-200 hover:bg-muted/50"
          >
            {isGoogleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FcGoogle className="mr-2 h-4 w-4" />
            )}

            {isGoogleLoading
              ? "Signing in with Google..."
              : "Continue with Google"}
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center border-t border-border/40 bg-muted/20 pb-6 pt-4 text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-1.5">
          <span>Don&apos;t have an account?</span>

          <Link
            href="/register"
            className="cursor-pointer font-semibold text-primary transition-colors hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}