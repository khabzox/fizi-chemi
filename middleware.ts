import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/tutorials(.*)",
  "/search(.*)",
  "/contact-us",
  "/about-us",
  "/faqs",
]);

const isPublicApi = createRouteMatcher([
  "/api/tutorial(.*)",
  "/api/search(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req) || isPublicApi(req)) {
    return;
  }
  const { userId } = await auth();
  if (!userId) {
    return Response.redirect("/sign-in");
  }
});


export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

