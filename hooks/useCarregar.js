import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

// Executa uma chamada à API toda vez que a tela ganha foco (inclusive ao voltar de outra tela,
// por exemplo depois de cadastrar uma doação) e entrega { dados, erro, carregando, recarregar }.
export default function useCarregar(buscar) {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  // "buscar" deve ser estável (definida fora do componente ou com useCallback).
  const recarregar = useCallback(async function recarregar() {
    setCarregando(true);
    setErro('');
    try {
      setDados(await buscar());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [buscar]);

  useFocusEffect(useCallback(function aoFocar() { recarregar(); }, [recarregar]));

  return { dados, erro, carregando, recarregar };
}
