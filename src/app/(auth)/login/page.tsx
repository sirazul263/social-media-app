import { Metadata } from "next";
import loginImage from "../../../assets/login-image.jpg";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login",
};

const LoginPage = () => {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="shadow-2xl flex h-full max-h-[40rem] w-full max-w-[64rem] rounded-2xl overflow-hidden bg-card">
        <div className="md:w-1/2 w-full space-y-10 overflow-y-auto p-10">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Login to bugbook</h1>
          </div>
          <div className="space-y-5">
            <LoginForm />
            <Link href="/sign-up" className="block text-center hover:underline">
              Don&apos;t have an account ? Sign up
            </Link>
          </div>
        </div>

        <Image
          src={loginImage}
          alt=""
          className="w-1/2 hidden md:block object-cover"
        />
      </div>
    </main>
  );
};
export default LoginPage;
