import Link from 'next/link'
/* eslint-disable @next/next/no-img-element */
import { ThemeToggle } from './ThemeToggle'

export default function Footer({ isNavbar = false }: { isNavbar?: boolean }) {
  return (
    <footer className="footer footer-center rounded bg-[--background] p-10 text-[--foreground] text-base-content">
      {/*       <div className="grid grid-flow-col gap-4"> */}
      <div className="flex flex-col flex-wrap items-center justify-center gap-4 text-[--footer-foreground] sm:flex-row">
        <ThemeToggle />
        <Link
          tabIndex={0}
          href="/disclaimer"
          className="link-hover link text-[--footer-link] hover:text-[--footer-link-hover]"
          target="_blank"
          rel="noopener noreferrer"
        >
          Disclaimer
        </Link>
        <Link
          tabIndex={0}
          href="https://ai.osu.edu/resources-buckeyes/responsible-use"
          className="link-hover link text-[--footer-link] hover:text-[--footer-link-hover]"
          target="_blank"
          rel="noopener noreferrer"
        >
          Generative AI Policy
        </Link>
        <Link
          tabIndex={0}
          href="https://it.osu.edu/news/2023/04/28/security-and-privacy-statement-artificial-intelligence"
          className="link-hover link text-[--footer-link] hover:text-[--footer-link-hover]"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms
        </Link>
        <Link
          tabIndex={0}
          href="https://it.osu.edu/privacy"
          className="link-hover link text-[--footer-link] hover:text-[--footer-link-hover]"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy
        </Link>
        <span>
          MIT Licensed{' '}
          <Link
            tabIndex={0}
            href="https://github.com/Center-for-AI-Innovation/uiuc-chat-frontend"
            className="link-hover link text-[--footer-link] hover:text-[--footer-link-hover]"
            target="_blank"
            rel="noopener noreferrer"
          >
            frontend
          </Link>{' '}
          and{' '}
          <Link
            tabIndex={0}
            href="https://github.com/Center-for-AI-Innovation/ai-ta-backend"
            className="link-hover link text-[--footer-link] hover:text-[--footer-link-hover]"
            target="_blank"
            rel="noopener noreferrer"
          >
            backend
          </Link>{' '}
          code.
        </span>
        <div>
          <Link
            tabIndex={0}
            href="https://status.osc.chat"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://status.osc.chat/api/badge/1/uptime/24?label=Uptime%2024%20hours"
              alt="Service Uptime Badge"
              width={110}
              height={50}
            />
          </Link>
        </div>
      </div>
    </footer>
  )
}
