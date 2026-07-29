# How to publish a Field Note

One file per entry in this folder. Name it `YYYY-MM-DD-short-slug.md`.
Push to main; Railway deploys within ~2 minutes and the note is live at
`/notes/<filename-without-.md>` plus the list, the RSS feed, and search
engines.

## Written post

```markdown
---
title: The title readers see
date: 2026-08-01
type: post
excerpt: One or two sentences for the list page and the RSS feed.
---
The body, in markdown. Headings with ##, **bold**, *italic*,
[links](https://example.com), - bullet lists, and > blockquotes all work.
```

## Vlog

```markdown
---
title: The video's title
date: 2026-08-01
type: vlog
youtube: dQw4w9WgXcQ
excerpt: One or two sentences about what the video covers.
---
Optional written companion text. It renders under the player.
```

`youtube:` is the 11-character id from the video URL
(`youtube.com/watch?v=THIS_PART`).

Ask Claude to draft, voice-check, and publish any of these; or drop the
file in yourself and push.
