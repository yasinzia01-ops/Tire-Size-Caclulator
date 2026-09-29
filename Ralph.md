# Ralph.md — Build loop instructions

You are the build agent for the TireSizeCalculator.pro Astro migration. Each run of the loop does **one task** and then stops.

## Every iteration

1. **Read** `solution.md` in full. It is the spec. Don't rely on memory from earlier iterations.
2. **Pick** the first unchecked `[ ]` task in §12 *Build Plan*. Don't skip ahead, and don't work on two tasks at once.
3. **Study before writing:**
   - For calculators, read the matching file in `_legacy/calculators/`. Port its formulas and behaviour exactly.
   - For content, fetch the live page (`https://tiresizecalculator.pro/<path>/`) and copy its text, headings, tables, links and FAQ **verbatim**.
   - Search `src/` first. Reuse existing components instead of creating duplicates.
4. **Implement** only that task.
5. **Verify**, in this order, and fix until all pass:
   ```
   npm run build
   npm test
   npx astro check
   ```
   Then confirm the task's **Done when** condition. For calculator tasks, compare against the live site for 3 sample inputs and write the inputs and outputs in the commit body.
6. **Update `solution.md`:** tick the task `[x]`. If you found something the owner must decide, add it under §10 with ⚠️.
7. **Commit** with the message `phase X.Y: <what was done>` (plus the co-author trailer). Do **not** push unless the owner asked.
8. **Stop** and report: task done, verification results, any ⚠️ items.

## Hard rules

- **Parity first.** Same URLs (trailing slash), same text, same numbers, same brand. No new features, sections, dependencies or redesigns beyond §7 of `solution.md`.
- **Never "fix" calculator math** so it disagrees with the live site. Flag the issue in §10 instead. The only approved exception is the speedo error sign in §4.
- **No placeholder content.** If you can't get live text, stop and report. Never invent copy, FAQs, stats or sources.
- **No tracking, ads or third-party scripts** except those §10 records as approved (currently only GA4 `GT-MBT5TB3W`).
- **Never change the live WordPress site.** Read public pages only. Don't use WordPress/Elementor connectors or MCP tools, wp-admin or the REST API to write anything.
- **Don't deploy** to Vercel and don't change DNS. The owner does that.
- **Don't edit `_legacy/`.** It is read-only reference.
- Keep the JS footprint minimal. Only calculators and the mobile-menu toggle ship scripts.
- If a test fails 3 times in a row on the same issue, stop, write what you tried in §10, and report.

## Definition of done (whole project)

All §12 tasks are ticked, the §8 SEO checklist is fully ticked, `npm run build` is clean with zero warnings from `astro check`, and every URL in §2 renders locally via `npm run preview`.

## Running the loop

Run it manually (one task per prompt):
> "Follow Ralph.md."

Or run it in a loop, for example with Claude Code's `/loop`:
> `/loop Follow Ralph.md; stop the loop when every task in solution.md §12 is [x] or you hit a blocker.`
