import AuthForm from "../componenets/AuthForm";

export default function LoginPage() {
  return (
    <main className="flex justify-center items-center h-screen">
      <AuthForm mode="login" />
    </main>
  );
}
