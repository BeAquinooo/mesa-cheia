import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Botao, Campo, Carregando, Erro, Pagina, estilos } from '../components/ui.js';
import { cores } from '../constants/tema.js';
import useCarregar from '../hooks/useCarregar.js';
import { cadastrarDoacao, listarCategorias } from '../services/api.js';
import { hojeISO } from '../utils/formatar.js';

// ENTREGA 2: qualquer pessoa pode publicar (ainda não há login). Na Entrega 3 esta tela
// ficará disponível só para o nível "doador" e o doador virá do JWT, não do formulário.
export default function NovaDoacao({ navigation }) {
  const categorias = useCarregar(listarCategorias);

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [refeicoes, setRefeicoes] = useState('');
  const [categoriaId, setCategoriaId] = useState(null);
  const [validade, setValidade] = useState(hojeISO());
  const [localRetirada, setLocalRetirada] = useState('');
  const [dia, setDia] = useState(hojeISO());
  const [horaInicio, setHoraInicio] = useState('15:00');
  const [horaFim, setHoraFim] = useState('16:00');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = useCallback(async function enviar() {
    setErro('');
    if (!titulo.trim() || !quantidade.trim() || !localRetirada.trim() || !categoriaId) {
      setErro('Preencha título, categoria, quantidade e local de retirada.');
      return;
    }
    setEnviando(true);
    try {
      // Os nomes dos campos são os mesmos que a API espera no corpo do POST /doacoes.
      await cadastrarDoacao({
        titulo,
        descricao,
        quantidade,
        refeicoes: refeicoes.trim() === '' ? 0 : refeicoes.trim(),
        validade: validade.trim(),
        local_retirada: localRetirada,
        retirada_inicio: dia.trim() + ' ' + horaInicio.trim(),
        retirada_fim: dia.trim() + ' ' + horaFim.trim(),
        categoria_id: categoriaId,
      });
      // Ao voltar, a lista ganha foco e recarrega, mostrando a nova doação.
      navigation.goBack();
    } catch (e) {
      // A API valida tudo de novo; a mensagem dela explica o que corrigir.
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }, [titulo, descricao, quantidade, refeicoes, validade, localRetirada, dia, horaInicio, horaFim, categoriaId, navigation]);

  if (categorias.carregando && !categorias.dados) { return <Carregando />; }
  if (categorias.erro && !categorias.dados) {
    return <Pagina><Erro mensagem={categorias.erro} aoTentar={categorias.recarregar} /></Pagina>;
  }

  return (
    <Pagina>
      <Text style={estilos.titulo}>Publicar doação</Text>
      <Text style={estilos.subtitulo}>Conte o que está sobrando para que uma instituição possa buscar.</Text>

      <Campo rotulo="Título" value={titulo} onChangeText={setTitulo} placeholder="Ex.: Marmitas do almoço" maxLength={120} />
      <Campo rotulo="Descrição (opcional)" value={descricao} onChangeText={setDescricao} multiline maxLength={500}
        placeholder="O que é, como está armazenado…" />

      <View style={local.grupo}>
        <Text style={local.rotulo}>Categoria</Text>
        <View style={local.chips}>
          {categorias.dados.map(function chip(c) {
            const ativo = c.id === categoriaId;
            return (
              <Pressable key={c.id} onPress={function escolher() { setCategoriaId(c.id); }}
                style={[local.chip, ativo && local.chipAtivo]}>
                <Text style={[local.chipTexto, ativo && local.chipTextoAtivo]}>{c.nome}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Campo rotulo="Quantidade" value={quantidade} onChangeText={setQuantidade} placeholder="Ex.: 20 marmitas" maxLength={60} />
      <Campo rotulo="Refeições estimadas" value={refeicoes} onChangeText={setRefeicoes} keyboardType="number-pad"
        placeholder="Ex.: 20" />
      <Campo rotulo="Validade" value={validade} onChangeText={setValidade} placeholder="AAAA-MM-DD"
        dica="Formato AAAA-MM-DD (ex.: 2026-11-20)." autoCapitalize="none" />
      <Campo rotulo="Local de retirada" value={localRetirada} onChangeText={setLocalRetirada} placeholder="Bairro ou endereço" maxLength={120} />
      <Campo rotulo="Dia da retirada" value={dia} onChangeText={setDia} placeholder="AAAA-MM-DD" autoCapitalize="none" />
      <View style={local.horas}>
        <View style={local.hora}>
          <Campo rotulo="Das" value={horaInicio} onChangeText={setHoraInicio} placeholder="HH:MM" autoCapitalize="none" />
        </View>
        <View style={local.hora}>
          <Campo rotulo="Até" value={horaFim} onChangeText={setHoraFim} placeholder="HH:MM" autoCapitalize="none" />
        </View>
      </View>

      {erro ? <Erro mensagem={erro} /> : null}
      <Botao titulo={enviando ? 'Enviando…' : 'Publicar'} onPress={enviando ? undefined : enviar} />
      <Botao titulo="Cancelar" variante="secundario" onPress={function cancelar() { navigation.goBack(); }} />
    </Pagina>
  );
}

const local = StyleSheet.create({
  grupo: { gap: 6 },
  rotulo: { fontSize: 14, fontWeight: '700', color: cores.texto },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999,
    backgroundColor: cores.papel, borderWidth: 1, borderColor: cores.borda,
  },
  chipAtivo: { backgroundColor: cores.verde, borderColor: cores.verde },
  chipTexto: { color: cores.texto, fontWeight: '600' },
  chipTextoAtivo: { color: '#FFFFFF' },
  horas: { flexDirection: 'row', gap: 12 },
  hora: { flex: 1 },
});
