import { useEffect, useRef } from "react";
import { updateResume } from "@/actions/resume-actions";

export function useAutoSave(resumeId: string, data: any, isDirty: boolean, setIsDirty: (val: boolean) => void) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isDirty || !resumeId) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        await updateResume(resumeId, data);
        setIsDirty(false);
      } catch (err) {
        console.error("Auto-save failed:", err);
      }
    }, 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resumeId, data, isDirty, setIsDirty]);
}