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
            At BYU in January, you said you love Robert George &ldquo;even when he&apos;s wrong.&rdquo; The book the two of you wrote,{' '}
            <em>Truth Matters</em>, argues that two men who disagree can still search for the truth together. In the same
            conversation, you called the deeper work &ldquo;soulcraft, character formation.&rdquo;
          </P>
          <P>
            I&apos;m Stephen Thompson, a clinician and educator in Minnesota, and a fellow Alpha. I run The Founded Project, a theory of
            human flourishing and a set of working tools that help a person run his own life, a family run its household, and a voter
            check what candidates say. Soulcraft is the closest word I&apos;ve found for what the tools are for. I&apos;m trying to
            build character formation into a daily habit.
          </P>
        </>
      }
      alignment={
        <>
          <H2>Where your work and ours meet</H2>
          <Pairs
            items={[
              ['Truth Matters', 'RhetoricalPoints checks every speaker’s claim against the same standard. Consider Otherwise puts two people who disagree on the same live show and lets them work it out.'],
              ['Character formation', 'The Founded and Founded Emerging make it a daily habit. Each morning, a young man decides what the day is for. Each evening, he reviews what he actually did with it.'],
              ['Democracy', 'GroundedVote shows a voter which candidates match her priorities, and compares an incumbent’s sponsored bills with his public statements.'],
              ['The fraternity', 'I’ve prepared the Emerging framework for Alpha chapters. A chapter can use it to teach its younger brothers to set a mission, log their decisions, and review them each month.'],
            ]}
          />
        </>
      }
      project={{
        heading: 'A first project',
        body: (
          <P>
            One hour on Consider Otherwise, with a guest you choose: a friend you love and disagree with, the way you and Robert George
            do it. Afterward, we edit the conversation into a
            teaching session that Alpha chapters can run at a chapter meeting.
          </P>
        ),
      }}
      ask="The hour on the show, or a thirty-minute phone call first if you want to look at the tools before you agree to be on camera."
    />
  )
}
