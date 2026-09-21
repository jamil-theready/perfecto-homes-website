"use client";

import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";

export default function TrackLead() {
  useEffect(() => {
    const stored = window.sessionStorage.getItem("perfecto_lead_context");
    if (!stored) return;

    window.sessionStorage.removeItem("perfecto_lead_context");

    try {
      const context = JSON.parse(stored) as {
        form_name?: string;
        property?: string;
      };

      sendGAEvent("event", "generate_lead", {
        event_category: "engagement",
        form_name: context.form_name ?? "unknown_form",
        property: context.property,
        value: 1,
      });
    } catch {
      sendGAEvent("event", "generate_lead", {
        event_category: "engagement",
        form_name: "unknown_form",
        value: 1,
      });
    }
  }, []);

  return null;
}
