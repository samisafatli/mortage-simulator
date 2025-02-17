import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
        fontSize: 16,
    },
    radioContainer: {
        marginBottom: 20,
    },
    radioLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
        paddingVertical: 10,
    },
});