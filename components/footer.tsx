import { Twitter, Linkedin, Github } from "lucide-react"

const SOCIAL_LINKS = [
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "LinkedIn", href: "#", icon: Linkedin },
  { label: "GitHub", href: "#", icon: Github },
]

const FOOTER_LINKS = [
  { label: "Code of Conduct", href: "#" },
  { label: "Contact", href: "#" },
  { label: "CNCF", href: "#" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 lg:flex-row lg:justify-between lg:px-8">
        {/* Left */}
        <div className="flex flex-col items-center gap-2 lg:items-start">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-xs font-bold text-primary-foreground">K</span>
            </div>
            <span className="text-sm font-bold text-foreground">KCD Delhi 2026</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {"A Cloud Native Computing Foundation community event."}
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Social */}
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label={social.label}
            >
              <social.icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
