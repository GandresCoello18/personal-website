import type { MDXComponents } from "mdx/types"
import { DraftSection } from "@/components/cases/draft-section"
import { MeniuzArchitecture } from "@/components/cases/meniuz-architecture"
import { OrderLifecycleArchitecture } from "@/components/cases/order-lifecycle-architecture"
import { TayosArchitecture } from "@/components/cases/tayos-architecture"
import { getMdxComponents } from "@/components/mdx-components"

export function getCaseMdxComponents(): MDXComponents {
  return {
    ...getMdxComponents(),
    DraftSection,
    MeniuzArchitecture,
    TayosArchitecture,
    OrderLifecycleArchitecture,
  }
}
