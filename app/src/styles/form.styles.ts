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
        borderWidth: 1, // Adicionado para melhor visibilidade
        borderColor: '#CCC', // Cor padrão da borda
        backgroundColor: '#FFF', // Garante boa visibilidade
    },
    inputError: {
        borderColor: '#FF4D4D', // Vermelho para erro
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
        backgroundColor: '#007BFF', // Azul padrão para botão ativo
    },
    buttonDisabled: {
        backgroundColor: '#CCC', // Cinza quando desativado
    },
    error: {
        color: '#FF4D4D', // Vermelho para mensagens de erro
        fontSize: 14,
        marginBottom: 10,
        marginLeft: 5,
    },
});
