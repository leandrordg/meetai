"use client";

import { PasswordInput } from "@/components/password-input";
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
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { z } from "zod/v4";

const formSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export function SignInView() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);

    await authClient.signIn.email(
      {
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
              <h1 className="text-2xl font-bold">Bem vindo de volta!</h1>
              <p className="text-muted-foreground">
                Faça login na sua conta para continuar.
              </p>
            </div>

            <div className="grid gap-3">
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
                      <PasswordInput
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
              Não tem uma conta?{" "}
              <Link href="/sign-up" className="underline underline-offset-2">
                Criar uma conta
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
