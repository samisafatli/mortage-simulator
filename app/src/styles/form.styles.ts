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
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#CCC',
        backgroundColor: '#FFF',
    },
    inputError: {
        borderColor: '#FF4D4D',
    },
    radioContainer: {
        marginBottom: 20,
        paddingHorizontal: 10,
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
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#007BFF',
    },
    buttonDisabled: {
        backgroundColor: '#CCC',
    },
    error: {
        color: '#FF4D4D',
        fontSize: 14,
        marginBottom: 10,
        marginLeft: 5,
    },
    appBar: {
        backgroundColor: 'transparent',
        elevation: 0,
    },
});
