# Demo sandbox

- URL: `https://accessible-page-capture.sociobot.in/?demo=1` (local: `http://localhost:5173/?demo=1`). `/demo` is an equivalent bookmarked route.
- Entry: the landing page action “Try it with sample data” opens `?demo=1` in one click.
- Sample: a finished 18.4-second travel-request barrier with six recorded focus, click, control-key, and redacted-input steps.
- Actions: edit the user note, inspect every recorded step, export Markdown, export JSON, reset, or download the Chrome extension.
- Reset: “Reset demo” removes the demo note and restores the bundled sample.
- Storage: only `localStorage` keys beginning `demo:accessible-page-capture:` are used. The sample itself ships in the JavaScript bundle.
- Isolation: demo mode does not read or write extension capture storage, license storage, or any non-demo application key.
- Offline check: visit `/demo` once, go offline, reload, and export either format.
