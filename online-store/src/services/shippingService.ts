// src/services/shippingService.ts

export interface ShippingRate {
  carrier: string;
  service: string;
  amount: number;
  estimatedDeliveryDate: string;
}

export interface ShippingRequest {
  postalCode: string;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
}

/**
 * Dummy shipping calculation.
 * Returns two mock rates based on weight.
 */
export const calculateShipping = async ({
  postalCode,
  weight,
  length = 10,
  width = 10,
  height = 10,
}: ShippingRequest): Promise<ShippingRate[]> => {
  // base price of $0.50 per pound
  const basePrice = weight * 0.5;

  return [
    {
      carrier: "FedEx",
      service: "Standard",
      amount: basePrice + 5.99,
      // 3 days from now
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    },
    {
      carrier: "UPS",
      service: "Express",
      amount: basePrice + 8.99,
      // 2 days from now
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    },
  ];
};
