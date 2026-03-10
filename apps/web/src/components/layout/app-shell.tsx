import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-canvas-default)] text-[var(--color-fg-default)]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[var(--color-canvas-default)] p-6">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
