import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Botao, Pagina, estilos } from '../components/ui.js';
import { cores } from '../constants/tema.js';

// ENTREGA 1: tela apenas visual. Não valida credenciais nem chama API.
// O login real (hash, JWT e níveis) entra na Entrega 3.
export default function Entrar({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function entrar() {
    // reset impede que o botão Voltar retorne à tela de login depois de "entrar".
    navigation.reset({ index: 0, routes: [{ name: 'Inicio' }] });
  }

  return (
    <Pagina>
      <Text style={estilos.titulo}>Entrar</Text>
      <Text style={estilos.subtitulo}>Acesse sua conta para ver e gerenciar doações.</Text>

      <View style={local.campo}>
        <Text style={local.rotulo}>E-mail</Text>
        <TextInput style={local.input} value={email} onChangeText={setEmail}
          placeholder="voce@exemplo.com" keyboardType="email-address" autoCapitalize="none"
          placeholderTextColor={cores.textoSuave} />
      </View>

      <View style={local.campo}>
        <Text style={local.rotulo}>Senha</Text>
        <TextInput style={local.input} value={senha} onChangeText={setSenha}
          placeholder="Sua senha" secureTextEntry placeholderTextColor={cores.textoSuave} />
      </View>

      <Botao titulo="Entrar" onPress={entrar} />

      <View style={local.aviso}>
        <Text style={local.avisoTexto}>
          Versão de demonstração: o login ainda não valida credenciais. A autenticação com JWT chega na Entrega 3.
        </Text>
      </View>
    </Pagina>
  );
}

const local = StyleSheet.create({
  campo: { gap: 6 },
  rotulo: { fontSize: 14, fontWeight: '700', color: cores.texto },
  input: {
    backgroundColor: cores.papel, borderWidth: 1, borderColor: cores.borda, borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 14, fontSize: 16, color: cores.texto,
  },
  aviso: { backgroundColor: cores.laranjaClaro, borderRadius: 12, padding: 12 },
  avisoTexto: { color: '#9A4B10', fontSize: 13, lineHeight: 18 },
});
