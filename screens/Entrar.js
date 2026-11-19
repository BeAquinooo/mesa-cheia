import { useState } from 'react';
import { Text } from 'react-native';
import { Botao, Campo, Erro, Pagina, estilos } from '../components/ui.js';
import { fazerLogin } from '../services/api.js';

export default function Entrar({ navigation }) {
  const [email,setEmail]=useState(''); const [senha,setSenha]=useState('');
  const [erro,setErro]=useState(''); const [ocupado,setOcupado]=useState(false);
  async function entrar() {
    setErro('');
    if (!email.trim() || !senha) { setErro('Informe seu e-mail e sua senha.'); return; }
    setOcupado(true);
    try { await fazerLogin({ email, senha }); navigation.reset({ index: 0, routes: [{ name: 'Inicio' }] }); }
    catch(e) { setErro(e.message); } finally { setOcupado(false); }
  }
  return <Pagina>
    <Text style={estilos.titulo}>Entrar</Text>
    <Text style={estilos.subtitulo}>Acesse sua conta para ver e gerenciar doações.</Text>
    <Campo rotulo="E-mail" value={email} onChangeText={setEmail} placeholder="voce@exemplo.com" keyboardType="email-address" autoCapitalize="none"/>
    <Campo rotulo="Senha" value={senha} onChangeText={setSenha} placeholder="Sua senha" secureTextEntry/>
    {erro ? <Erro mensagem={erro}/> : null}
    <Botao titulo={ocupado ? 'Entrando…' : 'Entrar'} onPress={ocupado ? undefined : entrar}/>
    <Botao titulo="Criar uma conta" variante="secundario" onPress={()=>navigation.navigate('Cadastro')}/>
  </Pagina>;
}
