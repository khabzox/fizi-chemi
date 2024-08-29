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
  "/api(.*)",
  "/api/tutorial(.*)",
  "/api/search(.*)",

]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req) || isPublicApi(req)) {
    console.log("Public Route or API accessed:", req.url);
    return; // Allow access without authentication
  }
  console.log("Private Route accessed:", req.url);
  auth().protect(); // Require authentication
});


export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
