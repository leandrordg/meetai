import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleCheckIcon } from "lucide-react";

interface Props {
  price: number;
  title: string;
  features: string[];
  badge?: string | null;
  description?: string | null;
  priceSuffix: string;
  buttonText: string;
  onClick: () => void;
  variant: "default" | "highlighted";
}

export function PricingCard({
  price,
  title,
  features,
  badge,
  description,
  priceSuffix,
  buttonText,
  onClick,
  variant,
}: Props) {
  return (
    <div className="bg-white flex flex-col gap-6 p-4 md:p-6 rounded-lg border">
      <div className="flex flex-col gap-2 items-center text-center">
        <div className="flex items-center gap-4">
          <h6 className="font-semibold text-2xl">{title}</h6>

          {badge && (
            <Badge variant={variant === "default" ? "outline" : "default"}>
              {badge}
            </Badge>
          )}
        </div>

        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="flex justify-center items-end shrink-0 gap-0.5">
        <h4 className="text-4xl lg:text-5xl font-bold text-accent-foreground">
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 0,
          }).format(price)}
        </h4>

        <span className="text-muted-foreground">{priceSuffix}</span>
      </div>

      <ul className="flex flex-col mx-auto gap-2.5 text-muted-foreground">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2.5">
            <CircleCheckIcon className="fill-primary text-accent" />
            <span className="text-muted-foreground text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        size="lg"
        className="mt-auto"
        variant={variant === "highlighted" ? "default" : "outline"}
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </div>
  );
}
