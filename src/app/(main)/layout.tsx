"use client"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // ✅ no new providers, keeps context from root
}