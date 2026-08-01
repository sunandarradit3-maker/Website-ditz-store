import { NextResponse } from "next/server";
import { sessionCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: sessionCookie.name,
    value: "",
    path: "/",
    expires: new Date(0)
  });
  return response;
}
