// @summary Navigation introduction — one screen, no stepper. Opens once per
// NAV_INTRO_VERSION after the boot splash clears, and again on demand via
// openNavIntro(). Right panel is an annotated shell with callouts.
// Esc / X / Got it all count as seen: we never re-nag.
import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles } from "@/components/icons/protoLucide";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { NAV_INTRO_HEADING, NAV_INTRO_POINTS } from "@/config/navIntro";
import { shouldShowNavIntro, useNavIntroStore } from "@/store/navIntro";
import { useWorkspaceStore } from "@/store/workspace";
import { cn } from "@/lib/utils";
import NavIntroSchematic from "./NavIntroSchematic";

/** Give up waiting on the boot splash and open anyway. */
const BOOT_SPLASH_FALLBACK_MS = 3500;

export default function NavIntroModal() {
  const seenVersion = useNavIntroStore((s) => s.seenVersion);
  const replayRequested = useNavIntroStore((s) => s.replayRequested);
  const markSeen = useNavIntroStore((s) => s.markSeen);
  const clearReplay = useNavIntroStore((s) => s.clearReplay);
  const rebrandingOpen = useWorkspaceStore((s) => s.rebrandingModalOpen);

  const [open, setOpen] = useState(false);
  const primaryRef = useRef<HTMLButtonElement>(null);

  // Queue behind the boot splash and the rebranding intro so the user only ever
  // faces one modal at a time.
  useEffect(() => {
    if (open) return;
    if (!replayRequested && !shouldShowNavIntro(seenVersion)) return;
    if (rebrandingOpen) return;

    let cancelled = false;

    const tryOpen = () => {
      if (cancelled || document.getElementById("boot-splash")) return false;
      setOpen(true);
      return true;
    };

    if (tryOpen()) return;

    const interval = window.setInterval(() => {
      if (tryOpen()) window.clearInterval(interval);
    }, 100);

    const timeout = window.setTimeout(() => {
      window.clearInterval(interval);
      if (!cancelled) setOpen(true);
    }, BOOT_SPLASH_FALLBACK_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [open, replayRequested, seenVersion, rebrandingOpen]);

  const finish = useCallback(() => {
    markSeen();
    clearReplay();
    setOpen(false);
  }, [markSeen, clearReplay]);

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) finish();
      }}
    >
      <DialogContent
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          primaryRef.current?.focus();
        }}
        className={cn(
          "max-h-[92vh] gap-0 overflow-y-auto border-border p-0 shadow-xl sm:max-w-[64rem] sm:rounded-2xl",
          "[&>button]:right-5 [&>button]:top-5 [&>button]:z-20 [&>button]:opacity-50 [&>button]:hover:opacity-100"
        )}
      >
        <div className="grid md:grid-cols-[22rem_1fr]">
          {/* Copy */}
          <div className="flex flex-col px-8 py-8">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[0.6875rem] font-medium text-foreground">
              <Sparkles className="size-3" aria-hidden />
              {NAV_INTRO_HEADING.eyebrow}
            </span>

            <DialogTitle
              className="mt-4 text-[1.875rem] font-semibold leading-[1.15] tracking-tight text-foreground"
              style={{
                fontFamily: '"Ergon", ui-sans-serif, system-ui, sans-serif',
              }}
            >
              {NAV_INTRO_HEADING.title}
            </DialogTitle>

            <DialogDescription className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
              {NAV_INTRO_HEADING.description}
            </DialogDescription>

            <ul className="mt-7 space-y-[1.125rem]">
              {NAV_INTRO_POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <li key={point.id} className="flex gap-3.5">
                    <span className="mt-px flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-snug text-foreground">
                        {point.title}
                      </p>
                      <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                        {point.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8">
              <Button ref={primaryRef} type="button" onClick={finish}>
                Got it
              </Button>
            </div>
          </div>

          {/* Annotated shell */}
          <div className="relative flex flex-col justify-center overflow-hidden border-t border-border bg-muted p-6 md:border-l md:border-t-0 md:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(
                    ellipse 90% 70% at 50% 40%,
                    color-mix(in srgb, var(--background) 90%, transparent),
                    transparent 70%
                  ),
                  radial-gradient(
                    color-mix(in srgb, var(--foreground) 8%, transparent) 1px,
                    transparent 1px
                  )
                `,
                backgroundSize: "auto, 18px 18px",
              }}
            />
            <NavIntroSchematic className="relative z-10 h-[36rem] w-full shadow-[0_24px_48px_-20px_color-mix(in_srgb,var(--foreground)_28%,transparent)] ring-1 ring-border" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
