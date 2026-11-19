import { StyleSheet, Text, View } from 'react-native';
import { Botao, Cartao, Erro, Pagina, estilos } from '../components/ui.js';
import { cores } from '../constants/tema.js';
import useCarregar from '../hooks/useCarregar.js';
import { listarDoacoes, carregarSessao, encerrarSessao } from '../services/api.js';
import { useEffect, useState } from 'react';

export default function Inicio({ navigation }) {
  const { dados, erro, carregando, recarregar } = useCarregar(listarDoacoes);
  const [sessao, setSessao] = useState(null);
  useEffect(() => { carregarSessao().then(setSessao); }, []);
  async function sair() { await encerrarSessao(); navigation.reset({ index: 0, routes: [{ name: 'BoasVindas' }] }); }

  // Enquanto não há resposta da API, mostramos "…" no lugar dos números.
  const totalDoacoes = dados ? String(dados.length) : '…';
  const totalRefeicoes = dados
    ? String(dados.reduce(function somar(total, d) { return total + d.refeicoes; }, 0))
    : '…';

  return (
    <Pagina>
      <Text style={estilos.titulo}>Olá! 👋</Text>
      <Text style={estilos.subtitulo}>Olá, {sessao?.usuario?.nome || 'usuário'}! Veja o que está disponível.</Text>
      <Text style={estilos.textoSuave}>Perfil: {sessao?.usuario?.nivel || 'carregando'}</Text>
      <Botao titulo="Sair da conta" variante="secundario" onPress={sair} />

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
        {sessao?.usuario?.nivel === 'doador' || sessao?.usuario?.nivel === 'admin' ?
          <Botao titulo="Publicar doação" variante="secundario" onPress={function irNova() { navigation.navigate('NovaDoacao'); }} /> : null}
      </Cartao>

      {sessao?.usuario?.nivel === 'admin' ? <Cartao><Text style={estilos.secao}>Administração</Text><Botao titulo="Gerenciar usuários" onPress={()=>navigation.navigate('GerenciarUsuarios')}/></Cartao> : null}
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
