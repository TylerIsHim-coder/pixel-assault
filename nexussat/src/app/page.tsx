import { redirect } from "next/navigation";

// Root → send users straight to dashboard
export default function Home() {
  redirect("/dashboard");
}
