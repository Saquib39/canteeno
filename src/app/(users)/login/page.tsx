"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await signIn("credentials", { email, password, callbackUrl: "/" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Welcome back! Choose a method below.</CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            Sign in with github
          </Button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Login with Email"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-sm text-gray-500">
          Don’t have an account? <a href="/register" className="underline ml-1">Register</a>
        </CardFooter>
      </Card>
    </div>
  );
}
