import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  logo: {
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 320,
  },
  card: {
    borderRadius: 16,
  },
  disclaimer: {
    textAlign: 'center',
    marginTop: 8,
  },
});
