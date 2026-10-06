/**
 * Copyright 2026 The Founded Project
 * Private proposal page for Rep. Alexandria Ocasio-Cortez. Unlisted: noindex, not in the sitemap.
 */
import Proposal, { P, Steps, proposalMetadata } from '../Proposal'

export const metadata = proposalMetadata(
  'aoc',
  'A conversation about who AI is for',
  'A proposal from Stephen Thompson to Rep. Alexandria Ocasio-Cortez: the Founded ecosystem, and a community pilot in NY-14.',
)

export default function AocPage() {
  return (
    <Proposal
      recipient="Rep. Alexandria Ocasio-Cortez"
      title="A conversation about who AI is for"
      date="October 5, 2026"
      intro={
        <>
          <P>
            In March, you and Senator Sanders introduced the AI Data Center Moratorium Act, and you said Congress must &ldquo;choose
            humanity over profit.&rdquo; The bill pauses new AI data centers until safeguards are in place for workers, consumers,
            and the communities that host them. It also puts a direct question on the table: who gets the economic gains from AI?
          </P>
          <P>
            I&apos;m Stephen Thompson, a clinician and educator in Minnesota. I run The Founded Project, a theory of human flourishing
            and a set of working tools that help a person run her own life, a family run its household, and a voter check what
            candidates say.
          </P>
          <P>
            Your bill works on who owns the gains. Our tools work on the person living through the change. A warehouse worker whose
            shifts went to software has to rebuild her week, keep her family&apos;s bills and risks in view, and decide which
            candidate means what he says. We built the tools for her.
          </P>
        </>
      }
      project={{
        heading: 'A first project in your district',
        body: (
          <>
            <Steps
              items={[
                'Your office picks one community organization in the Bronx or Queens, such as a workforce program, a tenant association, or a union local.',
                'Its members get The Founded free for 90 days, plus a workshop, in person or by video, where they set a mission, start a decision log, and schedule a monthly check-in.',
                'Members opt in. We report results only as totals, to the partner and to your office, and every group we report on has at least 50 people.',
              ]}
            />
            <P>I&apos;m not asking the office to endorse anything.</P>
          </>
        ),
      }}
      ask="Thirty minutes with you, or with the staff member who covers AI and labor."
    />
  )
}
