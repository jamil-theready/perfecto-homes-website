"use client";

import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";

export default function TrackLead() {
  useEffect(() => {
    sendGAEvent("event", "generate_lead", {
      event_category: "engagement",
      event_label: "contact_form_submission",
      value: 1,
    });
  }, []);

  return null;
}
