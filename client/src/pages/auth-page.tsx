import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth, registerSchema } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { loginUserSchema, InsertUser } from "@shared/schema";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, BookOpen, Mail, Lock, User, UserCircle } from "lucide-react";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { user, loginMutation, registerMutation } = useAuth();

  // Login form
  const loginForm = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login submission
  function onLoginSubmit(values: z.infer<typeof loginUserSchema>) {
    loginMutation.mutate(values);
  }

  // Handle register submission
  function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    // Remove confirmPassword from the data sent to the API
    const { confirmPassword, ...userData } = values;
    registerMutation.mutate(userData as InsertUser);
  }

  // If user is already logged in, redirect to home page
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Column - Form */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8 bg-white">
        <div className="mb-6">
          <Link href="/">
            <a className="flex items-center text-2xl font-bold text-primary">
              <BookOpen className="h-6 w-6 mr-2" />
              BookNest
            </a>
          </Link>
        </div>
        
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {activeTab === "login" ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === "login" 
                ? "Sign in to access your saved housing options" 
                : "Join BookNest to find your perfect reading haven"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="Your username" 
                                {...field} 
                                className="pl-10" 
                              />
                            </FormControl>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                              <User className="h-5 w-5" />
                            </div>
                          </div>
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
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="Your password" 
                                type="password" 
                                {...field} 
                                className="pl-10" 
                              />
                            </FormControl>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                              <Lock className="h-5 w-5" />
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Log in"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="Choose a username" 
                                {...field} 
                                className="pl-10" 
                              />
                            </FormControl>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                              <User className="h-5 w-5" />
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="Your email address" 
                                type="email" 
                                {...field} 
                                className="pl-10" 
                              />
                            </FormControl>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                              <Mail className="h-5 w-5" />
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="Your full name" 
                                {...field} 
                                className="pl-10" 
                              />
                            </FormControl>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                              <UserCircle className="h-5 w-5" />
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="Create a password" 
                                type="password" 
                                {...field} 
                                className="pl-10" 
                              />
                            </FormControl>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                              <Lock className="h-5 w-5" />
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="Confirm your password" 
                                type="password" 
                                {...field} 
                                className="pl-10" 
                              />
                            </FormControl>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                              <Lock className="h-5 w-5" />
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create account"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-slate-600">
              {activeTab === "login" ? (
                <>
                  Don't have an account?{" "}
                  <Button 
                    variant="link" 
                    className="p-0" 
                    onClick={() => setActiveTab("register")}
                  >
                    Sign up
                  </Button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Button 
                    variant="link" 
                    className="p-0" 
                    onClick={() => setActiveTab("login")}
                  >
                    Log in
                  </Button>
                </>
              )}
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right Column - Hero Section (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-12 flex-col justify-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-6">Find your perfect reading haven</h1>
          <p className="text-xl mb-8">
            Discover housing options for book lovers with the amenities you need.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Book-Friendly Spaces</h3>
                <p className="opacity-90">Find homes with built-in bookshelves, reading nooks, and quiet spaces.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Literary Communities</h3>
                <p className="opacity-90">Connect with nearby book clubs and reading communities.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Quick Search</h3>
                <p className="opacity-90">Find your perfect home with our specialized book-lover filters.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
