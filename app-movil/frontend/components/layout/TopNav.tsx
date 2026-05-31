/**
 * Barra superior fija de la tienda (TopNav).
 * Muestra marca, acceso al carrito con badge de cantidad y menú hamburguesa.
 * Usado en: frontend/App.tsx — estilos en appStyles.ts (topNav, cartIcon, cartBadge).
 */
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { AppStyles } from '../../styles/types';

/** Contrato de props: todo viene del padre App (useCart + useResponsiveLayout). */
type Props = {
  /** Factor de escala para iconos (useResponsiveLayout). */
  scale: number;
  /** StyleSheet memoizado de createAppStyles. */
  styles: AppStyles;
  /** Total de unidades en el carrito (suma de quantity, no líneas). */
  cartItemsCount: number;
  /** Abre CartModal (setCartModalVisible(true)). */
  onOpenCart: () => void;
  /** Abre NavMenu lateral. */
  onOpenMenu: () => void;
};

/** Barra fija: logo, carrito con badge y botón del menú hamburguesa. */
export function TopNav({ scale, styles, cartItemsCount, onOpenCart, onOpenMenu }: Props) {
  return (
    <View style={styles.topNav}>
      <Text style={styles.logoText}>🎁 RegaloMagico</Text>
      <View style={styles.topNavActions}>
        <Pressable
          style={styles.cartIcon}
          onPress={onOpenCart}
          accessibilityRole="button"
          accessibilityLabel="Abrir carrito"
        >
          <Ionicons name="cart" size={Math.round(22 * scale)} color="#f4d8a3" />
          {/* Badge: suma de cantidades (no líneas distintas) */}
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
          </View>
        </Pressable>
        <Pressable style={styles.menuButton} onPress={onOpenMenu}>
          <Text style={styles.menuButtonText}>☰</Text>
        </Pressable>
      </View>
    </View>
  );
}
