"use client";

import { type LucideIcon, Check, X, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Design Tokens ───────────────────────────────────────────────
const SIZES = {
  xs: { icon: "w-3.5 h-3.5", container: "w-7 h-7", radius: "rounded-lg" },
  sm: { icon: "w-4 h-4", container: "w-9 h-9", radius: "rounded-xl" },
  md: { icon: "w-5 h-5", container: "w-11 h-11", radius: "rounded-xl" },
  lg: { icon: "w-6 h-6", container: "w-14 h-14", radius: "rounded-2xl" },
  xl: { icon: "w-7 h-7", container: "w-16 h-16", radius: "rounded-2xl" },
} as const;

type IconSize = keyof typeof SIZES;

// ─── Color Themes ────────────────────────────────────────────────
export type IconTheme =
  | "ocean"
  | "ocean-light"
  | "mint"
  | "sky"
  | "indigo"
  | "leaf"
  | "white";

interface ThemeConfig {
  bg: string;
  text: string;
  border: string;
  shadow: string;
  glow: string;
  gradient: string;
  solidBg: string;
  solidText: string;
}

const THEMES: Record<IconTheme, ThemeConfig> = {
  ocean: {
    bg: "bg-ocean/10",
    text: "text-ocean",
    border: "border-ocean/20",
    shadow: "shadow-ocean/10",
    glow: "shadow-[0_0_14px_rgba(0,139,139,0.3)]",
    gradient: "bg-gradient-to-br from-ocean/15 to-ocean-light/10",
    solidBg: "bg-ocean",
    solidText: "text-white",
  },
  "ocean-light": {
    bg: "bg-ocean-light/10",
    text: "text-ocean-light",
    border: "border-ocean-light/20",
    shadow: "shadow-ocean-light/10",
    glow: "shadow-[0_0_14px_rgba(51,166,166,0.3)]",
    gradient: "bg-gradient-to-br from-ocean-light/15 to-ocean/5",
    solidBg: "bg-ocean-light",
    solidText: "text-ocean-dark",
  },
  mint: {
    bg: "bg-mint/10",
    text: "text-mint",
    border: "border-mint/20",
    shadow: "shadow-mint/10",
    glow: "shadow-[0_0_14px_rgba(103,191,163,0.3)]",
    gradient: "bg-gradient-to-br from-mint/15 to-mint-light/10",
    solidBg: "bg-mint",
    solidText: "text-white",
  },
  sky: {
    bg: "bg-sky/10",
    text: "text-sky",
    border: "border-sky/20",
    shadow: "shadow-sky/10",
    glow: "shadow-[0_0_14px_rgba(103,162,191,0.3)]",
    gradient: "bg-gradient-to-br from-sky/15 to-sky-light/10",
    solidBg: "bg-sky",
    solidText: "text-white",
  },
  indigo: {
    bg: "bg-indigo/10",
    text: "text-indigo",
    border: "border-indigo/20",
    shadow: "shadow-indigo/10",
    glow: "shadow-[0_0_14px_rgba(103,134,191,0.3)]",
    gradient: "bg-gradient-to-br from-indigo/15 to-indigo-light/10",
    solidBg: "bg-indigo",
    solidText: "text-white",
  },
  leaf: {
    bg: "bg-leaf/10",
    text: "text-leaf",
    border: "border-leaf/20",
    shadow: "shadow-leaf/10",
    glow: "shadow-[0_0_14px_rgba(103,191,133,0.3)]",
    gradient: "bg-gradient-to-br from-leaf/15 to-leaf-light/10",
    solidBg: "bg-leaf",
    solidText: "text-white",
  },
  white: {
    bg: "bg-white/15",
    text: "text-white",
    border: "border-white/25",
    shadow: "shadow-white/5",
    glow: "shadow-[0_0_14px_rgba(255,255,255,0.15)]",
    gradient: "bg-gradient-to-br from-white/20 to-white/5",
    solidBg: "bg-white",
    solidText: "text-ocean-dark",
  },
};

// ─── Variant Styles ──────────────────────────────────────────────
export type IconVariant =
  | "default"
  | "gradient"
  | "glass"
  | "glow"
  | "outlined"
  | "solid"
  | "minimal";

// ─── Base Premium Icon ───────────────────────────────────────────
interface PremiumIconProps {
  icon: LucideIcon;
  size?: IconSize;
  theme?: IconTheme;
  variant?: IconVariant;
  className?: string;
  iconClassName?: string;
  animate?: boolean;
}

export function PremiumIcon({
  icon: Icon,
  size = "md",
  theme = "ocean",
  variant = "default",
  className,
  iconClassName,
  animate = false,
}: PremiumIconProps) {
  const sizeConfig = SIZES[size];
  const themeConfig = THEMES[theme];

  const containerStyles = getContainerStyles(variant, themeConfig);
  const iconStyles = cn(
    sizeConfig.icon,
    variant === "solid" ? themeConfig.solidText : themeConfig.text,
    animate && "transition-transform duration-300 group-hover:scale-110",
    iconClassName
  );

  return (
    <div
      className={cn(
        sizeConfig.container,
        sizeConfig.radius,
        "flex items-center justify-center shrink-0 transition-all duration-300",
        containerStyles,
        className
      )}
    >
      <Icon className={iconStyles} />
    </div>
  );
}

function getContainerStyles(variant: IconVariant, theme: ThemeConfig): string {
  switch (variant) {
    case "gradient":
      return cn(
        theme.gradient,
        "border border-white/20 backdrop-blur-sm shadow-sm",
        theme.shadow
      );
    case "glass":
      return cn(
        "bg-white/10 backdrop-blur-md border border-white/20",
        "shadow-lg shadow-black/5"
      );
    case "glow":
      return cn(theme.bg, theme.border, "border", theme.glow);
    case "outlined":
      return cn("bg-transparent border-2", theme.border);
    case "solid":
      return cn(theme.solidBg, theme.solidText, "shadow-md");
    case "minimal":
      return "";
    default: // "default"
      return cn(theme.bg, "shadow-sm", theme.shadow);
  }
}

// ─── Icon Badge (Inline pill) ────────────────────────────────────
interface IconBadgeProps {
  icon: LucideIcon;
  label: string;
  size?: "sm" | "md";
  theme?: IconTheme;
  variant?: "filled" | "outlined" | "glass";
  className?: string;
}

export function IconBadge({
  icon: Icon,
  label,
  size = "sm",
  theme = "ocean",
  variant = "filled",
  className,
}: IconBadgeProps) {
  const themeConfig = THEMES[theme];
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  const badgeStyles =
    variant === "filled"
      ? cn(themeConfig.gradient, themeConfig.text, "border border-white/10 shadow-sm")
      : variant === "outlined"
      ? cn("border", themeConfig.border, themeConfig.text)
      : cn("bg-white/10 backdrop-blur-md border border-white/20 text-white");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
        badgeStyles,
        className
      )}
    >
      <Icon className={iconSize} />
      {label}
    </span>
  );
}

// ─── Icon Feature Card (For benefit/feature sections) ────────────
interface IconFeatureProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  theme?: IconTheme;
  className?: string;
}

export function IconFeature({
  icon: Icon,
  title,
  description,
  theme = "ocean",
  className,
}: IconFeatureProps) {
  const themeConfig = THEMES[theme];

  return (
    <div className={cn("flex items-start gap-3.5 group", className)}>
      <div
        className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
          "transition-all duration-500",
          "group-hover:scale-105 group-hover:shadow-lg",
          themeConfig.gradient,
          "border border-white/20 backdrop-blur-sm",
          themeConfig.shadow
        )}
      >
        <Icon
          className={cn(
            "w-5 h-5",
            themeConfig.text,
            "transition-transform duration-300 group-hover:scale-110"
          )} />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-sm text-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Icon Stat (For metadata like duration, guests, etc.) ────────
interface IconStatProps {
  icon: LucideIcon;
  value: string;
  label?: string;
  theme?: IconTheme;
  className?: string;
}

export function IconStat({
  icon: Icon,
  value,
  label,
  theme = "ocean",
  className,
}: IconStatProps) {
  const themeConfig = THEMES[theme];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
          themeConfig.gradient,
          "border border-white/20"
        )}
      >
        <Icon className={cn("w-3.5 h-3.5", themeConfig.text)} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground leading-tight">
          {value}
        </p>
        {label && (
          <p className="text-[11px] text-muted-foreground leading-tight">
            {label}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Icon Check (For includes/excludes/highlights) ───────────────
type CheckVariant = "include" | "exclude" | "highlight";

interface IconCheckProps {
  icon?: LucideIcon;
  variant: CheckVariant;
  className?: string;
  iconClassName?: string;
}

const CHECK_CONFIG: Record<
  CheckVariant,
  { icon: LucideIcon; bg: string; text: string; ring: string }
> = {
  include: {
    icon: Check,
    bg: "bg-leaf/12",
    text: "text-leaf",
    ring: "ring-leaf/15",
  },
  exclude: {
    icon: X,
    bg: "bg-indigo/12",
    text: "text-indigo",
    ring: "ring-indigo/15",
  },
  highlight: {
    icon: Sparkles,
    bg: "bg-mint/12",
    text: "text-mint",
    ring: "ring-mint/15",
  },
};

export function IconCheck({
  icon: customIcon,
  variant,
  className,
  iconClassName,
}: IconCheckProps) {
  const config = CHECK_CONFIG[variant];
  const IconComponent = customIcon || config.icon;

  return (
    <div
      className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
        config.bg,
        "ring-1 ring-inset",
        config.ring,
        className
      )}
    >
      <IconComponent className={cn("w-3 h-3", config.text, iconClassName)} />
    </div>
  );
}

// ─── Social Icon (For social media links) ────────────────────────
interface SocialIconProps {
  icon: LucideIcon;
  href: string;
  label: string;
  hoverTheme?: "default" | "sky" | "leaf";
  className?: string;
}

export function SocialIcon({
  icon: Icon,
  href,
  label,
  hoverTheme = "default",
  className,
}: SocialIconProps) {
  const hoverBg =
    hoverTheme === "sky"
      ? "hover:bg-sky hover:border-sky/50"
      : hoverTheme === "leaf"
      ? "hover:bg-leaf hover:border-leaf/50"
      : "hover:bg-ocean hover:border-ocean/50";

  return (
    <a
      href={href}
      className={cn(
        "w-10 h-10 rounded-2xl flex items-center justify-center",
        "bg-white/10 border border-white/15 backdrop-blur-sm",
        "text-white/80 hover:text-white",
        hoverBg,
        "transition-all duration-300 hover:scale-110 hover:shadow-lg",
        className
      )}
      aria-label={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={
        href.startsWith("http") ? "noopener noreferrer" : undefined
      }
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}

// ─── Rating Stars ────────────────────────────────────────────────
interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  maxStars = 5,
  size = "sm",
  showValue = false,
  className,
}: RatingStarsProps) {
  const iconSize =
    size === "sm" ? "w-3.5 h-3.5" : size === "md" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;

        return (
          <Star
            key={i}
            className={cn(
              iconSize,
              filled || half
                ? "text-mint fill-mint drop-shadow-[0_0_4px_rgba(103,191,163,0.3)]"
                : "text-muted-foreground"
            )} />
        );
      })}
      {showValue && (
        <span className="ml-1 text-xs font-semibold text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

// ─── Section Icon (For section headers) ──────────────────────────
interface SectionIconProps {
  icon: LucideIcon;
  theme?: IconTheme;
  className?: string;
}

export function SectionIcon({
  icon: Icon,
  theme = "ocean",
  className,
}: SectionIconProps) {
  const themeConfig = THEMES[theme];

  return (
    <div
      className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
        themeConfig.gradient,
        "border border-white/20 backdrop-blur-sm shadow-sm",
        themeConfig.shadow,
        className
      )}
    >
      <Icon className={cn("w-5 h-5", themeConfig.text)} />
    </div>
  );
}
