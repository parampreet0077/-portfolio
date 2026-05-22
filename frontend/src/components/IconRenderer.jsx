import { icons } from "lucide-react";
import * as FaIcons from "react-icons/fa";

export default function IconRenderer({ iconName, size = 24, className = "" }) {
  if (!iconName) return <span className={className}>✨</span>;

  // Try Lucide Icons first
  const LucideIcon = icons[iconName];
  if (LucideIcon) {
    return <LucideIcon size={size} className={className} />;
  }

  // Try FontAwesome Icons
  const FaIcon = FaIcons[iconName];
  if (FaIcon) {
    return <FaIcon size={size} className={className} />;
  }

  // Fallback to rendering the string directly (useful for emojis)
  return <span className={className} style={{ fontSize: size }}>{iconName}</span>;
}
