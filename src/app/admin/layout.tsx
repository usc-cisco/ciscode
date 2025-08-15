import ProtectedRoute from "@/components/shared/protected-route";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedRoute requireAdmin>{children}</ProtectedRoute>;
}
