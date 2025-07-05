import AuthForm from "../componenets/AuthForm";

export default function SignupPage() {
  return (
    <main className="flex justify-center items-center h-screen">
      <AuthForm mode="signup" />
    </main>
  );
}
