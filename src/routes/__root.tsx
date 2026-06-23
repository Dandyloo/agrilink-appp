import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/hooks/use-auth";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AgriLink Solutions — Ghana's Agri-Fintech Marketplace" },
      { name: "description", content: "Ghana's first Agri-Fintech marketplace connecting farmers, buyers and financial services. Fair prices, secure escrow payments, instant financing." },
      { property: "og:title", content: "AgriLink Solutions — Ghana's Agri-Fintech Marketplace" },
      { property: "og:description", content: "Ghana's first Agri-Fintech marketplace connecting farmers, buyers and financial services. Fair prices, secure escrow payments, instant financing." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "AgriLink Solutions — Ghana's Agri-Fintech Marketplace" },
      { name: "twitter:description", content: "Ghana's first Agri-Fintech marketplace connecting farmers, buyers and financial services. Fair prices, secure escrow payments, instant financing." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/443f8315-e98d-4d4b-ac20-99232f986138/id-preview-b0c183f6--aa1616d9-f724-4569-8b0c-d4c040e1b9a1.lovable.app-1782232505183.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/443f8315-e98d-4d4b-ac20-99232f986138/id-preview-b0c183f6--aa1616d9-f724-4569-8b0c-d4c040e1b9a1.lovable.app-1782232505183.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Page not found</p>
        <a href="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm text-white">Go home</a>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => {
    console.error(error);
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <button onClick={reset} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-white">Try again</button>
        </div>
      </div>
    );
  },
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  );
}
