import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/shared/constants/routes";

export default function RootPage() {
  redirect(APP_ROUTES.home);
}
