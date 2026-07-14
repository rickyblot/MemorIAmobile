import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Image as ImageIcon,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart.jsx';
import { formatCurrency } from '@/api/EcommerceApi';

function getUnitPriceCents(variant) {
  return variant?.sale_price_in_cents ?? variant?.price_in_cents ?? 0;
}

function formatItemPrice(variant, quantity = 1) {
  if (variant?.sale_price_formatted && quantity === 1) {
    return variant.sale_price_formatted;
  }
  const cents = getUnitPriceCents(variant) * quantity;
  if (variant?.currency_info) {
    return formatCurrency(cents, variant.currency_info);
  }
  return `€${(cents / 100).toFixed(2)}`;
}

export default function Cart() {
  const { cartItems = [], removeFromCart, updateQuantity, getCartTotal } = useCart() || {};

  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cartItems]
  );

  const subtotalLabel = useMemo(() => {
    if (!cartItems.length) return '—';
    try {
      return getCartTotal();
    } catch {
      const cents = cartItems.reduce(
        (total, item) => total + getUnitPriceCents(item.variant) * item.quantity,
        0
      );
      return formatCurrency(cents, cartItems[0]?.variant?.currency_info);
    }
  }, [cartItems, getCartTotal]);

  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      removeFromCart(item.variant.id);
      return;
    }
    updateQuantity(item.variant.id, item.quantity - 1);
  };

  const handleIncrease = (item) => {
    updateQuantity(item.variant.id, item.quantity + 1);
  };

  const handleCheckout = () => {
    const payload = cartItems.map((item) => ({
      variant_id: item.variant.id,
      product_id: item.product?.id,
      title: item.product?.title,
      quantity: item.quantity,
      unit_price_cents: getUnitPriceCents(item.variant),
    }));
    console.log('Proceed to Checkout:', payload);
    toast.success('Checkout (mock)', {
      description: 'Los datos del carrito se imprimieron en la consola.',
    });
  };

  return (
    <div className="min-h-screen bg-secondary/50 flex flex-col">
      <Helmet>
        <title>Carrito - MemorIAmobile</title>
        <meta name="description" content="Revisa tu carrito y continúa al pago." />
      </Helmet>

      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold text-primary font-heading tracking-tight">
              Carrito
            </h1>
            <p className="text-muted-foreground mt-1">
              {itemCount === 0
                ? 'Tu carrito está vacío.'
                : `${itemCount} ${itemCount === 1 ? 'artículo' : 'artículos'} en tu carrito.`}
            </p>
          </motion.div>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-3xl border border-border shadow-sm py-16 px-6 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary text-primary flex items-center justify-center mx-auto mb-5 border border-border">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Tu carrito está vacío</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Explora nuestros planes y servicios para empezar a proteger tus recuerdos.
              </p>
              <Button asChild className="rounded-full px-6 font-semibold">
                <Link to="/plans">
                  <ShoppingBag className="w-4 h-4" />
                  Ver planes y servicios
                </Link>
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Product rows */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-8 space-y-4"
              >
                {cartItems.map((item) => {
                  const imageSrc =
                    item.product?.image ||
                    item.product?.thumbnail ||
                    item.product?.images?.[0]?.url ||
                    '';

                  return (
                    <div
                      key={item.variant.id}
                      className="bg-card rounded-3xl border border-border shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row gap-4"
                    >
                      <div className="w-full sm:w-24 h-40 sm:h-24 rounded-2xl overflow-hidden bg-muted border border-border shrink-0">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={item.product?.title || 'Producto'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-bold text-foreground truncate">
                              {item.product?.title || 'Producto'}
                            </h3>
                            {item.variant?.title && (
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {item.variant.title}
                              </p>
                            )}
                            <p className="text-sm font-semibold text-primary mt-2">
                              {formatItemPrice(item.variant, 1)}
                              <span className="text-muted-foreground font-normal"> / ud.</span>
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.variant.id)}
                            className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                            aria-label={`Eliminar ${item.product?.title || 'artículo'}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <div className="inline-flex items-center border border-border rounded-xl bg-background overflow-hidden">
                            <button
                              type="button"
                              onClick={() => handleDecrease(item)}
                              className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              aria-label="Reducir cantidad"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center text-sm font-bold text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleIncrease(item)}
                              className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-base font-extrabold text-foreground">
                            {formatItemPrice(item.variant, item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Summary */}
              <motion.aside
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="lg:col-span-4"
              >
                <div className="bg-card rounded-3xl border border-border shadow-sm p-6 lg:sticky lg:top-24 space-y-5">
                  <h2 className="text-lg font-bold text-foreground font-heading">Resumen</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-semibold text-foreground">{subtotalLabel}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="text-2xl font-extrabold text-primary">{subtotalLabel}</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full rounded-full py-6 text-base font-semibold"
                  >
                    Proceed to Checkout
                  </Button>

                  <Button asChild variant="secondary" className="w-full rounded-full">
                    <Link to="/plans">Seguir comprando</Link>
                  </Button>
                </div>
              </motion.aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
