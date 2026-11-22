# Portfolio redesign QA

final result: passed

## Visual target and evidence

- Source: `C:/Users/NITRO/Downloads/Portfolio- Home (3).pdf`, a 1440 × 5497 Figma export.
- Rendered reference: `C:/Users/NITRO/Documents/ChatGPT/potfo/tmp/home-new-reference.png` (1152 × 4398, 0.8 scale).
- Implementation: `http://127.0.0.1:4181/`, served from this checkout on `codex/portfolio-redesign`.
- Final desktop capture: `C:/Users/NITRO/Documents/ChatGPT/potfo/tmp/redesign-reference/implementation-desktop-final.jpg` (1424 × 5601 content pixels at a 1440 × 1000 CSS viewport; browser scrollbar excluded from the screenshot).
- Combined comparison: `C:/Users/NITRO/Documents/ChatGPT/potfo/tmp/redesign-reference/comparison-full.jpg`. Both captures were normalized to 720 pixels wide without stretching their heights.
- Focused comparisons: `comparison-hero.jpg` and `comparison-projects.jpg` in the same evidence directory. These compare the original and rendered hero, artwork, typography, card proportions, tags, and actions together.
- Responsive captures: `home-en-mobile-top.jpg`, `implementation-fa-mobile.jpg`, `home-fa-desktop.jpg`, and `ai-mobile.jpg` in the same evidence directory.
- States: English and Persian home, mobile navigation, reading pages, wrong-password feedback, unlocked case study, and relocked case study.

## Fidelity surfaces

- Typography: local Plus Jakarta Sans and Space Grotesk, matching the existing brand and reference's geometric body/display styling. Persian uses the existing four Yekan Bakh weights. Hero keeps its solid first line and outlined second line. Copy is actual text, not a screenshot.
- Spacing/layout: 1280-pixel desktop content width, 3:2 project columns, staggered cards, full-width reading app card, alternating career timeline, rotated passion notes, grid-backed statement, and four contact cards. Mobile uses a single column with retained reading order. The fluid page is approximately 104 pixels taller than the Figma page because live font wrapping and responsive measurements replace fixed artwork bounds.
- Colors: sampled dark navy page (#0a0722), purple panels (#16132f), orange actions (#ff770e), purple highlights (#8645ff), blue tags, and light typography. Existing case-study cards were themed for readable contrast; the actual product UI demos retain their own light UI colors.
- Imagery: real project visuals and company marks extracted from the supplied PDF. Background grid contours were extracted from its vector paths. No generated project screens were added. Standard control icons are Phosphor assets, with their license included.
- Content: all original AI and UX Pattern reading articles match the saved starting commit after line-ending normalization. Both Map ciphertext payloads match exactly. Existing three case studies keep their summaries, all original anchors, all UI motion cards and encrypted full content.

## Comparison history and fixes

1. Initial capture found an oversized Map mockup and artwork touching the title (P2). Constrained the media area and set the source artwork to its measured 475-pixel width. Final focused comparison shows the intended scale and clear title separation.
2. AI artwork started too low and expanded its card (P2). Reduced its media height and top gap to align the product presentation and card rhythm with the source. Re-captured and compared the project grid.
3. The first background export included outlined Figma text (P1). Replaced it with only the original long, thin vector contours, extracted from the PDF. The final hero contains only live text over the grid.
4. Persian desktop reading-app copy and artwork overlapped (P1). Corrected logical margins; verified the image occupies x=160–630 and copy x=851–1321 at desktop width.
5. The AI responsibility list inherited low-contrast original text (P2). Added the correctly scoped dark-theme text color; verified computed color rgb(195,187,209).

No actionable P0/P1/P2 visual defects remain in the checked views.

## Behavior and preservation checks

- In-app browser verification at 1440, 390, and 320 CSS pixels. No horizontal viewport overflow in the checked English/Persian home and reading pages.
- Five featured products, six career entries, five passion cards, and four working contact channels.
- Header navigation stays within the home page. Legacy About, Contact, Projects and Case Studies URLs point to the relevant home anchors in each language.
- Mobile menu opens and closes on selection. Contact copy produced a successful clipboard status.
- Existing CV PDF blob is unchanged and all download links resolve to it.
- Password gate rejects an incorrect password, unlocks with the existing password, and clears the unlocked DOM when relocked. Verified English and Persian Map pages and the new Real Estate overview.
- AI retains 7 sections and 8 motion cards; UX Pattern retains 8 sections. Table-of-contents anchors resolve in both languages.
- Static source check passed 219 local links/assets, original article/payload preservation, legacy routes, no plaintext passwords, and unchanged original branch tip.
- `node --check redesign.js` and `git diff --check` passed. Browser error logs were empty in the checked sessions.

## Content limits and follow-up polish

- The old branch contains a short Real Estate project description and a role statement, rather than a long-form case study. The new protected overview reuses those statements only. It does not invent research, decisions, evidence, or outcomes. Further supplied content can replace that brief overview.
- Rahro preserves the original Behance case-study destination.
- The persistent language switch is retained beside the name to preserve bilingual access, although the PDF does not depict it.
- Exact browser font rasterization, minor grid opacity and soft ambient glow can be refined after visual feedback (P3).

## Handoff checklist

- Local redesign branch only; no push, merge, Pages change, or deployment.
- Original `codex/portfolio` remains at `e8c7be0`.
- Original `C:/Users/NITRO/Documents/ChatGPT/Portfolio` directory remains untouched.
- Keep the local preview available for user review before publication.
