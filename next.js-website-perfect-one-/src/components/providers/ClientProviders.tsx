'use client';

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PageTransition } from "@/components/motion/PageTransition";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CursorFollower } from "@/components/motion/CursorFollower";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { RAGChatbot } from "@/components/site/RAGChatbot";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScroll>
        <PageTransition>{children}</PageTransition>
      </SmoothScroll>
      <CursorFollower />
      <WhatsAppButton />
      <RAGChatbot />
    </QueryClientProvider>
  );
}
