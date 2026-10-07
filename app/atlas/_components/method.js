/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 *
 * The Methodology page's prose, kept as data so the voice check can read it
 * beside copy.js. Website copy: contractions are fine; no em dashes; one
 * earned distinction at most; no shame language.
 */

export const METHOD = {
  title: 'Method',
  lede: 'How this atlas was built, where every piece of text comes from, what the labels mean, and what nobody has checked yet.',
  sections: [
    {
      title: 'What the records are',
      paragraphs: [
        'A script reads five files for each of the 45 chapters in the manuscript vault: the Draft, which is the text of record; the Research Map; the Contrarian Review; the Overview; and the Questions file. It turns them into structured records: chapters, claims, sources, challenge records, and glossary terms. This website reads those records. It doesn\'t read the manuscript directly, and it never writes to it.',
        'Frameworks, Story Notes, and Revision Notes are author-private and the script does not open them. The Overview\'s opening-story candidates, the Contrarian Review\'s open issues, and the Questions file\'s inquiry questions are marked author-private in the atlas so a later public edition can leave them out.',
        'Editor markers in the drafts, the double-bracketed FLAG notes, were removed from every piece of text the atlas shows. The atlas counts them per chapter and nothing more.',
      ],
    },
    {
      title: 'Where each piece of text comes from',
      list: [
        'The chapter thesis is the Core Claim section of the Overview, in Stephen\'s words.',
        'The five-minute summary is the Overview\'s Chapter Purpose, Reader Problem, Chapter Movement, and Desired Reader Takeaway, unchanged.',
        'Key concepts, related core-theory files, and pull quotes also come from the Overview. Each pull quote is checked against the current draft and labelled as present, partly present, or absent.',
        'Study prompts are the Diagnostic and Workbook questions from the Questions file.',
        'Claims come from three places: the chapter\'s core claim; every sentence in the draft with a footnote on it; and every row of the Research Map\'s claim table.',
        'Sources come from the draft\'s footnotes (direct), the Research Map\'s validating sources (corroborating, or direct when they match a footnote), the evidence inside counterpoints (adversarial), and pointers to other chapters (contextual).',
        'Challenge records come from the Research Map\'s COUNTER and EDGE items and from the Contrarian Review\'s questions that were marked as a risk to watch or as needing your decision.',
      ],
    },
    {
      title: 'How claims are classified, and why most say unreviewed',
      paragraphs: [
        'Every type and importance label was assigned by a rule, and every record says which rule. A chapter\'s core claim is a synthesis and load-bearing by definition. A row in the Research Map\'s claim table is a fact, because that table is titled Empirical Claims. A footnoted sentence inherits fact when its source also sits in that table; otherwise its type stays unverified. Every other claim is supporting unless the Research Map\'s own wording calls its source thread the chapter\'s grounding claim.',
        'No person has reviewed these labels yet. Each record keeps a review status of unreviewed until someone changes it. The script doesn\'t guess a classification into confidence; where a rule doesn\'t apply, the field says so.',
        'Competing explanations are mapped by shared vocabulary between a claim and the chapter\'s counterpoints, and the mapping says so. A core claim gets the chapter\'s first steelmanned counterpoint at chapter level. Treat these as leads to check, and expect the Challenge Room to be the fuller picture.',
      ],
    },
    {
      title: 'Support states',
      definitions: [
        ['Cited in draft', 'The current draft has a footnote on this sentence.'],
        ['Mapped in Research Map', 'The Research Map ties the claim to a source thread. The detail says whether that source is also cited inline.'],
        ['Mapped, source in another chapter', 'The Research Map points to a source documented in a different chapter; the atlas resolves it where it can.'],
        ['Argued', 'The chapter\'s core claim. It rests on the chapter\'s reasoning and the sourced claims beneath it.'],
        ['Unsupported', 'No source was found in the draft or the Research Map.'],
      ],
    },
    {
      title: 'Stable IDs',
      paragraphs: [
        'Chapters are FP-CH02, claims are FP-CH02-C014, sources are FP-S0123, challenge records are FP-CH02-X03, and glossary terms are FP-T-agency. The script keeps a registry file beside the data. A record keeps its ID across re-runs as long as its text is the same; a record whose text changes gets a new ID and the old one is marked retired and never reused. Two source entries merge into one record when they share a URL or an identical lead.',
      ],
    },
    {
      title: 'Links',
      paragraphs: [
        'Every URL was requested once on the date shown beside it. Reachable means the server answered. Blocked means the publisher refuses automated requests, which is common for journal sites, and the link should be opened by hand. Broken means the server said the page does not exist. Unreachable means no answer came back.',
      ],
    },
    {
      title: 'What is not here yet',
      list: [
        'Page or section locators for most books. The citations give the work; the exact page is still to be added in the manuscript.',
        'A reviewed classification for any claim or source.',
        'A competing explanation mapped to each specific claim, rather than to the chapter.',
        'Many Overview pull quotes no longer appear in the current drafts; the Gaps page lists them.',
        'A public edition, a DOI, a corrections log, and teaching exports. Those are Phases 3 to 5 of the framework and are deliberately out of scope.',
      ],
    },
    {
      title: 'How to correct something',
      paragraphs: [
        'Fix the manuscript file, run the extractor, and commit the regenerated data. The atlas is a reading of the manuscript and is never the place where the text gets fixed. The command is in the repository under scripts/atlas, and it takes a minute.',
      ],
    },
    {
      title: 'Privacy',
      paragraphs: [
        'The atlas sits behind a password and is marked for search engines to ignore. Your progress, marks, bookmarks, notes, and the revisit queue are kept in this browser\'s local storage and nothing else. There are no analytics and no third-party scripts on these pages.',
      ],
    },
  ],
}
