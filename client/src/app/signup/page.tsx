"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Chrome, User2, Mail, Lock, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Signup failed");
      window.location.href = "/auth/login";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519669417670-68775a50919c?auto=format&fit=crop&q=80&w=2000&h=1000&blur=50')] opacity-20 bg-cover bg-center" />
  
      <Card className="w-full max-w-md relative bg-gray-800/90 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg border border-gray-700">
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <Compass className="w-12 h-12 mx-auto text-emerald-600 animate-pulse" />
            <h1 className="text-3xl font-bold text-white">Join the Hunt!</h1>
            <p className="text-gray-300">Begin your treasure hunting journey</p>
          </div>

          <Button
            variant="outline"
            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
            disabled={isLoading}
            className="w-full group border border-emerald-600 text-emerald-600 hover:bg-emerald-700"
          >
            <Chrome className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
            Sign up with Google
          </Button>
          
          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-gray-800 text-xs text-gray-500">
              or sign up with email
            </span>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">First Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="John"
                            className="pl-10 border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Last Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Doe"
                            className="pl-10 border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="you@example.com"
                          className="pl-10 border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className={cn(
                  "w-full bg-gradient-to-r from-emerald-600 to-sky-600 text-white hover:from-emerald-500 hover:to-sky-500 shadow-lg",
                  isLoading && "animate-pulse"
                )}
                disabled={isLoading}
              >
                {isLoading ? "Creating Adventure..." : "Start Your Journey"}
              </Button>
            </form>
          </Form>

          <p className="text-sm text-center text-gray-400">
            Already an explorer?{" "}
            <Link
              href="/login"
              className="text-emerald-600 hover:underline font-medium"
            >
              Continue Your Quest
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}