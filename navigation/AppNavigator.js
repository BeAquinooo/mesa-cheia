import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BoasVindas from '../screens/BoasVindas.js';
import Entrar from '../screens/Entrar.js';
import Cadastro from '../screens/Cadastro.js';
import Inicio from '../screens/Inicio.js';
import Doacoes from '../screens/Doacoes.js';
import DetalhesDoacao from '../screens/DetalhesDoacao.js';
import NovaDoacao from '../screens/NovaDoacao.js';
import ComoFunciona from '../screens/ComoFunciona.js';
import EditarDoacao from '../screens/EditarDoacao.js';
import GerenciarUsuarios from '../screens/GerenciarUsuarios.js';
import { carregarSessao } from '../services/api.js';
import { cores, nomeApp } from '../constants/tema.js';
const Stack = createNativeStackNavigator();
export default function AppNavigator() {
 const [inicial,setInicial]=useState(null);
 useEffect(()=>{carregarSessao().then(s=>setInicial(s?'Inicio':'BoasVindas'));},[]);
 if(!inicial)return <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:cores.fundo}}><ActivityIndicator size="large" color={cores.verde}/></View>;
 return <Stack.Navigator initialRouteName={inicial} screenOptions={{headerStyle:{backgroundColor:cores.fundo},headerTintColor:cores.verdeEscuro,headerTitleStyle:{fontWeight:'700'},headerShadowVisible:false,contentStyle:{backgroundColor:cores.fundo}}}>
  <Stack.Screen name="BoasVindas" component={BoasVindas} options={{headerShown:false}}/>
  <Stack.Screen name="Entrar" component={Entrar} options={{title:'Entrar'}}/>
  <Stack.Screen name="Cadastro" component={Cadastro} options={{title:'Criar conta'}}/>
  <Stack.Screen name="Inicio" component={Inicio} options={{title:nomeApp,headerBackVisible:false}}/>
  <Stack.Screen name="Doacoes" component={Doacoes} options={{title:'Doações disponíveis'}}/>
  <Stack.Screen name="DetalhesDoacao" component={DetalhesDoacao} options={{title:'Detalhes da doação'}}/>
  <Stack.Screen name="NovaDoacao" component={NovaDoacao} options={{title:'Publicar doação'}}/>
  <Stack.Screen name="ComoFunciona" component={ComoFunciona} options={{title:'Como funciona'}}/>
   <Stack.Screen name="EditarDoacao" component={EditarDoacao} options={{title:'Editar doação'}}/>
  <Stack.Screen name="GerenciarUsuarios" component={GerenciarUsuarios} options={{title:'Gerenciar usuários'}}/>
 </Stack.Navigator>;
}
