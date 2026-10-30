import { StyleSheet, Text, View } from 'react-native';
import { Botao, Cartao, Pagina, estilos } from '../components/ui.js';
import { cores } from '../constants/tema.js';
import { doacoes } from '../data/doacoes.js';

export default function Inicio({ navigation }) {
  const totalRefeicoes = doacoes.reduce(function somar(total, d) { return total + d.refeicoes; }, 0);

  return (
    <Pagina>
      <Text style={estilos.titulo}>Olá! 👋</Text>
      <Text style={estilos.subtitulo}>Veja o que está disponível para doação perto de você.</Text>

      <View style={local.resumo}>
        <View style={local.resumoItem}>
          <Text style={local.numero}>{doacoes.length}</Text>
          <Text style={estilos.textoSuave}>doações disponíveis</Text>
        </View>
        <View style={local.resumoItem}>
          <Text style={local.numero}>{totalRefeicoes}</Text>
          <Text style={estilos.textoSuave}>refeições possíveis</Text>
        </View>
      </View>

      <Cartao>
        <Text style={estilos.secao}>Doações disponíveis</Text>
        <Text style={estilos.textoSuave}>Explore as ofertas de restaurantes, padarias, mercados e feiras.</Text>
        <Botao titulo="Ver doações" onPress={function irDoacoes() { navigation.navigate('Doacoes'); }} />
      </Cartao>

      <Cartao>
        <Text style={estilos.secao}>Como funciona</Text>
        <Text style={estilos.textoSuave}>Entenda o caminho de uma doação, da oferta à retirada.</Text>
        <Botao titulo="Saiba mais" variante="secundario"
          onPress={function irComoFunciona() { navigation.navigate('ComoFunciona'); }} />
      </Cartao>
    </Pagina>
  );
}

const local = StyleSheet.create({
  resumo: { flexDirection: 'row', gap: 12 },
  resumoItem: {
    flex: 1, backgroundColor: cores.verdeClaro, borderRadius: 16, padding: 16, gap: 2,
  },
  numero: { fontSize: 32, fontWeight: '800', color: cores.verdeEscuro },
});
