"use client";

import { useEffect } from "react";

// Lead measurement happens once at the accepted intake response.
export default function TrackLead() {
  useEffect(() => {
    try { window.sessionStorage.removeItem("perfecto_lead_context"); }
    catch { /* Storage access is optional on the confirmation page. */ }
  }, []);
  return null;
}
