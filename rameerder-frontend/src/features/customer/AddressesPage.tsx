import  { useEffect, useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
//import { Badge } from "../../components/ui/Badge";
import { LoadingState } from "../../components/ui/LoadingState";
import { customerApi } from "../../features/customer/customer.api";
import {type  CustomerAddress } from "../../features/customer/types";

export function AddressesPage() {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    customerApi.getAddresses().then(a => {
      setAddresses(a);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-brand-navy">Saved Addresses</h1>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Add New Address</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <Card key={addr.id} className="relative overflow-hidden">
            {addr.isDefault && (
              <div className="absolute top-0 right-0 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                DEFAULT
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-brand-blue mt-0.5" />
                <div>
                  <h3 className="font-bold text-brand-navy">{addr.deliveryZone}</h3>
                  <p className="text-sm text-brand-muted">{addr.neighborhood}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm text-brand-text mb-6">
                <p><span className="font-semibold">Landmark:</span> {addr.landmark}</p>
                <p><span className="font-semibold">Street:</span> {addr.street}</p>
                <p><span className="font-semibold">Building:</span> {addr.building}</p>
                <p className="text-brand-muted italic mt-2 text-xs">{addr.directions}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                <Button variant="outline" size="sm" className="flex-1 text-brand-red hover:bg-brand-red hover:text-white hover:border-brand-red border-brand-red/20">Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}