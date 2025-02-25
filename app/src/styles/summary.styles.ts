import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        backgroundColor: '#F1F3F5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    tableCard: {
        marginBottom: 20,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#FFF',
        overflow: 'hidden',
    },
    paymentCard: {
        marginBottom: 15,
        padding: 10,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#FFF',
    },
    paymentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },

    card: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
        elevation: 4,
        backgroundColor: '#FFF',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cardText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#444',
    },
    divider: {
        marginVertical: 10,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#DDD',
        paddingVertical: 10,
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
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#CCC',
    },
    cell: {
        fontSize: 14,
        flex: 1,
        textAlign: 'center',
    },
    button: {
        marginTop: 10,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#1A73E8',
    },
    saveButton: {
        backgroundColor: '#1A73E8',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        elevation: 3,
        marginTop: 10,
    },
    appBar: {
        backgroundColor: 'transparent',
        elevation: 0,
    },

    lastButton: {
        marginBottom: 50,
    },
    columnSmall: {
        flex: 0.5,
        textAlign: 'center',
    },
});
