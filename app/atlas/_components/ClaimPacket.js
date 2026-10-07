'use client'

/**
 * Copyright 2026 Stephen Thompson / The Founded Project
 * Export or copy a claim packet. The Markdown is assembled on the server
 * from the structured records; this only hands it to the browser.
 */

import { COPY } from './copy'
import { downloadText, copyText } from './store'
import { Toast, useToast } from './Controls'

export default function ClaimPacket({ filename, markdown }) {
  const [msg, show] = useToast()
  return (
    <div className="a-row">
      <button type="button" className="a-btn a-btn-gold a-btn-sm" onClick={() => { if (downloadText(filename, markdown)) show(COPY.claim.exported) }}>{COPY.claim.export}</button>
      <button type="button" className="a-btn a-btn-secondary a-btn-sm" onClick={async () => { if (await copyText(markdown)) show(COPY.claim.copied) }}>{COPY.claim.copy}</button>
      <Toast message={msg} />
    </div>
  )
}
