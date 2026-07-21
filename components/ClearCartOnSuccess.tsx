'use client';

import { useEffect } from 'react';
import { useCart } from '@/components/CartProvider';

/**
 * Renders nothing — just clears the local cart once the success page
 * mounts, since the purchase this cart represented has now been paid for.
 */
export default function ClearCartOnSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
