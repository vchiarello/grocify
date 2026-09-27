import { StyleSheet } from 'react-native'

// Palette minimale condivisa dalle schermate
export const colors = {
  ink: '#1B2A3A',      // testo principale
  muted: '#5E6B78',    // testo secondario
  line: '#C9D2DA',     // bordi input
  accent: '#2F5D8A',   // pulsanti e link
  danger: '#B3261E',   // errori
  surface: '#F6F8FA',  // sfondo
}

export const ui = StyleSheet.create({
  screen: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: colors.surface },
  title: { fontSize: 26, fontWeight: '700', color: colors.ink, marginBottom: 6 },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  error: { color: colors.danger, marginBottom: 10, fontSize: 14 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 4 },
  footerText: { color: colors.muted },
  link: { color: colors.accent, fontWeight: '600' },
})
