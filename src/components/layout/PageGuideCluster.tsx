import {
  CircleHelp,
  ExternalLink,
  Info,
  Play,
} from "@/components/icons/protoLucide";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PageGuide } from "@/config/navigation";

function hasGuide(guide?: PageGuide): guide is PageGuide {
  return Boolean(guide && (guide.tutorial || guide.help || guide.info));
}

function HelpVideoCard({
  video,
}: {
  video: NonNullable<NonNullable<PageGuide["help"]>["video"]>;
}) {
  return (
    <button
      type="button"
      className="group relative block w-full overflow-hidden rounded-md border border-border text-left outline-none transition-colors hover:border-hover focus-visible:ring-1 focus-visible:ring-ring"
      aria-label={`Play ${video.title}`}
    >
      <img src={video.poster} alt="" className="aspect-video max-h-40 w-full object-cover" />
      <span className="absolute inset-0 bg-foreground/25 transition-colors group-hover:bg-foreground/35" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-9 items-center justify-center rounded-full border border-background/80 bg-background/90 text-foreground shadow-sm">
          <Play className="size-4" aria-hidden />
        </span>
      </span>
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-foreground/70 to-transparent px-2.5 pb-2 pt-8">
        <span className="truncate text-xs font-medium text-background">
          {video.title}
        </span>
        <span className="shrink-0 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-foreground">
          {video.duration}
        </span>
      </span>
    </button>
  );
}

/** Page guide next to the breadcrumb: one help icon opens tutorial, help, and about. */
export default function PageGuideCluster({ guide }: { guide?: PageGuide }) {
  if (!hasGuide(guide)) return null;

  const tutorialLabel = guide.tutorial?.label ?? "Play tutorial";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Page help"
        >
          <CircleHelp className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {guide.tutorial ? (
          <DropdownMenuItem className="gap-2">
            <Play className="size-3.5 text-muted-foreground" aria-hidden />
            {tutorialLabel}
          </DropdownMenuItem>
        ) : null}
        {guide.help ? (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <CircleHelp className="size-3.5 text-muted-foreground" aria-hidden />
              Help
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-80 space-y-3 p-3">
              <p className="text-sm font-semibold text-foreground">
                {guide.help.title}
              </p>
              {guide.help.video ? (
                <HelpVideoCard video={guide.help.video} />
              ) : null}
              <p className="text-xs leading-relaxed text-muted-foreground">
                {guide.help.body}
              </p>
              {guide.help.href ? (
                <a
                  href={guide.help.href}
                  className="inline-flex items-center gap-1 text-xs font-medium text-link hover:text-link-hover"
                >
                  Learn more
                  <ExternalLink className="size-3" aria-hidden />
                </a>
              ) : null}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ) : null}
        {guide.info ? (
          <>
            {(guide.tutorial || guide.help) && <DropdownMenuSeparator />}
            <div className="px-2 py-1.5">
              <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <Info className="size-3.5 text-muted-foreground" aria-hidden />
                About this page
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {guide.info}
              </p>
            </div>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
