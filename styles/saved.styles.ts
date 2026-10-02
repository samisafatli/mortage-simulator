import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    content: {
        padding: 16,
        paddingBottom: 40,
        gap: 12,
        flexGrow: 1,
    },
    card: {
        borderRadius: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    cardValue: {
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    divider: {
        marginVertical: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        gap: 12,
    },
    emptyMessage: {
        textAlign: 'center',
    },
    newSimulationButton: {
        marginTop: 8,
        borderRadius: 12,
    },
});
