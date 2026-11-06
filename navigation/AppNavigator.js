// Fluxo da Entrega 2: BoasVindas → Entrar → Inicio → Doacoes → DetalhesDoacao,
// Inicio/Doacoes → NovaDoacao (+ ComoFunciona). As telas de dados usam a API via fetch().
// Na Entrega 3 este arquivo separa telas públicas (login/cadastro) das privadas (exigem JWT).
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BoasVindas from '../screens/BoasVindas.js';
import Entrar from '../screens/Entrar.js';
import Inicio from '../screens/Inicio.js';
import Doacoes from '../screens/Doacoes.js';
import DetalhesDoacao from '../screens/DetalhesDoacao.js';
import NovaDoacao from '../screens/NovaDoacao.js';
import ComoFunciona from '../screens/ComoFunciona.js';
import { cores, nomeApp } from '../constants/tema.js';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      id="MesaCheia"
      initialRouteName="BoasVindas"
      screenOptions={{
        headerStyle: { backgroundColor: cores.fundo },
        headerTintColor: cores.verdeEscuro,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Screen name="BoasVindas" component={BoasVindas} options={{ headerShown: false }} />
      <Stack.Screen name="Entrar" component={Entrar} options={{ title: 'Entrar' }} />
      <Stack.Screen name="Inicio" component={Inicio} options={{ title: nomeApp, headerBackVisible: false }} />
      <Stack.Screen name="Doacoes" component={Doacoes} options={{ title: 'Doações disponíveis' }} />
      <Stack.Screen name="DetalhesDoacao" component={DetalhesDoacao} options={{ title: 'Detalhes da doação' }} />
      <Stack.Screen name="NovaDoacao" component={NovaDoacao} options={{ title: 'Publicar doação' }} />
      <Stack.Screen name="ComoFunciona"component={ComoFunciona} options={{ title: 'Como funciona' }} />
    </Stack.Navigator>
  );
}
