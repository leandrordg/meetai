"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function Home() {
  const { data: session } = authClient.useSession();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const onCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    authClient.signUp.email(
      {
        email,
        name,
        password,
      },
      {
        onError: (error) => window.alert(error.error.message),
        onSuccess: () => window.alert("Conta criada com sucesso!"),
      }
    );
  };

  const onLoginUser = async (e: React.FormEvent) => {
    e.preventDefault();

    authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onError: (error) => window.alert(error.error.message),
        onSuccess: () => window.alert("Login realizado com sucesso!"),
      }
    );
  };

  if (session) {
    return (
      <div className="flex flex-col p-4 md:p-8 gap-4">
        <h1>Bem-vindo, {session.user.name}!</h1>

        <Button type="button" onClick={() => authClient.signOut()}>
          Sair
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="button" onClick={onLoginUser}>
          Entrar
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Digite seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="button" onClick={onCreateUser}>
          Criar conta
        </Button>
      </div>
    </div>
  );
}
