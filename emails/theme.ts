export const colors = {
  primary: "#3a6b99",
  secondary: "#409f56",
  success: "#58c570",
  warning: "#f0b100",
  white: "#FFFFFF",
  text: {
    body: "#404040",
    muted: "#737373"
  },
  background: {
    primary: "#e1e9f0",
    muted: "#e5e5e5"
  },
  border: "#e5e5e5"
};

export const spacing = {
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem"
};

export const fonts = {
  sans: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif"
};

export const align = {
  text: {
    center: "center" as const,
    left: "left" as const,
    right: "right" as const
  }
};

const badge = {
  display: "inline-block",
  padding: "0.35em 0.65em",
  fontSize: spacing.sm,
  lineHeight: "1",
  whiteSpace: "nowrap",
  verticalAlign: "baseline",
  borderRadius: "0.5rem",
  fontWeight: "bold"
};

export const badges = {
  warning: {
    ...badge,
    textAlign: align.text.center,
    backgroundColor: colors.warning,
    color: colors.warning
  },
  primary: {
    ...badge,
    textAlign: align.text.center,
    backgroundColor: colors.primary,
    color: colors.white
  }
};

export const styles = {
  container: {
    backgroundColor: colors.background.primary,
    padding: spacing.sm,
    letterSpacing: "0.5px"
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: "0.75rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    maxWidth: "602px"
  },
  logo: {
    fontFamily: fonts.sans,
    fontSize: spacing.xl,
    fontWeight: "bold",
    textAlign: "center" as const,
    color: colors.primary,
    margin: "0 0 0.5rem"
  },
  heading: {
    fontFamily: fonts.sans,
    fontSize: spacing.lg,
    fontWeight: "bold",
    color: colors.text.body,
    margin: "0",
    textAlign: "center" as const
  },
  subheading: {
    fontFamily: fonts.sans,
    fontSize: spacing.lg,
    color: colors.text.body,
    margin: "0.5rem 0"
  },
  hr: {
    margin: `${spacing.lg} 0`,
    borderTop: "none",
    height: "1px",
    backgroundColor: colors.border
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: spacing.sm,
    color: colors.text.muted,
    marginBottom: spacing.xs,
    fontWeight: "bold"
  },
  value: {
    fontFamily: fonts.sans,
    fontSize: spacing.md,
    color: colors.text.body,
    marginBottom: spacing.xs,
    marginTop: spacing.xs
  },
  message: {
    fontFamily: fonts.sans,
    fontSize: spacing.md,
    color: colors.text.body,
    marginBottom: spacing.md,
    lineHeight: "1.5",
    whiteSpace: "pre-wrap" as const
  },
  input: {
    fontFamily: fonts.sans,
    fontSize: spacing.md,
    color: colors.text.body,
    marginBottom: spacing.md,
    lineHeight: "1.5",
    whiteSpace: "pre-wrap" as const,
    backgroundColor: colors.background.muted,
    padding: spacing.md,
    borderRadius: spacing.sm,
    border: `1px solid ${colors.border}`
  },
  button: {
    backgroundColor: colors.primary,
    color: colors.white,
    padding: `${spacing.sm} ${spacing.xl}`,
    borderRadius: "0.75rem",
    fontFamily: fonts.sans,
    fontWeight: "500",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block"
  },
  footer: {
    textAlign: "center" as const,
    marginTop: "1rem"
  },
  footerText: {
    fontSize: spacing.sm,
    color: colors.text.muted,
    fontFamily: fonts.sans,
    margin: "0",
    lineHeight: "1rem"
  },
  listGroup: {
    fontFamily: fonts.sans,
    listStyleType: "none",
    padding: "0",
    borderRadius: "0.75rem",
    border: "1px solid #dee2e6",
    overflow: "hidden",
    marginBottom: "0"
  },
  listItem: {
    padding: "0.75rem 1.25rem",
    borderBottom: "1px solid #dee2e6",
    margin: "0"
  },
  link: {
    color: colors.primary,
    textDecoration: "underline"
  }
};
