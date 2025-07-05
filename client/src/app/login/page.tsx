import AuthForm from "../componenets/AuthForm";
import Navbar from "../componenets/Navbar";

export default function LoginPage() {
  return (
    <main className="flex justify-center items-center h-screen">
      <AuthForm mode="login" />
    </main>
  );
}
