import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Cartao, Selo, estilos } from '../components/ui.js';
import { cores } from '../constants/tema.js';
import { categorias, doacoes } from '../data/doacoes.js';

export default function Doacoes({ navigation }) {
  const [categoria, setCategoria] = useState('Todas');

  const lista = categoria === 'Todas'
    ? doacoes
    : doacoes.filter(function daCategoria(d) { return d.categoria === categoria; });

  function renderizarFiltros() {
    return (
      <View style={local.filtros}>
        {categorias.map(function filtro(nome) {
          const ativo = nome === categoria;
          return (
            <Pressable key={nome} onPress={function escolher() { setCategoria(nome); }}
              style={[local.chip, ativo && local.chipAtivo]}>
              <Text style={[local.chipTexto, ativo && local.chipTextoAtivo]}>{nome}</Text>
            </Pressable>
          );
        })}
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
          <Text style={estilos.texto}>📍 {item.local}</Text>
        </View>
        <Selo texto={item.validade} destaque />
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
      ListHeaderComponent={renderizarFiltros}
      ListEmptyComponent={<Text style={estilos.subtitulo}>Nenhuma doação nesta categoria.</Text>}
    />
  );
}

const local = StyleSheet.create({
  lista: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20, gap: 12 },
  filtros: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999,
    backgroundColor: cores.papel, borderWidth: 1, borderColor: cores.borda,
  },
  chipAtivo: { backgroundColor: cores.verde, borderColor: cores.verde },
  chipTexto: { color: cores.texto, fontWeight: '600' },
  chipTextoAtivo: { color: '#FFFFFF' },
  linha: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
});
