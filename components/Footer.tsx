export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-paper2">
      <div className="container-page flex flex-col items-center gap-3 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <div className="font-display text-base font-bold text-ink">
            Shiny<span className="text-accent">.</span>Press
          </div>
          <p className="mt-1 text-xs text-inksoft">
            Playbooks for people building an AI-powered service business.
          </p>
        </div>
        <p className="text-xs text-inkfaint">
          &copy; {new Date().getFullYear()} Shiny Press. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
