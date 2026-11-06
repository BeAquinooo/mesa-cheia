import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Botao, Carregando, Cartao, Erro, Selo, estilos } from '../components/ui.js';
import { cores } from '../constants/tema.js';
import useCarregar from '../hooks/useCarregar.js';
import { listarCategorias, listarDoacoes } from '../services/api.js';
import { formatarRetirada, rotuloValidade } from '../utils/formatar.js';

// Definida fora do componente para ser estável (o hook só recarrega quando a tela ganha foco).
async function buscarTudo() {
  const [doacoes, categorias] = await Promise.all([listarDoacoes(), listarCategorias()]);
  return { doacoes, categorias };
}

export default function Doacoes({ navigation }) {
  const [categoria, setCategoria] = useState('Todas');
  const { dados, erro, carregando, recarregar } = useCarregar(buscarTudo);

  if (carregando && !dados) { return <Carregando mensagem="Buscando doações…" />; }
  if (erro && !dados) {
    return <View style={local.conteudo}><Erro mensagem={erro} aoTentar={recarregar} /></View>;
  }

  const nomes = ['Todas', ...dados.categorias.map(function nome(c) { return c.nome; })];
  const lista = categoria === 'Todas'
    ? dados.doacoes
    : dados.doacoes.filter(function daCategoria(d) { return d.categoria === categoria; });

  function renderizarCabecalho() {
    return (
      <View style={local.cabecalho}>
        <Botao titulo="＋ Publicar doação" onPress={function publicar() { navigation.navigate('NovaDoacao'); }} />
        {erro ? <Erro mensagem={erro} aoTentar={recarregar} /> : null}
        <View style={local.filtros}>
          {nomes.map(function filtro(nome) {
            const ativo = nome === categoria;
            return (
              <Pressable key={nome} onPress={function escolher() { setCategoria(nome); }}
                style={[local.chip, ativo && local.chipAtivo]}>
                <Text style={[local.chipTexto, ativo && local.chipTextoAtivo]}>{nome}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  function renderizarItem({ item }) {
    return (
      <Cartao onPress={function abrir() { navigation.navigate('DetalhesDoacao', { id: item.id }); }}>
        <Selo texto={item.categoria} />
        <Text style={estilos.secao}>{item.titulo}</Text>
        <Text style={estilos.textoSuave}>{item.doador}</Text>
        <View style={local.linha}>
          <Text style={estilos.texto}>📦 {item.quantidade}</Text>
          <Text style={estilos.texto}>📍 {item.local_retirada}</Text>
        </View>
        <Text style={estilos.textoSuave}>🕒 {formatarRetirada(item.retirada_inicio, item.retirada_fim)}</Text>
        <Selo texto={rotuloValidade(item.validade)} destaque />
      </Cartao>
    );
  }

  return (
    <FlatList
      style={local.lista}
      contentContainerStyle={local.conteudo}
      data={lista}
      keyExtractor={function chave(item) { return String(item.id); }}
      renderItem={renderizarItem}
      ListHeaderComponent={renderizarCabecalho}
      ListEmptyComponent={<Text style={estilos.subtitulo}>Nenhuma doação disponível nesta categoria.</Text>}
      refreshing={carregando}
      onRefresh={recarregar}
    />
  );
}

const local = StyleSheet.create({
  lista: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20, gap: 12 },
  cabecalho: { gap: 12, marginBottom: 4 },
  filtros: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999,
    backgroundColor: cores.papel, borderWidth: 1, borderColor: cores.borda,
  },
  chipAtivo: { backgroundColor: cores.verde, borderColor: cores.verde },
  chipTexto: { color: cores.texto, fontWeight: '600' },
  chipTextoAtivo: { color: '#FFFFFF' },
  linha: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
});
