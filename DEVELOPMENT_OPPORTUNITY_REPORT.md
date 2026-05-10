# Development Opportunity Report

This report tracks the practical opportunity categories for making DoinkTV more engaging, noteworthy, functional, and distinctive.

## 1. Live Performance / FX Rig

Implemented now:
- FX snapshots can save the current live rack state.
- Saved snapshots can be launched back into the broadcast.
- Show Control already exposes scenes, block-aware macro ceilings, clean signal, active rack state, and cue pads.

Next best additions:
- Snapshot delete/rename.
- Crossfader between clean signal and a chosen snapshot.
- Macro mapping editor for rack units.
- Per-admin performance presets.

## 2. Block Identity

Implemented now:
- Blocks can carry a scene, cue, chaos ceiling, bump package, and explanatory note.
- The admin Show Control panel displays the active block pack and bump package.

Next best additions:
- Editable block identity cards.
- Block archive pages.
- Per-block intro/outro/next-up bump package generation.
- Block rituals and recurring viewer prompts.

## 3. Continuity Engine

Implemented now:
- Continuity log records schedule, queue, FX, performance, bumps, mode changes, and community events.
- Current and next program entries include a reason string explaining why they are airing.
- Viewer UI now surfaces the reason under Now/Next.

Next best additions:
- Filterable continuity log.
- “Why is this playing?” admin drawer.
- Automatic next-up cards.
- Underrun/overrun decisions with visible explanations.

## 4. Community / Patreon Loop

Implemented now:
- Crew picks can move into Archive search, queueing, approval, and outcome tracking.
- Supporter/crew activity can feed generated performance bumps.

Next best additions:
- Public pick history.
- Aired/credited state for picks.
- Monthly crew-programmed slot.
- Crew wall and supporter roster controls.

## 5. Internet Archive Discovery

Implemented now:
- Archive search results include a quality label, score, and compact flags.
- Search-to-queue can approve a crew pick and attach an outcome.

Next best additions:
- Rejection memory.
- Block-specific search recipes in the UI.
- Language/caption scoring.
- Preview drawer with file/caption metadata.

## 6. Bump System

Implemented now:
- Bump classes include block, legal ID, call-in, supporter shoutout, crew pick handoff, fade break, and filler concepts.
- Performance cues can queue generated bumps.

Next best additions:
- Dedicated bump package editor.
- Generated bump history and reuse.
- Audio-reactive bump modes.
- Block-specific bump style overrides.

## 7. Viewer Experience

Implemented now:
- Now/Next can explain why an item is airing.
- Peace mode, captions, voting, chat, community card, Patreon link, and schedule awareness already exist.

Next best additions:
- Tonight on DoinkTV strip.
- Watch-party reactions separate from chat.
- Better “available captions” indication.
- Viewer-facing block pages.

## 8. Admin Usability

Implemented now:
- Mission Control shows mission, next-six, audit flags, metrics, and continuity log.
- Station health shows schedule/source/stream warnings.

Next best additions:
- Single command dashboard.
- Draft schedule edits.
- Undo for queue/schedule mutations.
- Batch crew-pick tools.

## 9. Reliability / Operations

Implemented now:
- Runtime logs are ignored.
- Default admin credentials surface as an admin health warning.
- Syntax checks remain green.

Next best additions:
- Behavioral tests with `node:test`.
- Split large server/client files by domain.
- Persistent production state strategy.
- Media health check repair actions.

## 10. DoinkTV Differentiators

Implemented now:
- The project is converging around a live broadcast instrument: performance racks, scenes, block identity, community picks, generated bumps, continuity, and Archive discovery.

Next best additions:
- Broadcast memory pages.
- Recaps and lore generated from the continuity log.
- Live takeover mode with viewer-visible context.
- Community-to-air rituals that happen every week.
