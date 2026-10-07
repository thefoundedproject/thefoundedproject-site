/**
 * Copyright 2026 The Founded Project
 * Private proposal page for Andrew Yang. Unlisted: noindex, not in the sitemap.
 */
import Proposal, { P, Steps, proposalMetadata } from '../Proposal'

export const metadata = proposalMetadata(
  'andrew-yang',
  'A conversation, and a first project with Noble',
  'A proposal from Stephen Thompson to Andrew Yang: the Founded ecosystem, and a 90-day pilot with Noble Mobile.',
)

export default function AndrewYangPage() {
  return (
    <Proposal
      recipient="Andrew Yang"
      title="A conversation, and a first project with Noble"
      date="October 5, 2026"
      intro={
        <>
          <P>
            On Jubilee on September 27, you argued with twenty AI optimists that the market will optimize for profit over human
            dignity. In your newsletter the next day, you wrote that most Americans feel &ldquo;the future is being built without
            them.&rdquo;
          </P>
          <P>
            I&apos;m Stephen Thompson, a clinician and educator in Minnesota. I run The Founded Project, a theory of human flourishing
            and a set of working tools that help a person run her own life, a family run its household, and a voter check what
            candidates say.
          </P>
          <P>
            Your proposals put money in people&apos;s hands: a dividend, a tax on automation, guardrails on the companies. Our tools
            cover what a person does with her days once the money arrives: deciding what they&apos;re for, keeping the family&apos;s
            risks in view, and checking a candidate&apos;s record against his talking points. The two fit together, and I want to show
            you how.
          </P>
        </>
      }
      project={{
        heading: 'A first project with Noble',
        body: (
          <>
            <P>
              Noble pays people to use their phones less, and each member then has to decide what to do with the hour she gets
              back. Your homepage promises &ldquo;tools that lead to better choices,&rdquo; and The Founded is one.
            </P>
            <P>I&apos;m proposing a 90-day pilot:</P>
            <Steps
              items={[
                'A cohort of a few hundred Noble members who opt in gets The Founded free for the pilot.',
                "The pilot uses only the features that work without an AI key: the rituals, the journal, the board, the decision log, and the iPhone's on-device AI. Android members use thefounded.app until the Android app ships.",
                "We answer one shared question: do members who keep a daily ritual in The Founded use less data than members who don't? Noble already records each member's data use. The Founded records whether the member completed the ritual.",
                "Members opt in on both sides. Neither company shares a person's records. We report results only as totals, and every group we report on has at least 50 people.",
              ]}
            />
            <P>
              Noble provides an introduction to its members and the cohort&apos;s data-use totals. Founded provides the app, the
              onboarding, and the study design.
            </P>
          </>
        ),
      }}
      ask="Thirty minutes with you. If the fit is real, we start with Noble and talk about the rest afterward."
    />
  )
}
