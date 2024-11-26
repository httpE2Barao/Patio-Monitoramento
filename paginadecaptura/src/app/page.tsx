"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para /auth
    router.push("/auth");
  }, [router]);

  return null; // Não renderiza nada na rota raiz
}