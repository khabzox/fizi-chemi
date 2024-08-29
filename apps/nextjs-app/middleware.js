import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/auth/sign-in(.*)",
  "/auth/sign-up(.*)",
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

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req) || isPublicApi(req)) {
    return;
  }
  auth().protect();
});


export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
