"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full shadow-lg">
        <CardContent className="pt-12 pb-12">
          <div className="text-center space-y-6">
            {/* 404 Illustration */}
            <div className="relative">
              <div className="text-[120px] font-bold text-gray-200 leading-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FileQuestion className="h-24 w-24 text-blue-600 animate-pulse" />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Page Not Found
              </h1>
              <p className="text-gray-600 max-w-md mx-auto">
                Sorry, we couldn't find the page you're looking for. It might
                have been moved, deleted, or never existed.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>

              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>

            {/* Help Text */}
            <div className="pt-6 border-t mt-8">
              <p className="text-sm text-gray-500">
                Need help? Contact support or check our{" "}
                <Link href="/docs" className="text-blue-600 hover:underline">
                  documentation
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
