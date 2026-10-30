import { StyleSheet, Text, View } from 'react-native';
import { Cartao, Pagina, estilos } from '../components/ui.js';
import { cores } from '../constants/tema.js';

const passos = [
  { titulo: 'O doador publica', texto: 'Restaurante, padaria, mercado ou feirante informa o que sobrou, a quantidade, a validade e o horário de retirada.' },
  { titulo: 'A instituição escolhe', texto: 'ONGs, cozinhas comunitárias e abrigos veem as ofertas disponíveis e reservam o que precisam.' },
  { titulo: 'Retirada combinada', texto: 'O doador confirma a reserva e a instituição retira o alimento no horário combinado.' },
  { titulo: 'Impacto registrado', texto: 'Cada doação fica no histórico e mostra quantas refeições deixaram de ser desperdiçadas.' },
];

export default function ComoFunciona() {
  return (
    <Pagina>
      <Text style={estilos.titulo}>Como funciona</Text>
      <Text style={estilos.subtitulo}>Quatro passos para transformar sobra em refeição.</Text>
      {passos.map(function passo(p, i) {
        return (
          <Cartao key={p.titulo}>
            <View style={local.cabecalho}>
              <View style={local.numero}><Text style={local.numeroTexto}>{i + 1}</Text></View>
              <Text style={[estilos.secao, local.titulo]}>{p.titulo}</Text>
            </View>
            <Text style={estilos.texto}>{p.texto}</Text>
          </Cartao>
        );
      })}
    </Pagina>
  );
}

const local = StyleSheet.create({
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  titulo: { flexShrink: 1 },
  numero: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: cores.laranja,
    alignItems: 'center', justifyContent: 'center',
  },
  numeroTexto: { color: '#FFFFFF', fontWeight: '800' },
});
