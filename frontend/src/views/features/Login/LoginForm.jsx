import React, { memo, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import ButtonSvg from "@/assets/svgs/ButtonSvg";

const LoginForm = ({
  className,
  handleChange,
  handleSubmit,
  handleBlur,
  values,
  touched,
  errors,
  info,
  setInfo,
}) => {
  const togglePasswordVisibility = useCallback(() => {
    setInfo((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  }, [info?.showPassword]);
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={values?.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={info?.isSubmitting}
                />

                {touched?.email && errors?.email && (
                  <span id="email-error" className="text-red-500 text-sm">
                    {errors?.email}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={info.showPassword ? "text" : "password"}
                    placeholder="*******"
                    value={values?.password}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    onBlur={handleBlur}
                    readOnly={info?.isSubmitting}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={togglePasswordVisibility}
                  >
                    {info?.showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {touched?.password && errors?.password && (
                  <span id="email-error" className="text-red-500 text-sm">
                    {errors?.password}
                  </span>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={info?.isSubmitting}
              >
                {info?.isSubmitting && <ButtonSvg />}
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default memo(LoginForm);
