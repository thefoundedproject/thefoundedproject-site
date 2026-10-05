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
            On Jubilee on September 27, you told twenty optimists that the market will optimize for profit over human dignity. The
            next day you wrote that most Americans feel &ldquo;the future is being built without them.&rdquo;
          </P>
          <P>
            I&apos;ve spent the last year building for that feeling. I&apos;m Stephen Thompson, a clinician and educator in Minnesota,
            and I run The Founded Project: a theory of human flourishing, plus working tools that help a person, a family, and a
            community govern themselves.
          </P>
          <P>
            Your answers to AI displacement mostly move money: a dividend, a tax on automation, guardrails. Founded works on the other
            half of the problem. Cash lets a person stop drowning. It doesn&apos;t give her a way to decide what her days are for,
            keep her family&apos;s risks in view, or tell a candidate&apos;s record from his talking points. That&apos;s what
            we&apos;ve built.
          </P>
        </>
      }
      project={{
        heading: 'A first project with Noble',
        body: (
          <>
            <P>
              Noble pays people to use their phones less. A Noble member still has to decide what to do with the time she gets back.
              Your homepage promises &ldquo;tools that lead to better choices.&rdquo; The Founded is one of them.
            </P>
            <P>I&apos;m proposing a 90-day pilot:</P>
            <Steps
              items={[
                'A cohort of a few hundred Noble members who opt in gets The Founded free for the pilot.',
                "The pilot runs on the features that work without an AI key: the rituals, the journal, the board, the decision log, and the iPhone's on-device AI. Android members use thefounded.app until the Android app ships.",
                'We answer one shared question. Do members with a daily self-governance practice use less data than members without one? Noble already measures the outcome. Founded measures the practice.',
                "Members opt in on both sides. Neither company shares a person's records. We report results in aggregate, and no reported group falls under 50 people.",
              ]}
            />
            <P>
              Noble brings an introduction to its members and the cohort&apos;s aggregate data numbers. Founded brings the app, the
              onboarding, and the study design.
            </P>
          </>
        ),
      }}
      ask="Thirty minutes with you. If the fit is real, we start with Noble and talk about the rest after."
    />
  )
}
