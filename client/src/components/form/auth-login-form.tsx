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
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Logo from "../ui/logo";

export function LoginForm() {
  const [isShowPass, setIsShowPass] = useState<boolean>(false);

  return (
    <Card className="w-full max-w-md border-border bg-card text-card-foreground shadow-sm">
      <CardHeader className="space-y-3 pt-6 pb-2 text-center">
        <div className="mx-auto flex justify-center">
          <Logo />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            Welcome back
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Enter your credentials to access your OsudhX account
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-4 pb-4">
        <form className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-medium">
                Password
              </Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={isShowPass ? "text" : "password"}
                placeholder="••••••••"
                required
                className="h-9 pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setIsShowPass((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                aria-label={isShowPass ? "Hide password" : "Show password"}
              >
                {isShowPass ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-9 font-medium cursor-pointer mt-2"
          >
            Sign In
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center pt-2 pb-6 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-1">
          <span>Don&apos;t have an account?</span>
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline cursor-pointer"
          >
            Sign Up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
