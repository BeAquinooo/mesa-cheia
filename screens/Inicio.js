import { StyleSheet, Text, View } from 'react-native';
import { Botao, Cartao, Erro, Pagina, estilos } from '../components/ui.js';
import { cores } from '../constants/tema.js';
import useCarregar from '../hooks/useCarregar.js';
import { listarDoacoes } from '../services/api.js';

export default function Inicio({ navigation }) {
  const { dados, erro, carregando, recarregar } = useCarregar(listarDoacoes);

  // Enquanto não há resposta da API, mostramos "…" no lugar dos números.
  const totalDoacoes = dados ? String(dados.length) : '…';
  const totalRefeicoes = dados
    ? String(dados.reduce(function somar(total, d) { return total + d.refeicoes; }, 0))
    : '…';

  return (
    <Pagina>
      <Text style={estilos.titulo}>Olá! 👋</Text>
      <Text style={estilos.subtitulo}>Veja o que está disponível para doação perto de você.</Text>

      {erro ? <Erro mensagem={erro} aoTentar={recarregar} /> : null}

      <View style={local.resumo}>
        <View style={local.resumoItem}>
          <Text style={local.numero}>{totalDoacoes}</Text>
          <Text style={estilos.textoSuave}>doações disponíveis</Text>
        </View>
        <View style={local.resumoItem}>
          <Text style={local.numero}>{totalRefeicoes}</Text>
          <Text style={estilos.textoSuave}>refeições possíveis</Text>
        </View>
      </View>
      {carregando && !dados && !erro ? <Text style={estilos.textoSuave}>Carregando dados da API…</Text> : null}

      <Cartao>
        <Text style={estilos.secao}>Doações disponíveis</Text>
        <Text style={estilos.textoSuave}>Explore as ofertas de restaurantes, padarias, mercados e feiras.</Text>
        <Botao titulo="Ver doações" onPress={function irDoacoes() { navigation.navigate('Doacoes'); }} />
      </Cartao>

      <Cartao>
        <Text style={estilos.secao}>Tem comida sobrando?</Text>
        <Text style={estilos.textoSuave}>Publique uma doação para que instituições possam reservar.</Text>
        <Botao titulo="Publicar doação" variante="secundario"
          onPress={function irNova() { navigation.navigate('NovaDoacao'); }} />
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
