import { useCallback } from 'react';
import { Alert, Text } from 'react-native';
import { Botao, Carregando, Cartao, Erro, Pagina, estilos } from '../components/ui.js';
import useCarregar from '../hooks/useCarregar.js';
import { alterarNivelUsuario, listarUsuarios } from '../services/api.js';
export default function GerenciarUsuarios(){
 const {dados,erro,carregando,recarregar}=useCarregar(listarUsuarios);
 async function mudar(u,nivel){try{await alterarNivelUsuario(u.id,nivel);recarregar();}catch(e){Alert.alert('Erro',e.message);}}
 if(carregando&&!dados)return <Carregando/>;
 return <Pagina><Text style={estilos.titulo}>Gerenciar usuários</Text>{erro?<Erro mensagem={erro} aoTentar={recarregar}/>:null}
 {(dados||[]).map(u=><Cartao key={u.id}><Text style={estilos.secao}>{u.nome}</Text><Text style={estilos.textoSuave}>{u.email} · {u.nivel}</Text>
 {['doador','instituicao','admin'].filter(n=>n!==u.nivel).map(n=><Botao key={n} titulo={'Tornar '+n} variante="secundario" onPress={()=>Alert.alert('Alterar nível','Definir '+u.nome+' como '+n+'?',[{text:'Cancelar',style:'cancel'},{text:'Confirmar',onPress:()=>mudar(u,n)}])}/>)}
 </Cartao>)}</Pagina>;
}
