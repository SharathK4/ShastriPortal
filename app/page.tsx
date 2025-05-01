import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GraduationCap, School, UserCog } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center space-y-8 animate-fadeIn">
        <Logo className="w-32 h-32" />
        <h1 className="text-4xl font-bold text-center font-shastri">Shastri</h1>
        <h2 className="text-xl text-center text-gray-600">Login Page</h2>

        <div className="w-full space-y-4 mt-8">
          <Link href="/login/student" className="w-full block">
            <Button
              className="w-full py-6 bg-black text-white hover:bg-gray-800 transition-all duration-300 animate-slideIn"
              size="lg"
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              Student Login
            </Button>
          </Link>

          <div className="text-center text-gray-500">or</div>

          <Link href="/login/faculty" className="w-full block">
            <Button
              className="w-full py-6 bg-black text-white hover:bg-gray-800 transition-all duration-300 animate-slideIn"
              size="lg"
            >
              <School className="mr-2 h-5 w-5" />
              Faculty Login
            </Button>
          </Link>

          <div className="text-center text-gray-500">or</div>

          <Link href="/login/admin" className="w-full block">
            <Button
              className="w-full py-6 bg-black text-white hover:bg-gray-800 transition-all duration-300 animate-slideIn"
              size="lg"
            >
              <UserCog className="mr-2 h-5 w-5" />
              Administrator Login
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

