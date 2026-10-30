import { StyleSheet, Text, View } from 'react-native';
import { Botao, Marca, Pagina, estilos } from '../components/ui.js';
import { cores, nomeApp, slogan } from '../constants/tema.js';

export default function BoasVindas({ navigation }) {
  return (
    <Pagina>
      <View style={local.topo}>
        <Marca tamanho={40} />
        <Text style={local.nome}>{nomeApp}</Text>
        <Text style={[estilos.subtitulo, local.centro]}>{slogan}</Text>
      </View>

      <Text style={estilos.texto}>
        Toda semana, comida boa vai para o lixo enquanto instituições procuram alimento para quem precisa.
        O Mesa Cheia conecta quem tem sobra a quem pode aproveitá-la, de forma rápida e organizada.
      </Text>

      <View style={local.botoes}>
        <Botao titulo="Entrar" onPress={function irEntrar() { navigation.navigate('Entrar'); }} />
        <Botao titulo="Como funciona" variante="secundario"
          onPress={function irComoFunciona() { navigation.navigate('ComoFunciona'); }} />
      </View>
    </Pagina>
  );
}

const local = StyleSheet.create({
  topo: { alignItems: 'center', gap: 12, paddingVertical: 32 },
  nome: { fontSize: 36, fontWeight: '800', color: cores.verdeEscuro },
  centro: { textAlign: 'center' },
  botoes: { gap: 12, marginTop: 8 },
});
