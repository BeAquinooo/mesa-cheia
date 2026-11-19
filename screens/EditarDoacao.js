import { useState } from 'react';
import { Text } from 'react-native';
import { Botao, Campo, Erro, Pagina, estilos } from '../components/ui.js';
import { atualizarDoacao } from '../services/api.js';
export default function EditarDoacao({route,navigation}) {
 const d=route.params.doacao;
 const [titulo,S1]=useState(d.titulo),[descricao,S2]=useState(d.descricao||''),[quantidade,S3]=useState(d.quantidade),[refeicoes,S4]=useState(String(d.refeicoes||0)),[validade,S5]=useState(String(d.validade).slice(0,10)),[local,S6]=useState(d.local_retirada),[categoria,S7]=useState(String(d.categoria_id)),[inicio,S8]=useState(String(d.retirada_inicio).slice(0,16)),[fim,S9]=useState(String(d.retirada_fim).slice(0,16)),[erro,SE]=useState(''),[ocupado,SO]=useState(false);
 async function salvar(){SE('');SO(true);try{await atualizarDoacao(d.id,{titulo,descricao,quantidade,refeicoes:Number(refeicoes),validade,local_retirada:local,categoria_id:Number(categoria),retirada_inicio:inicio,retirada_fim:fim});navigation.goBack();}catch(e){SE(e.message);}finally{SO(false);}}
 return <Pagina><Text style={estilos.titulo}>Editar doação</Text>
 <Campo rotulo="Título" value={titulo} onChangeText={S1}/><Campo rotulo="Descrição" value={descricao} onChangeText={S2}/>
 <Campo rotulo="Quantidade" value={quantidade} onChangeText={S3}/><Campo rotulo="Refeições" value={refeicoes} onChangeText={S4} keyboardType="number-pad"/>
 <Campo rotulo="Validade (AAAA-MM-DD)" value={validade} onChangeText={S5}/><Campo rotulo="Local de retirada" value={local} onChangeText={S6}/>
 <Campo rotulo="ID da categoria" value={categoria} onChangeText={S7} keyboardType="number-pad"/>
 <Campo rotulo="Início (AAAA-MM-DD HH:MM)" value={inicio} onChangeText={S8}/><Campo rotulo="Fim (AAAA-MM-DD HH:MM)" value={fim} onChangeText={S9}/>
 {erro?<Erro mensagem={erro}/>:null}<Botao titulo={ocupado?'Salvando…':'Salvar alterações'} onPress={ocupado?undefined:salvar}/>
 <Botao titulo="Cancelar" variante="secundario" onPress={()=>navigation.goBack()}/></Pagina>;
}
