/**
 * Claude-themed syntax highlighting theme
 * Adapts to light/dark theme using CSS custom properties
 */
export const claudeSyntaxTheme: any = {
  'code[class*="language-"]': {
    color: 'var(--color-foreground)',
    background: 'transparent',
    textShadow: 'none',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.875em',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none'
  },
  'pre[class*="language-"]': {
    color: 'var(--color-foreground)',
    background: 'transparent',
    textShadow: 'none',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.875em',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
    padding: '1em',
    margin: '0',
    overflow: 'auto'
  },
  ':not(pre) > code[class*="language-"]': {
    color: 'var(--color-foreground)',
    padding: '0.1em 0.3em',
    borderRadius: 'var(--radius-sm)',
    whiteSpace: 'normal'
  },
  comment: {
    color: 'var(--color-muted-foreground)',
    fontStyle: 'italic'
  },
  prolog: {
    color: 'var(--color-muted-foreground)'
  },
  doctype: {
    color: 'var(--color-muted-foreground)'
  },
  cdata: {
    color: 'var(--color-muted-foreground)'
  },
  punctuation: {
    color: 'var(--color-muted-foreground)'
  },
  namespace: {
    opacity: '0.7'
  },
  property: {
    color: 'oklch(0.63 0.15 45)' // Adaptive amber/orange
  },
  tag: {
    color: 'oklch(0.55 0.15 270)' // Adaptive violet
  },
  boolean: {
    color: 'oklch(0.63 0.15 45)' // Adaptive amber/orange
  },
  number: {
    color: 'oklch(0.63 0.15 45)' // Adaptive amber/orange
  },
  constant: {
    color: 'oklch(0.63 0.15 45)' // Adaptive amber/orange
  },
  symbol: {
    color: 'oklch(0.63 0.15 45)' // Adaptive amber/orange
  },
  deleted: {
    color: 'var(--color-destructive)',
    backgroundColor: 'var(--color-destructive)/5'
  },
  selector: {
    color: 'oklch(0.65 0.12 280)' // Adaptive light purple
  },
  'attr-name': {
    color: 'oklch(0.65 0.12 280)' // Adaptive light purple
  },
  string: {
    color: 'oklch(0.55 0.15 150)' // Adaptive emerald green
  },
  char: {
    color: 'oklch(0.55 0.15 150)' // Adaptive emerald green
  },
  builtin: {
    color: 'oklch(0.55 0.15 270)' // Adaptive violet
  },
  url: {
    color: 'oklch(0.55 0.15 150)' // Adaptive emerald green
  },
  inserted: {
    color: 'oklch(0.55 0.15 150)', // Adaptive emerald green
    backgroundColor: 'oklch(0.55 0.15 150)/5'
  },
  entity: {
    color: 'oklch(0.65 0.12 280)', // Adaptive light purple
    cursor: 'help'
  },
  atrule: {
    color: 'oklch(0.70 0.12 290)' // Adaptive light violet
  },
  'attr-value': {
    color: 'oklch(0.55 0.15 150)' // Adaptive emerald green
  },
  keyword: {
    color: 'oklch(0.70 0.12 290)' // Adaptive light violet
  },
  function: {
    color: 'oklch(0.60 0.15 240)' // Adaptive indigo
  },
  'class-name': {
    color: 'oklch(0.63 0.15 45)' // Adaptive amber/orange
  },
  regex: {
    color: 'oklch(0.55 0.15 200)' // Adaptive cyan
  },
  important: {
    color: 'oklch(0.63 0.15 45)', // Adaptive amber/orange
    fontWeight: 'bold'
  },
  variable: {
    color: 'oklch(0.65 0.12 280)' // Adaptive light purple
  },
  bold: {
    fontWeight: 'bold'
  },
  italic: {
    fontStyle: 'italic'
  },
  operator: {
    color: 'var(--color-muted-foreground)'
  },
  script: {
    color: 'var(--color-foreground)'
  },
  parameter: {
    color: 'oklch(0.70 0.15 70)' // Adaptive yellow
  },
  method: {
    color: 'oklch(0.60 0.15 240)' // Adaptive indigo
  },
  field: {
    color: 'oklch(0.63 0.15 45)' // Adaptive amber/orange
  },
  annotation: {
    color: 'var(--color-muted-foreground)'
  },
  type: {
    color: 'oklch(0.65 0.12 280)' // Adaptive light purple
  },
  module: {
    color: 'oklch(0.55 0.15 270)' // Adaptive violet
  }
}
