import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId, getToken } = await auth();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Not signed in" }), {
      status: 401,
    });
  }

  const token = await getToken({ template: "cftracker" });

  if (!token) {
    return new Response(
      JSON.stringify({ error: "No token returned. Check JWT template name." }),
      { status: 401 },
    );
  }

  // sanity check: JWT must have 2 dots
  const dotCount = token.split(".").length - 1;
  if (dotCount !== 2) {
    return new Response(
      JSON.stringify({
        error: "Token is not a JWT",
        dotCount,
        preview: token.slice(0, 40),
      }),
      { status: 400 },
    );
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/whoami`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const text = await res.text();
  return new Response(text, { status: res.status });
}
