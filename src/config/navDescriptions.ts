// @summary Short hover blurbs for main-nav products and sub-nav leaves.
// Looked up by path; missing paths simply skip the descriptive tooltip.

const NAV_DESCRIPTIONS: Record<string, string> = {
  "/home": "Your workspace overview and starting point",
  "/wingz": "AI assistant, agents, and automated workflows",
  "/experimentation": "Test a change and measure its impact",
  "/web-experiment-old": "Classic web experimentation experience",
  "/personalize": "Tailor experiences to the right visitors",
  "/feature-management": "Ship and control features with flags and rollouts",
  "/commerce": "Catalog, recommendations, and merchandising tools",
  "/analytics": "Journey and product analytics in one place",
  "/insights": "See how people use your site and apps",
  "/pulse": "Collect feedback with surveys and concept tests",
  "/engage": "Reach visitors with push and messaging",
  "/data-360": "Profiles, events, segments, and attributes",
  "/plan": "Capture observations, hypotheses, and ideas",
  "/settings": "Account, workspace, and preferences",
  "/activity-timeline": "Recent activity across your workspace",
  "/helpdesk": "Help, docs, and support",

  "/home/dashboard": "See performance across products at a glance",
  "/home/get-started": "Guided setup for your workspace",
  "/home/roi-dashboard": "Campaign performance and ROI overview",
  "/home/account-overview": "Impact metrics for your account",

  "/wingz/chat": "Ask Wingz for ideas, analysis, and next steps",
  "/wingz/agents": "Browse and run automation agents",
  "/wingz/workflows": "Build and manage multi-step workflows",
  "/wingz/synthetic-ab": "Simulate A/B outcomes before you ship",

  "/web-experiment": "Run A/B and multivariate tests on your site",
  "/web-rollouts": "Roll out winning variations safely",
  "/mobile-app-ab": "Experiment on your mobile apps",

  "/feature-management/feature-flags": "Release features safely behind flags",
  "/feature-management/flag-rollout": "Gradually roll features to more users",
  "/feature-management/flag-testing": "Experiment on flagged features",
  "/feature-management/flag-multivariate": "Test multiple feature variants together",
  "/feature-management/flag-personalize": "Personalize experiences with flags",
  "/feature-management/holdout": "Hold back a baseline group for comparison",

  "/commerce/catalog": "Browse and manage your product catalog",
  "/commerce/recommendations": "Configure product recommendation strategies",

  "/analytics/overview": "Journey analytics at a glance",
  "/analytics/browse": "Explore journeys and funnels",

  "/insights/dashboard": "Behavior analytics overview",
  "/insights/heatmaps": "See where people click, scroll, and engage",
  "/insights/session-recordings": "Watch real visitor sessions",
  "/insights/mobile-recordings": "Watch sessions from mobile apps",
  "/insights/forms": "See how people complete your forms",
  "/insights/metric-reports": "Track custom metrics over time",
  "/insights/funnel-reports": "Measure drop-off across steps",

  "/pulse/surveys": "Ask visitors what they think",
  "/pulse/concept-test": "Validate concepts before you build",
  "/pulse/templates": "Start from ready-made survey templates",
  "/pulse/settings": "Survey and feedback preferences",

  "/data-360/introduction": "Get oriented in Data 360",
  "/data-360/profiles": "Browse visitor and account profiles",
  "/data-360/attributes": "Define traits you can segment on",
  "/data-360/events": "Browse the events flowing into your project",
  "/data-360/segments": "Group visitors by shared traits and behavior",
  "/data-360/triggers": "Fire actions when conditions are met",
  "/data-360/audiences": "Build audiences for targeting",
  "/data-360/metrics": "Define metrics you can analyze",
  "/data-360/funnels": "Map conversion paths across events",
  "/data-360/audit": "Review changes across Data 360",

  "/plan/observations": "Log what you notice in the product",
  "/plan/hypotheses": "Turn observations into testable hypotheses",
  "/plan/ideas": "Capture ideas for future experiments",

  "/commerce/merchandising": "Rules and strategies for merchandising",
  "/commerce/search": "Configure on-site product search",
  "/commerce/visuals": "Product widgets and visual merchandising",
  "/commerce/usage-dashboard": "Usage and consumption overview",
  "/commerce/health-monitor": "Monitor catalog and feed health",
  "/commerce/settings": "Commerce product preferences",

  "/feature-management/tech-debt": "Track and clean up unused flags",

  "/configuration": "Websites, integrations, and shared assets",
};

export function navDescriptionFor(path: string): string | undefined {
  return NAV_DESCRIPTIONS[path];
}
