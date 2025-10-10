import { auth0 } from "@/lib/auth0";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ path: string[] }>;
  }
) {
  const path = (await params).path;

  const accessToken = await auth0.getAccessToken(); // await getAccessToken() if async
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path.join("/")}`;

  const res = await fetch(backendUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return new NextResponse(await res.text(), { status: res.status });
}
export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ path: string[] }>;
  }
) {
  const path = (await params).path;

  const accessToken = await auth0.getAccessToken(); // await getAccessToken() if async
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path
    .join("/")
    .replace(/^api\/my-proxy\/?/, "")}`;

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(req.body),
  });

  return new NextResponse(await res.text(), { status: res.status });
}
