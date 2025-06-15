"use client";

import { ErrorState } from "@/components/error-state";
import { authClient } from "@/lib/auth-client";
import { formatRecurringInterval } from "@/lib/utils";
import { PricingCard } from "@/modules/premium/ui/components/pricing-card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export function UpgradeView() {
  const trpc = useTRPC();

  const { data: products } = useSuspenseQuery(
    trpc.premium.getProducts.queryOptions()
  );

  const { data: currentSubscription } = useSuspenseQuery(
    trpc.premium.getCurrentSubscription.queryOptions()
  );

  const isPremium = !!currentSubscription;

  return (
    <div className="flex-1 p-4 md:p-8 flex flex-col text-center gap-10">
      <p className="text-primary font-semibold underline underline-offset-4">
        Upgrade
      </p>

      <h5 className="font-bold text-2xl md:text-3xl">
        {isPremium
          ? `Gerencie o seu plano ${currentSubscription?.name}.`
          : "Desbloqueie todos os benefícios."}
      </h5>

      <p className="text-sm md:text-base text-muted-foreground font-medium text-balance">
        {isPremium
          ? "Você já está no plano premium. Aqui estão os detalhes do seu plano atual."
          : "Com o plano premium, você pode agendar reuniões ilimitadas, acessar recursos exclusivos e obter suporte prioritário."}
      </p>

      <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 max-w-7xl mx-auto">
        {products.map((product) => {
          const isCurrentProduct = currentSubscription?.id === product.id;
          const isPremium = !!currentSubscription;

          let buttonText = "Fazer upgrade";
          let onClick = () => authClient.checkout({ products: [product.id] });

          if (isCurrentProduct) {
            buttonText = "Gerenciar plano";
            onClick = () => authClient.customer.portal();
          } else if (isPremium) {
            buttonText = "Alterar para este plano";
            onClick = () => authClient.customer.portal();
          }

          return (
            <PricingCard
              key={product.id}
              buttonText={buttonText}
              onClick={onClick}
              variant={
                product.metadata.variant === "highlighted"
                  ? "highlighted"
                  : "default"
              }
              title={product.name}
              price={
                product.prices[0].amountType === "fixed"
                  ? product.prices[0].priceAmount / 100
                  : 0
              }
              description={product.description}
              priceSuffix={`/${formatRecurringInterval(
                product.prices[0].recurringInterval
              )}`}
              features={product.benefits.map((benefit) => benefit.description)}
              badge={product.metadata.badge as string | null}
            />
          );
        })}
      </div>
    </div>
  );
}

export function UpgradeViewError() {
  return (
    <ErrorState
      title="Ocorreu um erro ao buscar planos"
      description="Tente recarregar a página ou volte mais tarde."
    />
  );
}
