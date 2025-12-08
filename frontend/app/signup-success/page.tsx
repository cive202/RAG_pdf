import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-[450px] bg-cream-light border border-[#E5E7EB] shadow-lg">
        <CardHeader className="space-y-4 text-center pt-8">
          <CheckCircle className="w-16 h-16 mx-auto text-[#FF6D1F]" />
          <CardTitle className="text-[32px] font-bold text-[#222222]">Welcome!</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-[16px] text-[#222222]">
              Your account has been created successfully!
            </p>
            <p className="text-[14px] text-[#222222]/70">
              {process.env.NEXT_PUBLIC_SUPABASE_URL 
                ? "Please check your email to confirm your account. Once confirmed, you can log in and start managing your finances with AI-powered insights."
                : "You can now log in and start managing your finances with AI-powered insights."
              }
            </p>
            {!process.env.NEXT_PUBLIC_SUPABASE_URL && (
              <p className="text-[12px] text-yellow-600 bg-yellow-50 p-2 rounded mt-2">
                ⚠️ Supabase is not configured. Using mock authentication for development.
              </p>
            )}
          </div>

          <Link href="/login">
            <Button className="w-full h-12 bg-[#FF6D1F] hover:bg-[#E85A0A] text-white font-semibold text-[16px]">
              Back to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
