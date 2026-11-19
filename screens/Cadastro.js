import { useState } from 'react';
import { Alert, Text } from 'react-native';
import { Botao, Campo, Erro, Pagina, estilos } from '../components/ui.js';
import { cadastrarUsuario, fazerLogin } from '../services/api.js';

export default function Cadastro({ navigation }) {
  const [nome,setNome]=useState(''); const [email,setEmail]=useState('');
  const [senha,setSenha]=useState(''); const [telefone,setTelefone]=useState('');
  const [nivel,setNivel]=useState('doador'); const [erro,setErro]=useState(''); const [ocupado,setOcupado]=useState(false);
  async function cadastrar() {
    setErro('');
    if (!nome.trim() || !email.trim() || senha.length < 8) { setErro('Preencha nome, e-mail e uma senha com pelo menos 8 caracteres.'); return; }
    setOcupado(true);
    try {
      await cadastrarUsuario({ nome, email, senha, telefone, nivel });
      await fazerLogin({ email, senha });
      navigation.reset({ index: 0, routes: [{ name: 'Inicio' }] });
    } catch(e) { setErro(e.message); } finally { setOcupado(false); }
  }
  return <Pagina>
    <Text style={estilos.titulo}>Criar conta</Text>
    <Text style={estilos.subtitulo}>Cadastre-se para participar da rede Mesa Cheia.</Text>
    <Campo rotulo="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome ou instituição" maxLength={120}/>
    <Campo rotulo="E-mail" value={email} onChangeText={setEmail} placeholder="voce@exemplo.com" keyboardType="email-address" autoCapitalize="none"/>
    <Campo rotulo="Senha" value={senha} onChangeText={setSenha} placeholder="Mínimo de 8 caracteres" secureTextEntry/>
    <Campo rotulo="Telefone (opcional)" value={telefone} onChangeText={setTelefone} placeholder="(00) 00000-0000"/>
    <Text style={estilos.secao}>Tipo de conta</Text>
    <Botao titulo={nivel === 'doador' ? '✓ Doador (selecionado)' : 'Sou doador'} variante={nivel === 'doador' ? 'primario' : 'secundario'} onPress={()=>setNivel('doador')}/>
    <Botao titulo={nivel === 'instituicao' ? '✓ Instituição (selecionado)' : 'Sou instituição'} variante={nivel === 'instituicao' ? 'primario' : 'secundario'} onPress={()=>setNivel('instituicao')}/>
    {erro ? <Erro mensagem={erro}/> : null}
    <Botao titulo={ocupado ? 'Criando…' : 'Criar conta'} onPress={ocupado ? undefined : cadastrar}/>
    <Botao titulo="Voltar" variante="secundario" onPress={()=>navigation.goBack()}/>
  </Pagina>;
}
