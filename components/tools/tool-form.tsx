// components/tools/tool-form.tsx
"use client"

import { CvTool } from "./cv-writer"
import { IntakeTool } from "./intake-form"

type ToolMode = "cv" | "intake"

// Kept as the single entry point so app/tools/cv-writing/page.tsx and
// app/tools/intake-form/page.tsx do not need to change.
export function ToolForm({ mode }: { mode: ToolMode }) {
  return mode === "cv" ? <CvTool /> : <IntakeTool />
}
