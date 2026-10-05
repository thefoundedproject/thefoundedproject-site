/**
 * Copyright 2026 The Founded Project
 * Private proposal page for Cornel West. Unlisted: noindex, not in the sitemap.
 */
import Proposal, { H2, P, Pairs, proposalMetadata } from '../Proposal'

export const metadata = proposalMetadata(
  'cornel-west',
  'A conversation about truth and soulcraft',
  'A proposal from Stephen Thompson to Cornel West: the Founded ecosystem, and one hour on Consider Otherwise.',
)

export default function CornelWestPage() {
  return (
    <Proposal
      recipient="Brother Cornel West"
      title="A conversation about truth and soulcraft"
      date="October 5, 2026"
      intro={
        <>
          <P>Brother West,</P>
          <P>
            At BYU in January, you said you love Robert George &ldquo;even when he&apos;s wrong.&rdquo; <em>Truth Matters</em> argues
            that two men who disagree can still search for the truth together. You called the deeper work &ldquo;soulcraft, character
            formation.&rdquo;
          </P>
          <P>
            I&apos;m Stephen Thompson, a clinician and educator in Minnesota and a fellow Alpha. I run The Founded Project: a theory of
            human flourishing, plus working tools that help a person, a family, and a community govern themselves. Soulcraft is the
            closest word I&apos;ve found for what we&apos;re building. A young man who can govern himself can sit across from a man he
            disagrees with and keep telling the truth.
          </P>
        </>
      }
      alignment={
        <>
          <H2>Where your work and ours meet</H2>
          <Pairs
            items={[
              ['Truth Matters', 'RhetoricalPoints checks every speaker’s claim against the same standard, and Consider Otherwise seats two people who disagree at one table.'],
              ['Character formation', 'The Founded and Founded Emerging turn it into a daily practice. Each morning, a person decides what the day is for, and each evening, she looks at what she did with it.'],
              ['Democratic decay', 'GroundedVote shows a voter where an incumbent’s record and public statements part ways.'],
              ['The fraternity', 'I’ve prepared the Emerging framework for Alpha chapters, so a chapter can teach governance of self before governance of anything bigger.'],
            ]}
          />
        </>
      }
      project={{
        heading: 'A first project',
        body: (
          <P>
            One hour on Consider Otherwise, with a guest you choose: a friend you love and disagree with. RhetoricalPoints checks every
            claim on air, yours and mine included. Afterward, we cut the conversation into a teaching session that Alpha chapters can
            run.
          </P>
        ),
      }}
      ask="The hour, or thirty minutes by phone first, if you'd rather meet the work before the camera."
    />
  )
}
