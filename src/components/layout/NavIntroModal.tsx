// @summary Navigation introduction — one screen, no stepper. Opens once per
// NAV_INTRO_VERSION after the boot splash clears, and again on demand via
// openNavIntro(). Hovering a point lights that region of the shell schematic.
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  NAV_INTRO_HEADING,
  NAV_INTRO_POINTS,
  type NavIntroFocus,
} from "@/config/navIntro";
import { shouldShowNavIntro, useNavIntroStore } from "@/store/navIntro";
import { useWorkspaceStore } from "@/store/workspace";
import { cn } from "@/lib/utils";
import NavIntroSchematic, { type NavIntroMode } from "./NavIntroSchematic";

/** Give up waiting on the boot splash and open anyway. */
const BOOT_SPLASH_FALLBACK_MS = 3500;

export default function NavIntroModal() {
  const seenVersion = useNavIntroStore((s) => s.seenVersion);
  const replayRequested = useNavIntroStore((s) => s.replayRequested);
  const markSeen = useNavIntroStore((s) => s.markSeen);
  const clearReplay = useNavIntroStore((s) => s.clearReplay);
  const rebrandingOpen = useWorkspaceStore((s) => s.rebrandingModalOpen);

  const [open, setOpen] = useState(false);
  /** Null means nothing is hovered, so the whole shell stays lit. */
  const [hovered, setHovered] = useState<NavIntroFocus | null>(null);
  const [mode, setMode] = useState<NavIntroMode>("after");
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
      setHovered(null);
      setMode("after");
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
        setHovered(null);
        setMode("after");
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
          "max-h-[92vh] gap-0 overflow-y-auto border-border p-0 shadow-xl sm:max-w-[60rem] sm:rounded-2xl",
          "[&>button]:right-5 [&>button]:top-5 [&>button]:z-20 [&>button]:opacity-50 [&>button]:hover:opacity-100"
        )}
      >
        <div className="grid md:grid-cols-[24rem_1fr]">
          {/* Copy */}
          <div className="flex flex-col px-8 py-8">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[0.6875rem] font-medium text-foreground">
              <Sparkles className="size-3" aria-hidden />
              {NAV_INTRO_HEADING.eyebrow}
            </span>

            <DialogTitle className="font-title mt-4 text-[1.875rem] font-semibold leading-[1.15] tracking-tight text-foreground">
              {NAV_INTRO_HEADING.title}
            </DialogTitle>

            <DialogDescription className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
              {NAV_INTRO_HEADING.description}
            </DialogDescription>

            <ul
              className="mt-7 space-y-[1.125rem]"
              onMouseLeave={() => setHovered(null)}
            >
              {NAV_INTRO_POINTS.map((point) => {
                const Icon = point.icon;
                const active = hovered === point.focus;
                return (
                  <li
                    key={point.id}
                    onMouseEnter={() => setHovered(point.focus)}
                    className="flex gap-3.5"
                  >
                    <span
                      className={cn(
                        "mt-px flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors duration-200 motion-reduce:transition-none",
                        active
                          ? "border-foreground/25 bg-foreground/[0.06] text-foreground"
                          : "border-border text-muted-foreground"
                      )}
                    >
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

            <div className="mt-auto flex justify-end pt-8">
              <Button ref={primaryRef} type="button" onClick={finish}>
                Got it
              </Button>
            </div>
          </div>

          {/* The shell, with the hovered point lit */}
          <div className="relative flex flex-col justify-center gap-4 overflow-hidden border-t border-border bg-muted/40 p-8 md:border-l md:border-t-0">
            {/* Backdrop so the panel is not a flat slab: a fine dot grid and two
                soft glows, one tinted with the product's own selected-state
                accent — the same colour the screenshot already carries. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(color-mix(in srgb, var(--foreground) 9%, transparent) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-28 size-[24rem] rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--accent) 60%, transparent), transparent 70%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-32 -left-28 size-[22rem] rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--foreground) 12%, transparent), transparent 70%)",
              }}
            />

            <div className="relative z-10 flex items-center justify-between gap-3 pr-10">
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {mode === "before" ? "Previous navigation" : "New navigation"}
              </p>
              <Tabs
                value={mode}
                onValueChange={(value) => setMode(value as NavIntroMode)}
              >
                <TabsList className="h-7 p-0.5">
                  <TabsTrigger value="before" className="h-6 px-2.5 text-xs">
                    Before
                  </TabsTrigger>
                  <TabsTrigger value="after" className="h-6 px-2.5 text-xs">
                    After
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="relative z-10 flex flex-col">
              <NavIntroSchematic
                mode={mode}
                focus={hovered ?? "shell"}
                className="h-[34rem] w-full shadow-2xl ring-1 ring-foreground/10"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
