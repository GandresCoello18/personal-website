"use client"

import Link from "next/link"
import type { ComponentProps } from "react"
import { trackEvent } from "@/lib/umami"

type TrackData = Record<string, string | number | boolean>

type TrackedLinkProps = ComponentProps<typeof Link> & {
  event: string
  eventData?: TrackData
}

export function TrackedLink({ event, eventData, onClick, ...props }: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackEvent(event, eventData)
        onClick?.(e)
      }}
    />
  )
}

type TrackedAnchorProps = ComponentProps<"a"> & {
  event: string
  eventData?: TrackData
}

export function TrackedAnchor({ event, eventData, onClick, ...props }: TrackedAnchorProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackEvent(event, eventData)
        onClick?.(e)
      }}
    />
  )
}
