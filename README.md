# Global Acceleration Lab — Homepage (React)

A component-based rebuild of the GAL discovery homepage, using Vite + React + Tailwind.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production build in `dist/`.

## Structure

```
src/
  components/
    Nav.jsx              sticky pill navigation, active-section highlighting
    Hero.jsx              first fold: headline + floating CTA widget
    Pathways.jsx          the three builder-pathway cards
    PathwayCard.jsx        single reusable pathway card
    Ecosystem.jsx          formal 4-panel "Academia / Builder / Industry / Government" section
                            (replaces the earlier circular diagram)
    IMT.jsx                Incubation Management Training focus list
    FAQ.jsx / FAQItem.jsx  accordion FAQ
    Footer.jsx             closing CTA
    DiscoveryForm/
      DiscoveryForm.jsx    orchestrates the 6-step form's state
      ProgressBar.jsx
      StepText.jsx         steps 1 & 4 (open text)
      StepRadio.jsx        step 2 (single select)
      StepMultiSelect.jsx  step 3 (multi select)
      StepContact.jsx      step 5 (persona + contact fields)
      StepConsent.jsx      step 6 (consent checkboxes + submit)
      SuccessState.jsx     "You're a GAL Builder." confirmation
  data/
    pathways.js            copy + options for the three pathway cards
    ecosystem.js            copy for the ecosystem panels
    imt.js                  IMT focus areas
    faq.js                  FAQ questions/answers
    formSteps.js            full 6-step form schema
  hooks/
    useScrollReveal.js      IntersectionObserver-based fade/slide-in
    useActiveSection.js     tracks which section is in view, for the nav
  App.jsx                   composes all sections
  main.jsx                  React entry point
  index.css                 Tailwind layers, design tokens, animation classes
```

## Notes

- All section copy and form questions live in `src/data/*.js` — edit those
  files rather than the components to change content.
- `DiscoveryForm` currently logs the completed answers to the console on
  submit (`handleSubmit` in `DiscoveryForm.jsx`). Wire that function to your
  backend, Airtable, or a form service when ready.
- The background uses a very light dot-grid (`index.css`, on `body`) instead
  of a flat fill, and the previous circular triple-helix diagram has been
  replaced by `Ecosystem.jsx`, a plain four-panel row with no SVG.
