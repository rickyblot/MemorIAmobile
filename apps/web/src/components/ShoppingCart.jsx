import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { initializeCheckout } from '@/api/EcommerceApi';
import { useToast } from '@/hooks/use-toast';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleCheckout = useCallback(async () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Add some products to your cart before checking out.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const items = cartItems.map(item => ({
        variant_id: item.variant.id,
        quantity: item.quantity,
      }));

      const successUrl = `${window.location.origin}/success`;
      const cancelUrl = window.location.href;

      const { url } = await initializeCheckout({ items, successUrl, cancelUrl });

      clearCart();
      window.location.href = url;
    } catch (error) {
      toast({
        title: 'Checkout Error',
        description: 'There was a problem initializing checkout. Please try again.',
        variant: 'destructive',
      });
    }
  }, [cartItems, clearCart, toast]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border bg-background">
              <h2 className="text-2xl font-extrabold text-foreground font-sans">Shopping Cart</h2>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-card">
              {cartItems.length === 0 ? (
                <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 shadow-subtle border border-border">
                    <ShoppingCartIcon size={32} className="text-primary" />
                  </div>
                  <p className="font-sans font-bold text-lg text-foreground">Your cart is empty.</p>
                  <p className="text-sm mt-2">Looks like you haven't added anything yet.</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.variant.id} className="flex gap-4 bg-background border border-border p-4 rounded-2xl shadow-subtle">
                    <img src={item.product.image} alt={item.product.title} className="w-20 h-20 object-cover rounded-xl border border-border" />
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-foreground font-sans text-sm line-clamp-1">{item.product.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.variant.title}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-primary font-bold font-sans">
                          {item.variant.sale_price_formatted}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-border rounded-lg bg-card">
                            <button onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-l-lg transition-colors">
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-foreground font-sans">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-r-lg transition-colors">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.variant.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Remove item">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-border bg-background shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center mb-6 text-foreground font-sans">
                  <span className="text-base font-bold text-muted-foreground">Total Summary</span>
                  <span className="text-2xl font-extrabold text-primary">{getCartTotal()}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full font-bold py-6 text-lg rounded-xl shadow-md font-sans">
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;