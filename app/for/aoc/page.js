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
            In March, you and Senator Sanders introduced the AI Data Center Moratorium Act. You said Congress has to &ldquo;choose
            humanity over profit.&rdquo; The bill asks two questions: who gets the gains from AI, and who gets a say in where
            it&apos;s built.
          </P>
          <P>
            Those are questions about power. I&apos;m Stephen Thompson, a clinician and educator in Minnesota, and I run The Founded
            Project: a theory of human flourishing, plus working tools that help a person, a family, and a community govern
            themselves.
          </P>
          <P>
            Policy decides who owns the gains. A worker who just lost her shifts to software still has to decide what Monday looks
            like, keep her family&apos;s risks in view, and figure out which candidate means what he says. That&apos;s the part
            we&apos;ve built for.
          </P>
        </>
      }
      project={{
        heading: 'A first project in your district',
        body: (
          <>
            <Steps
              items={[
                'Your office picks one community organization in the Bronx or Queens: a workforce program, a tenant association, a union local.',
                'Its members get The Founded free for 90 days, plus a workshop on running a household as a governed enterprise.',
                'Members opt in. We report results only in aggregate, to the partner and to your office, and no reported group falls under 50 people.',
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
