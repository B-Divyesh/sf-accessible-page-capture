# Demo sandbox

- URL: `https://accessible-page-capture.sociobot.in/demo` (local: `http://localhost:5173/demo`)
- Entry: the landing page action “Try it with sample data” opens the same route in one click.
- Sample: a finished 18.4-second travel-request barrier with six focus, key, and redacted-input events.
- Actions: edit the user note, inspect every trace event, export Markdown, export JSON, reset, or download the extension.
- Reset: “Reset demo” removes the demo note and restores the bundled sample.
- Storage: only `localStorage` keys beginning `demo:accessible-page-capture:` are used. The sample itself ships in the JavaScript bundle.
- Isolation: demo mode does not read or write extension capture storage, license storage, or any non-demo application key.
- Offline check: visit `/demo` once, go offline, reload, and export either format.
