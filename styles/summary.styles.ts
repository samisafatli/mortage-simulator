import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        gap: 16,
    },
    card: {
        borderRadius: 16,
    },
    heroLabel: {
        marginBottom: 4,
    },
    heroValue: {
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    heroFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
        gap: 8,
    },
    cardTitle: {
        marginBottom: 8,
    },
    divider: {
        marginVertical: 8,
    },
    comparisonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    comparisonColumn: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        gap: 2,
    },
    comparisonNote: {
        marginTop: 12,
    },
    scheduleTitle: {
        marginTop: 8,
    },
    tableFooter: {
        height: 12,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        marginBottom: 20,
    },
    button: {
        borderRadius: 12,
    },
    buttonContent: {
        paddingVertical: 6,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 16,
    },
});
