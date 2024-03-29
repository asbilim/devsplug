import RegisterComponent from "@/components/pages/auth/register";
import AuthLayout from "@/components/pages/auth/layout";
export const metadata = {
  title: "Devsplug | create an account",
  description:
    "Devsplug Join an amazing dev community with youth cameroonians , learn grow and challenge other developers",
};
export default function Register() {
  return (
    <AuthLayout>
      <RegisterComponent />
    </AuthLayout>
  );
}
