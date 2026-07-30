import { isAdminAuthed } from "@/lib/adminAuth";
import { getPriceConfig } from "@/lib/priceStore";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminPricesEditor from "@/components/admin/AdminPricesEditor";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isAdminAuthed();

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--color-bg-warm)] px-4">
        <AdminLoginForm />
      </main>
    );
  }

  const config = await getPriceConfig();

  return (
    <main className="min-h-screen bg-[var(--color-bg-warm)] px-4 py-10 sm:py-16">
      <AdminPricesEditor initialConfig={config} />
    </main>
  );
}
