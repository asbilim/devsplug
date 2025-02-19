import { redirect } from "next/navigation";

// Redirect to localized 404 page
export default function RootNotFound() {
  redirect("/en/404");
}
