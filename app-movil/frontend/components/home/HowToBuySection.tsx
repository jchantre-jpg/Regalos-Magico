/**
 * Pasos para comprar (información estática, sin estado).
 */
import { Text, View } from 'react-native';

import type { AppStyles } from '../../styles/types';

/** Solo recibe estilos; contenido estático sin callbacks. */
type Props = {
  styles: AppStyles;
};

/** Tres pasos estáticos del flujo de compra (sin estado). */
export function HowToBuySection({ styles }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>¿Como comprar?</Text>
      {/* Tres pasos fijos: elegir → revisar carrito → WhatsApp */}
      <View style={styles.stepsGrid}>
        {/* Paso 1: navegación al catálogo */}
        <View style={styles.stepCard}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepTitle}>Elige tu regalo</Text>
          <Text style={styles.stepText}>Explora el catalogo y agrega productos al carrito.</Text>
        </View>
        {/* Paso 2: CartModal y total */}
        <View style={styles.stepCard}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepTitle}>Revisa tu pedido</Text>
          <Text style={styles.stepText}>Valida cantidades y total antes de enviar.</Text>
        </View>
        {/* Paso 3: sendWhatsAppOrder en useCart */}
        <View style={styles.stepCard}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepTitle}>Confirma por WhatsApp</Text>
          <Text style={styles.stepText}>Envia el pedido y coordinamos entrega.</Text>
        </View>
      </View>
    </View>
  );
}
