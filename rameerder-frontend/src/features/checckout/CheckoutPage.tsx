import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CheckCircle, CreditCard, Smartphone, Banknote, Map as MapIcon, Info ,ShieldCheck} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { useCart } from "@/features/cart/CartContext";
import { useAuth } from "@/features/auth/AuthContext";
import { checkoutApi } from "./checkout.api";
import { type DeliveryZone, type CustomerInfo, type DeliveryLocation,type  PaymentMethodType,type  CheckoutPayload } from "./types";
import { cn } from "@/utils/cn";

export function CheckoutPage() {
  const { items, summary, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [isLoadingZones, setIsLoadingZones] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State
  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    email: user ? user.email : "",
    phone: "",
  });

  const [delivery, setDelivery] = useState<DeliveryLocation>({
    deliveryZoneId: "",
    neighborhood: "",
    landmark: "",
    street: "",
    building: "",
    directions: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>(null);

  useEffect(() => {
    if (items.length === 0 && step === 1) {
      navigate("/cart");
    }
    checkoutApi.getDeliveryZones().then(z => {
      setZones(z);
      setIsLoadingZones(false);
    });
  }, [items, navigate, step]);

  const selectedZone = zones.find(z => z.id === delivery.deliveryZoneId);
  const activeDeliveryFee = selectedZone ? selectedZone.fee : 0;
  const finalTotal = summary.subtotal - summary.discount + activeDeliveryFee;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(prev => prev + 1);
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) return;
    setIsSubmitting(true);
    
    const payload: CheckoutPayload = {
      customerInfo: customer,
      deliveryLocation: delivery,
      paymentMethod,
      items,
      subtotal: summary.subtotal,
      discount: summary.discount,
      deliveryFee: activeDeliveryFee,
      total: finalTotal
    };

    try {
      const response = await checkoutApi.placeOrder(payload);
      clearCart();
      navigate(`/order-success/${response.orderId}`);
    } catch (error) {
      console.error("Checkout failed:", error);
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => `FCFA ${price.toLocaleString()}`;

  // --- SUB-COMPONENTS FOR CLEANLINESS ---

  const StepIndicator = () => (
    <div className="flex items-center justify-between md:justify-start gap-2 md:gap-8 mb-8 border-b border-brand-border pb-4 overflow-x-auto">
      {[ 
        { num: 1, label: "CUSTOMER INFO" }, 
        { num: 2, label: "DELIVERY LOCATION" }, 
        { num: 3, label: "PAYMENT" }, 
        { num: 4, label: "REVIEW" }
      ].map(s => (
        <div key={s.num} className={cn("flex items-center gap-2 whitespace-nowrap", step === s.num ? "text-brand-blue font-bold" : step > s.num ? "text-green-600 font-semibold" : "text-brand-muted")}>
          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white", step === s.num ? "bg-brand-blue" : step > s.num ? "bg-green-600" : "bg-brand-border text-brand-muted")}>
            {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
          </div>
          <span className="text-sm hidden sm:block">{s.label}</span>
        </div>
      ))}
    </div>
  );

  const OrderSummarySidebar = () => (
    <div className="bg-white rounded-xl border border-brand-border p-6 sticky top-24">
      <h2 className="text-xl font-bold text-brand-navy mb-4">Order Summary</h2>
      
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
        {items.map(item => (
          <div key={item.id} className="flex gap-4">
            <div className={cn("w-16 h-16 rounded-md bg-slate-100 flex-shrink-0", item.product.images[0])} />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-brand-navy line-clamp-1">{item.product.name}</h4>
              <p className="text-xs text-brand-muted">Qty: {item.quantity}</p>
              <p className="text-sm font-bold text-brand-navy mt-1">{formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 text-sm border-t border-brand-border pt-4 mb-6">
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
          <span className="text-brand-muted">Delivery Fee</span>
          <span className="font-medium text-brand-navy">
            {activeDeliveryFee > 0 ? formatPrice(activeDeliveryFee) : "Calculated at next step"}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-brand-border pt-4">
        <span className="text-lg font-bold text-brand-navy">Total</span>
        <span className="text-2xl font-black text-brand-blue">{formatPrice(finalTotal)}</span>
      </div>
    </div>
  );

  return (
    <div className="py-8 bg-brand-bg min-h-screen">
      <Container>
        <StepIndicator />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Forms */}
          <div className="lg:col-span-2">
            
            {/* STEP 1: CUSTOMER INFO */}
            {step === 1 && (
              <div className="bg-white rounded-xl border border-brand-border p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-bold text-brand-navy mb-6">01 Customer Information</h2>
                <form onSubmit={handleNextStep} className="space-y-4">
                  <Input label="Full Name" required value={customer.fullName} onChange={e => setCustomer({...customer, fullName: e.target.value})} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Phone Number" type="tel" required value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} placeholder="+237 ..." />
                    <Input label="Email Address" type="email" required value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} />
                  </div>
                  <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full sm:w-auto">CONTINUE TO DELIVERY</Button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: DELIVERY LOCATION */}
            {step === 2 && (
              <div className="bg-white rounded-xl border border-brand-border p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-bold text-brand-navy mb-2">02 Where should we deliver your order?</h2>
                <p className="text-sm text-brand-muted mb-6">Please provide precise manual directions to ensure a successful delivery.</p>
                
                {isLoadingZones ? <LoadingState message="Loading delivery zones..." /> : (
                  <form onSubmit={handleNextStep} className="space-y-6">
                    <div className="bg-brand-blue-light border border-brand-blue/20 rounded-lg p-4 space-y-4">
                      <h3 className="font-semibold text-brand-blue flex items-center gap-2"><MapPin className="w-4 h-4" /> PRIMARY DELIVERY LOCATION</h3>
                      
                      <div className="space-y-4">
                        <Select 
                          label="Delivery Zone *"
                          required
                          options={[
                            { label: "[ Select Delivery Zone ]", value: "" },
                            ...zones.map(z => ({ label: `${z.name} - ${formatPrice(z.fee)}`, value: z.id }))
                          ]}
                          value={delivery.deliveryZoneId}
                          onChange={e => setDelivery({...delivery, deliveryZoneId: e.target.value})}
                        />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input label="Neighborhood / Area *" required value={delivery.neighborhood} onChange={e => setDelivery({...delivery, neighborhood: e.target.value})} />
                          <Input label="Nearest Landmark *" required value={delivery.landmark} onChange={e => setDelivery({...delivery, landmark: e.target.value})} />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input label="Street / Road" value={delivery.street} onChange={e => setDelivery({...delivery, street: e.target.value})} />
                          <Input label="Building / House / Shop" value={delivery.building} onChange={e => setDelivery({...delivery, building: e.target.value})} />
                        </div>

                        <div>
                          <Textarea 
                            label="Detailed Delivery Directions *" 
                            required 
                            rows={3} 
                            placeholder="Example: Near Molyko Pharmacy, opposite the blue building, first street right..."
                            value={delivery.directions} 
                            onChange={e => setDelivery({...delivery, directions: e.target.value})} 
                          />
                          <p className="text-xs text-brand-muted mt-1 flex items-center gap-1"><Info className="w-3 h-3"/> Please provide clear directions to help our delivery team locate you.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-brand-border rounded-lg p-4 space-y-4">
                      <h3 className="font-semibold text-brand-navy flex items-center gap-2"><MapIcon className="w-4 h-4" /> OPTIONAL MAP LOCATION</h3>
                      <p className="text-sm text-brand-muted">Maps may not always accurately identify your location. Please provide detailed directions above.</p>
                      
                      <div className="h-40 bg-slate-200 rounded-md flex items-center justify-center border border-slate-300 relative overflow-hidden">
                        {/* Fake Map Background */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
                        <Button type="button" variant="secondary" className="relative z-10 shadow-lg">
                          <MapPin className="w-4 h-4 mr-2" /> USE CURRENT LOCATION
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>BACK</Button>
                      <Button type="submit" size="lg" className="flex-1 sm:flex-none">CONTINUE TO PAYMENT</Button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 3 && (
              <div className="bg-white rounded-xl border border-brand-border p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-bold text-brand-navy mb-6">03 Payment Method</h2>
                
                <form onSubmit={handleNextStep}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {[
                      { id: "MTN_MOMO", label: "MTN Mobile Money", icon: Smartphone, color: "text-yellow-500" },
                      { id: "ORANGE_MONEY", label: "Orange Money", icon: Smartphone, color: "text-orange-500" },
                      { id: "CARD", label: "Credit / Debit Card", icon: CreditCard, color: "text-blue-600" },
                      { id: "COD", label: "Cash on Delivery", icon: Banknote, color: "text-green-600" },
                    ].map(method => (
                      <label 
                        key={method.id} 
                        className={cn(
                          "flex items-center p-4 border rounded-xl cursor-pointer transition-all",
                          paymentMethod === method.id ? "border-brand-blue bg-brand-blue-light ring-1 ring-brand-blue" : "border-brand-border hover:border-brand-blue/50"
                        )}
                      >
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value={method.id} 
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id as PaymentMethodType)}
                          className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300"
                          required
                        />
                        <method.icon className={cn("w-6 h-6 ml-4 mr-3", method.color)} />
                        <span className="font-semibold text-brand-navy">{method.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-green-700 bg-green-50 p-3 rounded-md mb-6">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Secure Payment & Encrypted Transaction</span>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>BACK</Button>
                    <Button type="submit" size="lg" disabled={!paymentMethod} className="flex-1 sm:flex-none">REVIEW YOUR ORDER</Button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 4: REVIEW & CONFIRM */}
            {step === 4 && (
              <div className="bg-white rounded-xl border border-brand-border p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-bold text-brand-navy mb-6">04 Review & Confirmation</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Customer Info Review */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-brand-navy">Customer Information</h3>
                      <button onClick={() => setStep(1)} className="text-sm text-brand-blue hover:underline">Edit</button>
                    </div>
                    <div className="text-sm text-brand-text bg-slate-50 p-4 rounded-lg border border-brand-border space-y-1">
                      <p className="font-semibold">{customer.fullName}</p>
                      <p>{customer.phone}</p>
                      <p>{customer.email}</p>
                    </div>
                  </div>

                  {/* Payment Info Review */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-brand-navy">Payment Method</h3>
                      <button onClick={() => setStep(3)} className="text-sm text-brand-blue hover:underline">Edit</button>
                    </div>
                    <div className="text-sm text-brand-text bg-slate-50 p-4 rounded-lg border border-brand-border">
                      <p className="font-semibold">{paymentMethod?.replace("_", " ")}</p>
                    </div>
                  </div>

                  {/* Delivery Info Review */}
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-brand-navy">Delivery Information</h3>
                      <button onClick={() => setStep(2)} className="text-sm text-brand-blue hover:underline">Edit</button>
                    </div>
                    <div className="text-sm text-brand-text bg-slate-50 p-4 rounded-lg border border-brand-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-brand-muted text-xs uppercase mb-1">Zone & Area</p>
                        <p className="font-semibold">{selectedZone?.name}</p>
                        <p>{delivery.neighborhood}</p>
                      </div>
                      <div>
                        <p className="text-brand-muted text-xs uppercase mb-1">Landmark & Address</p>
                        <p><span className="font-semibold">Near:</span> {delivery.landmark}</p>
                        {(delivery.street || delivery.building) && (
                          <p>{delivery.street}, {delivery.building}</p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-brand-muted text-xs uppercase mb-1">Directions</p>
                        <p className="italic">{delivery.directions}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4 border-t border-brand-border mt-8">
                  <Button type="button" variant="outline" onClick={() => setStep(3)} disabled={isSubmitting}>BACK</Button>
                  <Button type="button" size="lg" className="flex-1 sm:flex-none" onClick={handlePlaceOrder} isLoading={isSubmitting}>
                    PLACE ORDER
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummarySidebar />
          </div>
        </div>
      </Container>
    </div>
  );
}