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

## Scroll motion follow-up

- Added one-time viewport entrances for hero copy, section headings, featured projects, career cards, passion notes, the statement, and contact cards. Project columns and contact cards have short staggered delays. Career cards enter from their physical side of the timeline.
- Web Animations affect only opacity and the independent translate property; layout, existing note rotations, and case-study UI loops stay intact. Content stays visible with unsupported APIs or disabled JavaScript. Keyboard focus finishes the relevant entrance immediately.
- Implemented reduced-motion support, including finishing active entrances when the preference changes. Smaller screens use shorter travel distances and no contact-card stagger.
- Verified actual `entering` and `visible` states and intermediate computed opacity/translation in the in-app browser for English project cards, timeline cards, and Persian project cards. No horizontal overflow or browser console errors in those checks. Reduced-motion preference handling was inspected in source; OS preference was not changed for testing.
- JavaScript syntax and Git whitespace checks passed. No publication.

### Softer motion and individual career scrolling

- Reduced entrance travel and extended general entrance durations to 820–980 ms with a gentler easing curve.
- Career cards now follow individual scroll progress instead of IntersectionObserver timing. Each starts at 82% of the viewport and completes within a travel range shorter than the spacing to the next card. Frame-rate-independent smoothing softens wheel and touch input. Completed cards remain visible when scrolling back.
- Verified using normal Down-key scrolling in the in-app browser: first career card reached `visible` at opacity 1.00 while the second was `entering` at 0.02 and the third remained `waiting` at 0.00. No scroll interception or automatic advancement. Keyboard focus and reduced-motion handling still reveal the content immediately.

### Pure fades and hero typing

- Replaced all home entrance translations with opacity-only fades lasting 1100–1250 ms. Career cards retain independent scroll progress with a longer fade range and gentler temporal smoothing; no side or vertical travel.
- Added a one-time, line-by-line hero typing sequence with a temporary blinking caret. Full text remains in the DOM with an accessible heading label. Font-aware grapheme boundaries control clipping, preserving Persian letter joining and the original heading dimensions, solid/outline styles, and line offsets.
- Reduced-motion preference skips typing; a preference change or resize safely completes the title. Case-study content and UI demonstration loops are unchanged.
- In-app browser verified English and Persian typing start/completion (`typedLines=2`, clip paths removed), no overflow, and no console errors. Persian career proof showed first card opacity 0.383818 while the next two waited at zero, with computed translation `none` for all three.
