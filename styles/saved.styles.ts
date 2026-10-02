import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#F9FAFC',
    },

    title: {
        marginTop: 30,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },

    card: {
        marginBottom: 15,
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#FFF',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 5,
    },

    cardText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 3,
    },

    divider: {
        marginVertical: 10,
        backgroundColor: '#DDD',
    },

    emptyContainer: {
        marginTop: 100,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emptyMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
    },

    newSimulationButton: {
        marginTop: 15,
        backgroundColor: '#1A73E8',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },

    newSimulationButtonLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
    },
    appBar: {
        backgroundColor: 'transparent',
        elevation: 0,
    },
});




