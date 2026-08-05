import {
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CheckCircle,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Rocket,
  Wrench as WrenchIcon,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

/** Mirrors backend/core/icons.py ICON_CHOICES — keep both in sync. */
export const ICON_MAP: Record<string, LucideIcon> = {
  award: Award,
  "map-pin": MapPin,
  "graduation-cap": GraduationCap,
  "users-round": UsersRound,
  "badge-check": BadgeCheck,
  "shield-check": ShieldCheck,
  star: Star,
  trophy: Trophy,
  "check-circle": CheckCircle,
  sparkles: Sparkles,
  "book-open": BookOpen,
  briefcase: Briefcase,
  wrench: WrenchIcon,
  target: Target,
  rocket: Rocket,
  "heart-handshake": HeartHandshake,
};

const DEFAULT_ICON = Sparkles;

export function getCmsIcon(name: string | null | undefined): LucideIcon {
  if (!name) return DEFAULT_ICON;
  return ICON_MAP[name] || DEFAULT_ICON;
}

export function CmsIcon({
  name,
  className,
}: {
  name: string | null | undefined;
  className?: string;
}) {
  const Icon = getCmsIcon(name);
  return <Icon className={className} />;
}
