// Componentes visuais reutilizados pelas telas.
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { cores, raio } from '../constants/tema.js';

export function Pagina({ children }) {
  return (
    <ScrollView style={estilos.pagina} contentContainerStyle={estilos.paginaConteudo}>
      {children}
    </ScrollView>
  );
}

export function Botao({ titulo, onPress, variante = 'primario' }) {
  const secundario = variante === 'secundario';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={function estiloBotao({ pressed }) {
        return [estilos.botao, secundario && estilos.botaoSecundario, pressed && estilos.pressionado];
      }}
    >
      <Text style={[estilos.botaoTexto, secundario && estilos.botaoTextoSecundario]}>{titulo}</Text>
    </Pressable>
  );
}

export function Cartao({ children, onPress }) {
  const conteudo = <View style={estilos.cartao}>{children}</View>;
  if (!onPress) { return conteudo; }
  return (
    <Pressable accessibilityRole="button" onPress={onPress}
      style={function estiloPress({ pressed }) { return pressed && estilos.pressionado; }}>
      {conteudo}
    </Pressable>
  );
}

export function Selo({ texto, destaque = false }) {
  return (
    <View style={[estilos.selo, destaque && estilos.seloDestaque]}>
      <Text style={[estilos.seloTexto, destaque && estilos.seloTextoDestaque]}>{texto}</Text>
    </View>
  );
}

export function Carregando({ mensagem = 'Carregando…' }) {
  return (
    <View style={estilos.centro}>
      <ActivityIndicator size="large" color={cores.verde} />
      <Text style={estilos.textoSuave}>{mensagem}</Text>
    </View>
  );
}

// Mostra o erro vindo da API e permite tentar de novo.
export function Erro({ mensagem, aoTentar }) {
  return (
    <View style={estilos.erroCaixa}>
      <Text style={estilos.erroTexto}>{mensagem}</Text>
      {aoTentar && <Botao titulo="Tentar novamente" variante="secundario" onPress={aoTentar} />}
    </View>
  );
}

export function Campo({ rotulo, dica, ...props }) {
  return (
    <View style={estilos.campo}>
      <Text style={estilos.campoRotulo}>{rotulo}</Text>
      <TextInput style={estilos.campoInput} placeholderTextColor={cores.textoSuave} {...props} />
      {dica ? <Text style={estilos.textoSuave}>{dica}</Text> : null}
    </View>
  );
}

export function Marca({ tamanho = 28 }) {
  // Marca provisória em texto: prato (círculo) + nome.
  return (
    <View style={estilos.marca}>
      <View style={[estilos.prato, { width: tamanho * 1.6, height: tamanho * 1.6, borderRadius: tamanho }]}>
        <View style={[estilos.pratoMiolo, { width: tamanho, height: tamanho, borderRadius: tamanho / 2 }]} />
      </View>
    </View>
  );
}

export const estilos = StyleSheet.create({
  pagina: { flex: 1, backgroundColor: cores.fundo },
  paginaConteudo: { padding: 20, gap: 16 },
  titulo: { fontSize: 28, fontWeight: '800', color: cores.verdeEscuro },
  subtitulo: { fontSize: 16, color: cores.textoSuave, lineHeight: 22 },
  secao: { fontSize: 18, fontWeight: '700', color: cores.texto },
  texto: { fontSize: 15, color: cores.texto, lineHeight: 22 },
  textoSuave: { fontSize: 14, color: cores.textoSuave },
  botao: {
    backgroundColor: cores.verde, paddingVertical: 14, paddingHorizontal: 20,
    borderRadius: raio.botao, alignItems: 'center',
  },
  botaoSecundario: { backgroundColor: 'transparent', borderWidth: 2, borderColor: cores.verde },
  botaoTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  botaoTextoSecundario: { color: cores.verde },
  pressionado: { opacity: 0.8 },
  cartao: {
    backgroundColor: cores.papel, borderRadius: raio.cartao, padding: 16, gap: 8,
    borderWidth: 1, borderColor: cores.borda,
  },
  selo: {
    alignSelf: 'flex-start', backgroundColor: cores.verdeClaro,
    paddingVertical: 4, paddingHorizontal: 10, borderRadius: raio.selo,
  },
  seloTexto: { color: cores.verdeEscuro, fontSize: 12, fontWeight: '700' },
  seloDestaque: { backgroundColor: cores.laranjaClaro },
  seloTextoDestaque: { color: '#9A4B10' },
  centro: { alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  erroCaixa: { backgroundColor: '#FDECEA', borderRadius: 12, padding: 14, gap: 12 },
  erroTexto: { color: cores.erro, fontSize: 14, lineHeight: 20 },
  campo: { gap: 6 },
  campoRotulo: { fontSize: 14, fontWeight: '700', color: cores.texto },
  campoInput: {
    backgroundColor: cores.papel, borderWidth: 1, borderColor: cores.borda, borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 14, fontSize: 16, color: cores.texto,
  },
  marca: { alignItems: 'center' },
  prato: { backgroundColor: cores.verde, alignItems: 'center', justifyContent: 'center' },
  pratoMiolo: { backgroundColor: cores.fundo, borderWidth: 4, borderColor: cores.laranja },
});
