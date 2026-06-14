import { NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function proxyApiRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const targetUrl = new URL(`${process.env.API_INTERNAL_URL!}/${path.join("/")}`);
  const requestUrl = new URL(request.url);

  targetUrl.search = requestUrl.search;

  const headers = new Headers(request.headers);
  headers.delete("connection");
  headers.delete("host");

  return fetch(targetUrl, {
    body: ["GET", "HEAD"].includes(request.method)
      ? undefined
      : await request.arrayBuffer(),
    headers,
    method: request.method,
    redirect: "manual",
  });
}

export const DELETE = proxyApiRequest;
export const GET = proxyApiRequest;
export const PATCH = proxyApiRequest;
export const POST = proxyApiRequest;
export const PUT = proxyApiRequest;
