export default function CallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-30%,var(--color-primary),rgba(255,255,255,0))]">
      {children}
    </div>
  );
}
