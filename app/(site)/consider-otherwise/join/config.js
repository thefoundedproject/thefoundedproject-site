/**
 * Copyright 2026 Dr. Stephen Thompson DC, DACM, BCTMB, FAIHM
 * The Founded Project — thefoundedproject.com
 * All rights reserved.
 *
 * Consider Otherwise — join gate configuration.
 *
 * Everything that changes between episodes or setups lives here, so the page
 * itself never needs editing. The invite link is assembled from these values
 * rather than pasted, because a hand-pasted link is how the queue parameter
 * quietly goes missing.
 */

/** VDO.Ninja room name. Whoever joins as director first claims the room. */
export const ROOM = 'considerotherwise'

/**
 * Room password. Set it and the invite link carries it, so the room name alone
 * gets nobody in. Leave it null to run the room open.
 *
 * This is a speed bump, not the gate. The real gate is `&requireapproval` on
 * the director link plus the hold screen below. Anyone who agrees to the rules
 * can still forward their link to someone who didn't.
 */
export const PASSWORD = null

/**
 * Guest queue mode. `queue4` is `holdwithvideo`: the guest sits on a message
 * screen while the director can already see and hear them. That is the whole
 * screening step, and it happens before anyone is on air.
 *
 * Alternatives, if the posture changes:
 *   'queue'   plain hold. Since v24 neither side sees the other first.
 *   'queue2'  guest can see and hear the director while waiting.
 *   'queue3'  guest sees a message, director gets control boxes only.
 */
export const QUEUE_MODE = 'queue4'

/**
 * How long a caller's note is kept, in months. Set by Dr. Thompson 2026-08-10.
 *
 * The note records what was discussed and which claims got checked, and nothing
 * else. The page refuses to show the invite link while this is null, because
 * telling someone what you keep without telling them how long is the part that
 * ages badly. The consent copy reads this value directly, so changing it here
 * changes what a caller is promised.
 */
export const RETENTION_MONTHS = 12

/** The guest invite link. Assembled, never pasted. */
export function inviteLink() {
  const params = [`room=${encodeURIComponent(ROOM)}`, QUEUE_MODE]
  if (PASSWORD) params.push(`password=${encodeURIComponent(PASSWORD)}`)
  return `https://vdo.ninja/?${params.join('&')}`
}

/**
 * The director link, for reference. Not rendered on this page and not public.
 * `requireapproval` holds each join until approved, `approvepopup` raises a
 * modal per request, and `notify` makes it audible, because the popup is silent
 * on its own.
 */
export function directorLink() {
  const params = [`director=${encodeURIComponent(ROOM)}`, 'requireapproval', 'approvepopup', 'notify']
  if (PASSWORD) params.push(`password=${encodeURIComponent(PASSWORD)}`)
  return `https://vdo.ninja/?${params.join('&')}`
}

/** The rules. Stephen's words carry the rule; the gloss is for a stranger. */
export const RULES = [
  {
    rule: 'No PhilBro’ing.',
    gloss: 'Arguing to win. Performing certainty you don’t have. Treating a conversation as a stage and the other person as the audience. If you came to be impressive, this is the wrong room.',
  },
  {
    rule: 'This is a conversation with fact checking, not a debate.',
    gloss: 'Nobody is scoring you and nobody wins. When a claim comes up that we can check, we stop and check it on air. If a question needs the structure of a debate, it moves to the debate room instead.',
  },
  {
    rule: 'If you reject truth in the face of evidence, you are kicked.',
    gloss: 'Changing your mind is welcome and so is disagreeing with the evidence on stated grounds. Looking straight at it and continuing anyway ends the call.',
  },
]
