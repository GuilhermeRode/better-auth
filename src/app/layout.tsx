import "./globals.css";

export const metadata = {
  title: "Better Auth Showcase",
  description: "Projeto acadêmico — Engenharia de Software 2025",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}