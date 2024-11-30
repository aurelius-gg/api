import Elysia from "elysia";

export const rate_limiter_middleware = new Elysia()
  //@ts-ignore
  .onRequest(({ request }) => {
    const url = new URL(request.url);
    if (url.pathname.includes("favicon.ico")) return;
    const token = request.headers.get("Authorization");

    console.log(token);
  });
