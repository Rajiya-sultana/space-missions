import { Suspense } from "react";
import ActivateForm from "./ActivateForm";

export const metadata = {
  title: "Activate your access — Learn What Matters",
};

export default function ActivatePage() {
  return (
    <main
      style={{ background: "#FFFDF8" }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <Suspense fallback={<div className="text-gray-400 text-sm">Loading…</div>}>
        <ActivateForm />
      </Suspense>
    </main>
  );
}
