import Image from "next/image";

interface Props {
  title: string;
  description: string;
  image?: string;
}

export function EmptyState({
  title,
  description,
  image = "/empty.svg",
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center px-4 md:px-8 gap-4">
      <Image
        src={image}
        alt="Empty"
        width={240}
        height={240}
        className="object-contain"
      />

      <div className="flex flex-col gap-6 max-w-md mx-auto text-center">
        <h6 className="text-lg font-medium">{title}</h6>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
