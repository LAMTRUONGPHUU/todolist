
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/hooks/useAuth";
import { googleLoginUrl } from "@/services/auth.api";

import { loginSchema, type LoginFormData } from "@/validators/login.schema";
import { signupSchema, type SignupFormData } from "@/validators/signup.schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { otpSchema, type OtpFormData } from "@/validators/otp.schema";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type Mode = "login" | "signup" | "verify-otp";
const RESEND_INTERVAL = 60;

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const navigate = useNavigate();
  const { isResendingOtp, resendOtp, verifyOtp, login, register, isLoggingIn, isRegistering, loginError, registerError } =
    useAuth();

  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (mode !== "verify-otp") return;

    const timer = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [mode]);
  /* ---------------- LOGIN FORM ---------------- */
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onLogin = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => navigate("/", { replace: true }),
    });
  };

  /* ---------------- SIGNUP FORM ---------------- */
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSignup = (data: SignupFormData) => {
    register(data, {
      onSuccess: (data) => {
        const now = Date.now();

        localStorage.setItem(
          "otp-session",
          JSON.stringify({
            sessionId: data.sessionId,
            resendAvailableAt: now + RESEND_INTERVAL * 1000,
          })
        );

        setMode("verify-otp");
      },
    });
  };

  /* ---------------- OTP FORM ---------------- */
  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onVerifyOtp = (data: OtpFormData) => {
    const raw = localStorage.getItem("otp-session");
    if (!raw) return;

    const { sessionId } = JSON.parse(raw);

    verifyOtp(
      {
        sessionId,
        otp: data.otp,
      },
      {
        onSuccess: () => {
          localStorage.removeItem("otp-session");
          navigate("/", { replace: true });
        },
      }
    );
  };

  useEffect(() => {
    if (otpForm.watch("otp")?.length === 6) {
      otpForm.handleSubmit(onVerifyOtp)();
    }
  }, [otpForm.watch("otp")]);


  useEffect(() => {
    const raw = localStorage.getItem("otp-session");
    if (!raw) return;

    const { resendAvailableAt } = JSON.parse(raw);
    const diff = Math.ceil((resendAvailableAt - Date.now()) / 1000);

    setSeconds(diff > 0 ? diff : 0);
    setMode("verify-otp");
  }, []);

  useEffect(() => {
    if (mode === "verify-otp") {
      otpForm.setFocus("otp");

    }
  }, [mode]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-96 rounded-lg border bg-white p-6 shadow space-y-4">
        {/* Header */}

        <h1 className="text-2xl font-semibold text-center bg-gray-100 px-4 py-2 rounded-lg">
          {mode === "login" && "Login"}
          {mode === "signup" && "Create account"}
          {mode === "verify-otp" && "Verify OTP"}
        </h1>

        {/* -------- LOGIN -------- */}
        {mode === "login" && (
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onLogin)}
              className="space-y-4"
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {loginError && (
                <p className="text-sm text-destructive">
                  {(loginError as any)?.response?.data?.message ??
                    "Login failed"}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Logging in..." : "Confirm"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => (window.location.href = googleLoginUrl())}
                className="w-full"
              >
                Login with Google
              </Button>
            </form>
          </Form>
        )}

        {/* -------- SIGNUP -------- */}
        {mode === "signup" && (
          <Form {...signupForm}>
            <form
              onSubmit={signupForm.handleSubmit(onSignup)}
              className="space-y-4"
            >
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signupForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {registerError && (
                <p className="text-sm text-destructive">
                  {(registerError as any)?.response?.data?.message ??
                    "Signup failed"}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isRegistering}
              >
                {isRegistering ? "Creating account..." : "Sign up"}
              </Button>
            </form>
          </Form>
        )}


        {/* -------- VERIFY OTP -------- */}
        {mode === "verify-otp" && (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit((data) => {
                onVerifyOtp(data)
              })}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground text-center">
                We sent a 6-digit code to your email
              </p>

              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex justify-center">
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <InputOTPGroup>
                          {[...Array(6)].map((_, i) => (
                            <InputOTPSlot key={i} index={i} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Verify
              </Button>


              <Button
                type="button"
                variant="ghost"
                disabled={isResendingOtp || seconds > 0}
                onClick={() => {
                  const raw = localStorage.getItem("otp-session");
                  if (!raw) return;

                  const { sessionId } = JSON.parse(raw);
                  resendOtp(sessionId, {
                    onSuccess: () => {
                      const raw = localStorage.getItem("otp-session");
                      if (!raw) return;

                      const session = JSON.parse(raw);
                      session.resendAvailableAt = Date.now() + RESEND_INTERVAL * 1000;

                      localStorage.setItem("otp-session", JSON.stringify(session));
                      setSeconds(RESEND_INTERVAL);
                    },
                  });
                }}
              >
                {isResendingOtp
                  ? "Resending..."
                  : seconds > 0
                    ? `Resend OTP in ${seconds}s`
                    : "Resend OTP"}
              </Button>

            </form>

            <p className="text-sm text-muted-foreground text-center">
              Enter the code sent to <b>{signupForm.getValues("email")}</b>
            </p>
          </Form>
        )}
        {/* Switch */}
        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                className="text-primary underline"
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-primary underline"
                onClick={() => {
                  localStorage.removeItem("otp-session");
                  setMode("login");
                }}
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
