// @summary Wide navigation tour — intro + feature steps. Opens once per
// NAV_INTRO_VERSION after the boot splash clears, and again via openNavIntro().
// Esc / X / Skip / Got it all count as seen.
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight } from "@/components/icons/protoLucide";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  NAV_INTRO_FEATURE_COUNT,
  NAV_INTRO_STEPS,
} from "@/config/navIntro";
import { shouldShowNavIntro, useNavIntroStore } from "@/store/navIntro";
import { useWorkspaceStore } from "@/store/workspace";
import { cn } from "@/lib/utils";
import NavIntroSchematic from "./NavIntroSchematic";

const BOOT_SPLASH_FALLBACK_MS = 3500;

function StepDots({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            "rounded-full transition-all duration-200",
            i === index
              ? "h-1.5 w-5 bg-foreground"
              : "size-1.5 bg-border"
          )}
        />
      ))}
    </div>
  );
}

export default function NavIntroModal() {
  const seenVersion = useNavIntroStore((s) => s.seenVersion);
  const replayRequested = useNavIntroStore((s) => s.replayRequested);
  const markSeen = useNavIntroStore((s) => s.markSeen);
  const clearReplay = useNavIntroStore((s) => s.clearReplay);
  const rebrandingOpen = useWorkspaceStore((s) => s.rebrandingModalOpen);

  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const primaryRef = useRef<HTMLButtonElement>(null);

  const step = NAV_INTRO_STEPS[stepIndex] ?? NAV_INTRO_STEPS[0];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === NAV_INTRO_STEPS.length - 1;
  const featureOrdinal =
    step.kind === "feature"
      ? NAV_INTRO_STEPS.slice(0, stepIndex + 1).filter((s) => s.kind === "feature")
          .length
      : 0;

  useEffect(() => {
    if (open) return;
    if (!replayRequested && !shouldShowNavIntro(seenVersion)) return;
    if (rebrandingOpen) return;

    let cancelled = false;

    const tryOpen = () => {
      if (cancelled || document.getElementById("boot-splash")) return false;
      setStepIndex(0);
      setOpen(true);
      return true;
    };

    if (tryOpen()) return;

    const interval = window.setInterval(() => {
      if (tryOpen()) window.clearInterval(interval);
    }, 100);

    const timeout = window.setTimeout(() => {
      window.clearInterval(interval);
      if (!cancelled) {
        setStepIndex(0);
        setOpen(true);
      }
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
    setStepIndex(0);
  }, [markSeen, clearReplay]);

  const goNext = () => {
    if (isLast) finish();
    else setStepIndex((i) => Math.min(i + 1, NAV_INTRO_STEPS.length - 1));
  };

  const goBack = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
  };

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
          "max-h-[92vh] w-[min(52rem,calc(100vw-2rem))] max-w-none gap-0 overflow-hidden border-border p-0 shadow-xl sm:rounded-2xl",
          "[&>button]:right-4 [&>button]:top-4 [&>button]:z-20 [&>button]:flex [&>button]:size-8 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-border [&>button]:bg-background [&>button]:opacity-100 [&>button]:shadow-sm"
        )}
      >
        <div className="flex max-h-[92vh] flex-col overflow-y-auto">
          {/* Illustration */}
          <div className="relative shrink-0 border-b border-border bg-muted p-4 md:p-5">
            <NavIntroSchematic media={step.media} className="w-full shadow-sm" />
          </div>

          {/* Copy — fixed min height so shorter steps don’t shrink the modal */}
          <div className="flex min-h-[9.5rem] flex-col px-7 pb-2 pt-6 md:min-h-[10rem] md:px-8 md:pt-7">
            {step.kind === "intro" ? (
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {step.eyebrow}
              </p>
            ) : (
              <p className="text-[0.8125rem] tabular-nums text-muted-foreground">
                {featureOrdinal} / {NAV_INTRO_FEATURE_COUNT}
              </p>
            )}

            <DialogTitle
              className="mt-3 text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-foreground md:text-[1.875rem]"
              style={{
                fontFamily: '"Ergon", ui-sans-serif, system-ui, sans-serif',
              }}
            >
              {step.title}
            </DialogTitle>

            <DialogDescription className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </DialogDescription>

            {step.footnote ? (
              <p className="mt-4 text-sm text-muted-foreground/80">
                {step.footnote}
              </p>
            ) : null}
          </div>

          {/* CTA */}
          <div className="mt-auto flex items-center justify-between gap-3 px-7 pb-5 pt-5 md:px-8 md:pb-6">
            <StepDots index={stepIndex} total={NAV_INTRO_STEPS.length} />

            <div className="flex items-center gap-2">
              {isFirst ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={finish}
                >
                  Skip tour
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={goBack}
                >
                  Back
                </Button>
              )}
              <Button
                ref={primaryRef}
                type="button"
                size="sm"
                className="gap-1"
                onClick={goNext}
              >
                {isLast ? (
                  "Got it"
                ) : (
                  <>
                    Next
                    <ChevronRight className="size-3.5" aria-hidden />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
