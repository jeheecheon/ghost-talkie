import { redirect } from "react-router";

export function clientLoader() {
  throw redirect("/search");
}

export default function HomeRoute() {
  return null;
}
