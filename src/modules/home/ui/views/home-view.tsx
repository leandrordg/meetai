"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function HomeView() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  if (!session) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <p>Bem vindo, {session.user.name}!</p>

      <Button
        onClick={() =>
          authClient.signOut({
            fetchOptions: { onSuccess: () => router.push("/sign-in") },
          })
        }
      >
        Sair
      </Button>
    </div>
  );
}
