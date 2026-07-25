import "@/app/globals.css";

export const metadata = {
  title: "Resume Builder",
  description: "Build ATS-friendly resumes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 antialiased">{children}</body>
    </html>
  );
}