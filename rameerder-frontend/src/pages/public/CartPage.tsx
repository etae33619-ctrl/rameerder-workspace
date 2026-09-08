// import React from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Container } from "../../components/ui/Container";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { useCart } from "../../features/cart/CartContext";
import { cn } from "../../utils/cn";

export function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, summary } = useCart();
  const formatPrice = (price: number) => `FCFA ${price.toLocaleString()}`;

  if (items.length === 0) {
    return (
      <div className="py-16 min-h-[60vh] flex items-center bg-brand-bg">
        <Container>
          <EmptyState 
            title="Your Cart is Empty" 
            description="Looks like you haven't added anything to your cart yet." 
            actionLabel="Start Shopping" 
            onAction={() => window.location.href = "/shop"} 
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 bg-brand-bg min-h-screen">
      <Container>
        <h1 className="text-3xl font-bold text-brand-navy mb-8 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-brand-blue" />
          Your Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-brand-border bg-slate-50 text-sm font-semibold text-brand-navy">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>
              
              <ul className="divide-y divide-brand-border">
                {items.map(item => {
                  const price = item.product.discountPrice || item.product.price;
                  return (
                    <li key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                      <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                        <Link to={`/shop/${item.product.id}`}>
                          <div className={cn("w-20 h-20 rounded-md object-cover flex-shrink-0", item.product.images[0] || "bg-slate-100")} />
                        </Link>
                        <div>
                          <Link to={`/shop/${item.product.id}`} className="font-semibold text-brand-navy hover:text-brand-blue line-clamp-2">
                            {item.product.name}
                          </Link>
                          <button onClick={() => removeFromCart(item.product.id)} className="text-sm text-brand-red flex items-center gap-1 mt-2 hover:underline">
                            <Trash2 className="w-4 h-4" /> Remove
                          </button>
                        </div>
                      </div>

                      <div className="hidden md:block col-span-2 text-center font-medium text-brand-navy">
                        {formatPrice(price)}
                      </div>

                      <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center">
                        <span className="md:hidden text-sm font-medium text-brand-muted">Quantity:</span>
                        <div className="flex items-center border border-brand-border rounded-md bg-white">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1 text-brand-navy hover:bg-slate-50">-</button>
                          <span className="px-3 font-semibold text-sm w-8 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 text-brand-navy hover:bg-slate-50">+</button>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end">
                        <span className="md:hidden text-sm font-medium text-brand-muted">Subtotal:</span>
                        <span className="font-bold text-brand-navy">{formatPrice(price * item.quantity)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
              
              <div className="p-4 border-t border-brand-border flex justify-between items-center bg-slate-50">
                <Button variant="ghost" onClick={clearCart} className="text-brand-red hover:bg-brand-red-light">Clear Cart</Button>
                <Link to="/shop">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-brand-border p-6 sticky top-24">
              <h2 className="text-xl font-bold text-brand-navy mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm border-b border-brand-border pb-6 mb-6">
                <div className="flex justify-between">
                  <span className="text-brand-muted">Subtotal</span>
                  <span className="font-medium text-brand-navy">{formatPrice(summary.subtotal)}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-brand-red">
                    <span>Discount</span>
                    <span className="font-medium">-{formatPrice(summary.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-brand-muted">Delivery Fee (Est.)</span>
                  <span className="font-medium text-brand-navy">{formatPrice(summary.deliveryFee)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-brand-navy">Total</span>
                <span className="text-2xl font-black text-brand-navy">{formatPrice(summary.total)}</span>
              </div>

              <Link to="/checkout" className="block w-full">
                <Button size="lg" className="w-full gap-2 text-lg">
                  PROCEED TO CHECKOUT <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              
              <p className="text-xs text-center text-brand-muted mt-4">
                Taxes and exact delivery fees are calculated at checkout.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}