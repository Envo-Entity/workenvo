"use client";

import { useEffect, useState } from "react";
import { RegisterModal } from "./RegisterModal";

export function WebinarRegister() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-webinar-register", handler);
    return () => window.removeEventListener("open-webinar-register", handler);
  }, []);

  if (!open) return null;
  return <RegisterModal onClose={() => setOpen(false)} />;
}
