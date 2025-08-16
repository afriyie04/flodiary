import ProtectedLayout from "@/components/ProtectedLayout";

export default function SetupLayout({ children }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}