import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    card: {
        marginBottom: 20,
        padding: 10,
        borderRadius: 10,
        elevation: 4,
    },
    headerRow: {
        flexDirection: 'row',
        padding: 10,
        borderRadius: 5,
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#555',
    },
    cell: {
        fontSize: 14,
        flex: 1,
        textAlign: 'center',
        paddingHorizontal: 1,
    },
    button: {
        marginTop: 20,
        paddingVertical: 10,
    },
});
