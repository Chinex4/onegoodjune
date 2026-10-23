export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="fixed -top-24 left-5 z-[100] bg-lime px-5 py-3 font-sans text-sm focus:top-3"
      >
        Skip to content
      </a>
      {children}
    </>
  );
}
