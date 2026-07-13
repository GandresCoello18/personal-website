type UmamiTracker = {
  track: (event: string, data?: Record<string, string | number | boolean>) => void
}

declare global {
  interface Window {
    umami?: UmamiTracker
  }
}

/** Canonical custom event names for the Umami dashboard. */
export const UmamiEvents = {
  downloadCv: "download-cv",
  viewProjects: "view-projects",
  showAllProjects: "show-all-projects",
  projectDemo: "project-demo",
  projectGithub: "project-github",
  serviceRequest: "service-request",
  contactNav: "contact-nav",
  contactEmail: "contact-email",
  contactCalendly: "contact-calendly",
  contactLinkedin: "contact-linkedin",
  contactFormSubmit: "contact-form-submit",
  contactFormSuccess: "contact-form-success",
  contactFormError: "contact-form-error",
  classgapProfile: "classgap-profile",
  socialClick: "social-click",
  blogCta: "blog-cta",
  blogPostClick: "blog-post-click",
  videosCta: "videos-cta",
  videoClick: "video-click",
  navServices: "nav-services",
  talkClick: "talk-click",
} as const

/** Fire a custom Umami event (no-op until the script is ready). */
export function trackEvent(
  event: string,
  data?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return
  window.umami?.track(event, data)
}
