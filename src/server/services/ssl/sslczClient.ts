import config from "@shared/config/config.js";
import SSLCommerzPayment from "sslcommerz-lts";

const sslcz = new SSLCommerzPayment(
  config.SSL_STORE_ID,
  config.SSL_STORE_PASSWORD,
  config.SSL_IS_LIVE,
);

export default sslcz;
