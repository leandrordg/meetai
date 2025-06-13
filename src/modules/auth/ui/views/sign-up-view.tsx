"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { z } from "zod/v4";

const formSchema = z
  .object({
    name: z.string().nonempty(),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export function SignUpView() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);

    await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => router.push("/"),
        onError: ({ error }) => setError(error.message),
      }
    );

    setPending(false);
  };

  const onSocial = async (provider: "github" | "google") => {
    setError(null);
    setPending(true);

    await authClient.signIn.social(
      { provider, callbackURL: "/" },
      {
        onError: ({ error }) => setError(error.message),
      }
    );

    setPending(false);
  };

  const { isDirty } = form.formState;

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:text-center">
              <h1 className="text-2xl font-bold">Vamos começar</h1>
              <p className="text-muted-foreground">
                Acesse todos os recursos da plataforma.
              </p>
            </div>

            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Seu nome"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@exemplo.com"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!!error && (
              <Alert className="bg-destructive/10 border-none">
                <OctagonAlertIcon className="size-4 !text-destructive" />
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            )}

            <Button type="submit" disabled={pending || !isDirty}>
              Continuar
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => onSocial("google")}
              >
                <FaGoogle />
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => onSocial("github")}
              >
                <FaGithub />
              </Button>
            </div>

            <div className="md:text-center text-sm">
              Já possui uma conta?{" "}
              <Link href="/sign-in" className="underline underline-offset-2">
                Entrar agora
              </Link>
            </div>
          </div>
        </form>
      </Form>

      <div className="text-muted-foreground *:[a]:text-foreground md:text-center md:text-balance text-xs *:[a]:underline underline-offset-2">
        Ao clicar em &quot;Continuar&quot;, você concorda com nossos{" "}
        <Link href="/terms-of-service">Termos de Serviço</Link> e{" "}
        <Link href="/privacy-policy">Política de Privacidade</Link>.
      </div>
    </div>
  );
}
