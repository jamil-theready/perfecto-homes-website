"use client";

import { useEffect } from "react";

// Lead measurement happens once at the accepted intake response.
export default function TrackLead() {
  useEffect(() => {
    window.sessionStorage.removeItem("perfecto_lead_context");
  }, []);
  return null;
}
