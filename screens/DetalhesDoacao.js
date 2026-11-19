import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Botao, Carregando, Cartao, Erro, Pagina, Selo, estilos } from '../components/ui.js';
import { cores } from '../constants/tema.js';
import useCarregar from '../hooks/useCarregar.js';
import { buscarDoacao, carregarSessao, reservarDoacao, cancelarDoacao } from '../services/api.js';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { formatarData, formatarRetirada } from '../utils/formatar.js';

function Linha({ rotulo, valor }) {
  return (
    <View style={local.linha}>
      <Text style={local.rotulo}>{rotulo}</Text>
      <Text style={local.valor}>{valor}</Text>
    </View>
  );
}

export default function DetalhesDoacao({ route, navigation }) {
  const id = route.params?.id;
  const buscar = useCallback(function buscarDestaDoacao() { return buscarDoacao(id); }, [id]);
  const { dados: doacao, erro, carregando, recarregar } = useCarregar(buscar);
  const [sessao,setSessao]=useState(null);
  useEffect(()=>{carregarSessao().then(setSessao);},[]);
  async function reservar(){try{await reservarDoacao(id);Alert.alert('Sucesso','Doação reservada.');recarregar();}catch(e){Alert.alert('Erro',e.message);}}
  async function cancelar(){Alert.alert('Cancelar doação','Deseja cancelar esta oferta?',[{text:'Voltar',style:'cancel'},{text:'Confirmar',style:'destructive',onPress:async()=>{try{await cancelarDoacao(id);navigation.goBack();}catch(e){Alert.alert('Erro',e.message);}}}]);}

  if (carregando && !doacao) { return <Carregando mensagem="Carregando doação…" />; }
  if (erro) {
    return (
      <Pagina>
        <Erro mensagem={erro} aoTentar={recarregar} />
        <Botao titulo="Voltar" variante="secundario" onPress={function voltar() { navigation.goBack(); }} />
      </Pagina>
    );
  }

  return (
    <Pagina>
      <Selo texto={doacao.categoria} />
      <Text style={estilos.titulo}>{doacao.titulo}</Text>
      <Text style={estilos.subtitulo}>{doacao.doador}</Text>
      {doacao.descricao ? <Text style={estilos.texto}>{doacao.descricao}</Text> : null}

      <Cartao>
        <Linha rotulo="Quantidade" valor={doacao.quantidade} />
        <Linha rotulo="Rende cerca de" valor={doacao.refeicoes + ' refeições'} />
        <Linha rotulo="Validade" valor={formatarData(doacao.validade)} />
        <Linha rotulo="Local" valor={doacao.local_retirada} />
        <Linha rotulo="Retirada" valor={formatarRetirada(doacao.retirada_inicio, doacao.retirada_fim)} />
        <Linha rotulo="Situação" valor={doacao.status} />
      </Cartao>

      {sessao?.usuario?.nivel === 'instituicao' && doacao.status === 'disponivel' ? <Botao titulo="Reservar esta doação" onPress={reservar}/> : null}
      {(sessao?.usuario?.nivel === 'admin' || (sessao?.usuario?.nivel === 'doador' && sessao.usuario.id === doacao.doador_id)) ?
        <Botao titulo="Editar doação" variante="secundario" onPress={()=>navigation.navigate('EditarDoacao',{doacao})}/> : null}
      {(sessao?.usuario?.nivel === 'admin' || (sessao?.usuario?.nivel === 'doador' && sessao.usuario.id === doacao.doador_id)) && doacao.status !== 'cancelada' ?
        <Botao titulo="Cancelar doação" variante="secundario" onPress={cancelar}/> : null}
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
