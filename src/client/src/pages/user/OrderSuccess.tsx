import OrderSuccessView, {
  type TOrderResult,
} from "@/components/organisms/user/OrderSuccessView";
import { PAYMENT_METHOD } from "@shared/constants/order/index";
import type React from "react";
import { useSearchParams } from "react-router";

const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("orderId") ?? "";
  const paymentStatus = searchParams.get("paymentStatus") ?? "PAID";
  const orderStatus = searchParams.get("orderStatus") ?? "CONFIRMED";
  const paymentMethod =
    searchParams.get("paymentMethod") ?? PAYMENT_METHOD.ONLINE_MOBILE_BANKING;

  const result: TOrderResult = {
    orderId,
    paymentMethod: paymentMethod as TOrderResult["paymentMethod"],
    paymentStatus,
    orderStatus,
  };

  return <OrderSuccessView result={result} />;
};

export default OrderSuccess;
