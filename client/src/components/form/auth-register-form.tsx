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
import { signUp } from "../../lib/auth-client";
import { RegisterFormData } from "../../types/user";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const [isShowPass, setIsShowPass] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();
  const router=useRouter()
  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (res.error) {
        toast.error(res.error.message || "Failed to create account");
      } else {
        toast.success("Account created successfully!");
        router.push("/")
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    }
  };

  return (
    <Card className="w-full max-w-md border-border/60 bg-card/80 backdrop-blur-xl text-card-foreground shadow-2xl my-16">
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

      <CardContent className="pt-2 pb-6 px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="name"
              className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
            >
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Abdur Rahman"
              {...register("name", { required: "Full name is required" })}
              className="h-10 text-sm bg-background/50 border-border/80 focus-visible:ring-primary"
            />
            {errors.name && (
              <p className="text-[11px] font-medium text-destructive mt-1">
                {String(errors.name.message)}
              </p>
            )}
          </div>

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
              {...register("email", { required: "Email is required" })}
              className="h-10 text-sm bg-background/50 border-border/80 focus-visible:ring-primary"
            />
            {errors.email && (
              <p className="text-[11px] font-medium text-destructive mt-1">
                {String(errors.email.message)}
              </p>
            )}
          </div>

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
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="h-10 pr-10 text-sm bg-background/50 border-border/80 focus-visible:ring-primary"
              />
              <button
                type="button"
                onClick={() => setIsShowPass((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 transition-colors hover:text-foreground cursor-pointer"
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
                {String(errors.password.message)}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 font-semibold text-sm cursor-pointer shadow-sm transition-all duration-200 mt-3"
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
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center pt-4 pb-6 border-t border-border/40 text-xs text-muted-foreground bg-muted/20">
        <div className="flex items-center justify-center gap-1.5">
          <span>Already have an account?</span>
          <Link
            href="/login"
            className="font-semibold text-primary transition-colors hover:underline cursor-pointer"
          >
            Sign In
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
