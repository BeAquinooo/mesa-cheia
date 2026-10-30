import { StyleSheet, Text, View } from 'react-native';
import { Botao, Cartao, Pagina, Selo, estilos } from '../components/ui.js';
import { cores } from '../constants/tema.js';
import { buscarDoacao } from '../data/doacoes.js';

function Linha({ rotulo, valor }) {
  return (
    <View style={local.linha}>
      <Text style={local.rotulo}>{rotulo}</Text>
      <Text style={local.valor}>{valor}</Text>
    </View>
  );
}

export default function DetalhesDoacao({ route, navigation }) {
  const doacao = buscarDoacao(route.params?.id);

  if (!doacao) {
    return (
      <Pagina>
        <Text style={estilos.titulo}>Doação não encontrada</Text>
        <Botao titulo="Voltar" onPress={function voltar() { navigation.goBack(); }} />
      </Pagina>
    );
  }

  return (
    <Pagina>
      <Selo texto={doacao.categoria} />
      <Text style={estilos.titulo}>{doacao.titulo}</Text>
      <Text style={estilos.subtitulo}>{doacao.doador}</Text>
      <Text style={estilos.texto}>{doacao.descricao}</Text>

      <Cartao>
        <Linha rotulo="Quantidade" valor={doacao.quantidade} />
        <Linha rotulo="Rende cerca de" valor={doacao.refeicoes + ' refeições'} />
        <Linha rotulo="Validade" valor={doacao.validade} />
        <Linha rotulo="Local" valor={doacao.local} />
        <Linha rotulo="Retirada" valor={doacao.retirada} />
      </Cartao>

      {/* Reservar será implementado na Entrega 3, junto com login e níveis de usuário. */}
      <View style={local.aviso}>
        <Text style={local.avisoTexto}>A reserva de doações estará disponível em uma próxima entrega.</Text>
      </View>
      <Botao titulo="Voltar para a lista" variante="secundario" onPress={function voltar() { navigation.goBack(); }} />
    </Pagina>
  );
}

const local = StyleSheet.create({
  linha: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 4 },
  rotulo: { color: cores.textoSuave, fontSize: 14 },
  valor: { color: cores.texto, fontSize: 14, fontWeight: '700', flexShrink: 1, textAlign: 'right' },
  aviso: { backgroundColor: cores.laranjaClaro, borderRadius: 12, padding: 12 },
  avisoTexto: { color: '#9A4B10', fontSize: 13 },
});
