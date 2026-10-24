# VOLT — Lithium Battery Website PRD

## Objective
Create a complete, visually led battery showcase for two user-specified products: 12V 100Ah and 24V 100Ah. Use plain HTML, CSS and JavaScript. Keep visitor-facing copy brief.

## Product approach
VOLT is a working brand for this concept. No real manufacturer specifications, pricing, certifications, cycle-life promises, testimonials or checkout are invented. Product geometry is illustrative. Only voltage and capacity are provided facts; nominal energy is derived as V × Ah.

## Audience and journey
Visitors explore the battery, switch models, inspect its 3D exterior, compare capacity, and estimate runtime for their own load. A downloadable specification summary provides a useful next step without requiring an unconfigured contact service.

## Design
Warm ivory canvas, near-black typography, acid-yellow accent, fine grid lines, oversized editorial headings, and a large graphite-and-lime 3D battery. Responsive desktop and mobile layouts. Short labels and numbers carry most of the information.

## Requirements
1. Navigation: Overview, Models and Runtime; working anchor links and mobile navigation.
2. Hero: animated 3D battery built from CSS geometry; pointer/touch drag rotation; auto-rotation toggle; reset-view control; model selector that updates the 3D label, energy, specifications and runtime calculator.
3. Model comparison: two selectable models with 100Ah capacity and nominal energy of 1,200Wh / 2,400Wh. Clear selected state.
4. Runtime: adjustable load, model selection, editable usable-energy percentage and estimated hours. Formula: voltage × Ah × usable fraction ÷ load watts. Values are estimates and exclude real-world system losses.
5. Explore: visual use-case buttons with preset loads; these are calculator examples, not verified compatibility claims.
6. Downloads: generate a model-specific text specification summary in the browser.
7. Accessibility: semantic landmarks, keyboard-operable controls, visible focus, labeled range and number inputs, live updates, sufficient contrast and reduced-motion support.
8. Responsive: no horizontal overflow; usable touch controls; layouts at 360px, 768px and desktop widths.
9. Privacy/performance: no tracking, accounts, third-party scripts or required external assets.

## Deliverables
- PRD.md, created before implementation.
- dist/index.html, dist/styles.css, dist/app.js.
- README.md with launch instructions and limitations.
- Working local preview and hosted deployment if the Sites service is available.

## Acceptance
Both models update every dependent view consistently. Drag, spin, reset, calculator presets, direct numeric entry, downloads and navigation function. Nominal runtime for a 100W load at 90% usable energy is 10.8h for 12V and 21.6h for 24V. Site remains usable with reduced motion and on narrow screens. No fake contact submission or purchase flow.


## Revision 2 — multipage and custom builds
- Four standalone HTML pages: Home, Models, Custom Build and Runtime. Shared navigation and active-page states.
- Custom builder: 3–96V in 0.1V steps and 1–1,000Ah integers; live 3D labels, calculated Wh/kWh, presets, explicit local save, plain text download and runtime link carrying validated configuration. Ranges describe UI inputs, not manufacturing capability.
- Light/dark toggle on every page. Persist preference locally, default to system preference, prevent theme flash.
- Two locally hosted AI-generated concept images: solar cabin and battery workshop.
- Preserve responsive layout, 3D controls, minimal copy, keyboard accessibility and reduced motion.
- Verify custom 48V × 200Ah = 9.6kWh and runtime = 86.4h at 100W / 90%. Validate negative, empty, over-limit and fractional-invalid inputs.


## Revision 3 — prismatic cells
- User confirmed a prismatic cell format. Update hero, model page, custom build and downloadable summaries accordingly.
- Replace active cylindrical-cell imagery with prismatic workshop imagery; add prismatic cell and terminal-detail images to Home, Models and Custom Build.
- Do not infer chemistry, cell manufacturer, exact series/parallel arrangement, dimensions or other ratings from cell format. Imagery remains explicitly illustrative.
- Preserve all existing interactive functionality and theme behavior.


## Revision 4 — Contact
- New Contact page linked from the shared navigation and footer.
- General query and custom prismatic battery enquiry modes. Required name, reply email and 10–1,500 character message; optional phone and application. Custom mode adds required voltage, capacity and pack quantity.
- Custom builder forwards validated voltage/Ah to the contact form.
- User-supplied recipient: contact@example.com. Prepare a reviewable enquiry, then open the visitor’s email app using a correctly encoded mailto link. Clear copy explains that the visitor must send the email. No fake successful-delivery state.
- Copy and plain text download fallbacks for visitors without a configured email app. Contact details are not stored in browser storage.
- Preserve five-page responsive navigation, dark/light theme and existing interactions.


## Revision 5 — warm copper theme and naming research
- User selected warm cream, copper and charcoal. Apply throughout all five pages and both light/dark modes, including the 3D case, labels, calculator and contact form.
- Remove unsubstantiated registered-trademark symbols. Keep VOLT as the existing working name pending the user’s selection and trademark clearance.
- Research Indian Class 9 marks. Document findings and the preliminary candidate Prismavik in NAMING_RESEARCH.md. Search-engine absence is not proof of registration availability.


## Revision 6 — green glass theme
- Restore green/lime colours at the user’s request. Mint light mode and deep forest dark mode.
- Frosted translucent surfaces, backdrop blur, soft borders, rounded geometry and green ambient gradients across navigation, 3D viewer, model cards, runtime, builder, image galleries, contact and footer.
- Keep physical 3D geometry opaque and legible, preserve all interactions and reduced motion. Provide opaque fallback surfaces where backdrop filtering is unsupported.
- Retain the working name without registered-trademark symbols; no new naming request in this revision.


## Revision 7 — standard model pricing
- User supplied INR 18,000 for 12V 100Ah and INR 28,000 for 24V 100Ah.
- Show prices on model cards and on the selected model’s Home/Models hero; update immediately when models switch.
- Include standard model prices in spec downloads. Do not infer custom-build prices, tax or shipping terms.


## Revision 8 — runtime 48V and custom batteries
- Add 48V / 100Ah as a runtime preset alongside 12V and 24V. No 48V price or new standard product is implied.
- Add a Custom mode with inline voltage and Ah inputs, validation, calculated energy and live runtime. Retain the builder query-string handoff and add a contact link for the current custom values.
- Runtime defaults remain 100W and 90% usable energy; 48V / 100Ah yields 43.2h, 48V / 200Ah yields 86.4h. Switching to a preset hides custom fields and restores 100Ah.
- Preserve 12V/24V product price behavior and both glass themes.


## Revision 9 — blue glass and general homepage enquiry
- User requested a blue theme and approved replacing the home closing specs download with a generic Contact link.
- Use “Enquire about a battery” linking to contact.html with no model, voltage, capacity or query parameters. Selection changes must not modify this link.
- Apply blue/sky accents, cool light surfaces and navy dark surfaces throughout the five-page glass theme, including the 3D battery labels and calculators.
- Preserve model prices, runtime options, enquiry form and existing theme preference.


## Revision 10 — homepage battery motion
- Continuous slow turntable: one revolution per 90 seconds while visible and unpaused.
- Mouse hover eases to 1.065x zoom and pauses autonomous rotation; horizontal/vertical pointer movement controls yaw and pitch without dragging. Leaving the viewer eases back to normal scale and resumes from the current orientation if autoplay is enabled.
- Preserve pause/reset controls, keyboard rotation, touch drag and reduced-motion preferences. Keep Models and Custom Build viewers unchanged.


## Revision 11 — remove dark-theme switch
- Remove the theme toggle from all five headers and retire theme-switching JavaScript.
- Render the light blue glass palette immediately in HTML, independent of older saved preferences or OS appearance. Preserve model selection, custom builds, runtime and homepage battery motion.


## Revision 12 — placeholder contact address
- Replace the owner’s real email with contact@example.com throughout current website files and documentation.
- Label the address and email draft as demo placeholders; preserve copy/download enquiry previews.
- Update the live Site and GitHub main branch. Existing version history is not rewritten.
