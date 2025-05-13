import {
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  collection,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebaseConfig.ts";
import { Order } from "../types/order";

export const createOrder = async (
  userId: string,
  orderData: Omit<Order, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    // Validate required fields
    if (!userId) throw new Error("User ID is required");
    if (!orderData.items || orderData.items.length === 0)
      throw new Error("Order must contain items");
    if (!orderData.payment?.method)
      throw new Error("Payment method is required");
    if (orderData.total === undefined || orderData.total === null)
      throw new Error("Total amount is required");

    // Create document reference
    const userOrdersRef = collection(db, "users", userId, "orders");
    const newOrderRef = doc(userOrdersRef);
    const orderId = newOrderRef.id;

    // Build order object with defaults
    const order: Order = {
      id: orderId,
      userId,
      customerName: orderData.customerName || "",
      items: orderData.items.map((item) => ({
        productId: item.productId,
        title: item.title || "Unnamed Product",
        price: item.price || 0,
        quantity: item.quantity || 1,
        image: item.image,
      })),
      shippingAddress: {
        fullName: orderData.shippingAddress.fullName || "",
        street: orderData.shippingAddress.street || "",
        city: orderData.shippingAddress.city || "",
        postalCode: orderData.shippingAddress.postalCode || "",
        state: orderData.shippingAddress.state || "",
        municipality: orderData.shippingAddress.municipality || "",
        colonia: orderData.shippingAddress.colonia || "",
      },
      shippingMethod: {
        carrier: orderData.shippingMethod.carrier || "",
        service: orderData.shippingMethod.service || "",
        cost: orderData.shippingMethod.cost || 0,
        estimateDelivery:
          orderData.shippingMethod.estimateDelivery || new Date(),
      },
      payment: {
        method: orderData.payment.method,
        amount: orderData.payment.amount || orderData.total || 0,
        status: "pending",
        transactionId: "",
      },
      subtotal: orderData.subtotal || orderData.total || 0,
      total: orderData.total || 0,
      status: "processing",
      // Firestore timestamps come back as FieldValue; cast to any so TS accepts it as Date
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    };

    await setDoc(newOrderRef, order);
    return orderId;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error(
      `Order creation failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const updateOrderPaymentStatus = async (
  userId: string,
  orderId: string,
  transactionId: string,
  status: "completed" | "failed"
) => {
  try {
    const orderRef = doc(db, "users", userId, "orders", orderId);
    await updateDoc(orderRef, {
      "payment.status": status,
      "payment.transactionId": transactionId,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating order payment status:", error);
    throw error;
  }
};

export const getOrderById = async (
  userId: string,
  orderId: string
): Promise<Order | null> => {
  try {
    const orderRef = doc(db, "users", userId, "orders", orderId);
    const orderSnap = await getDoc(orderRef);
    if (orderSnap.exists()) {
      return orderSnap.data() as Order;
    }
    return null;
  } catch (error) {
    console.error("Error getting order:", error);
    throw error;
  }
};
