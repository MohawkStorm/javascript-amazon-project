import { orders } from "../data/orders.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { cart } from "../data/cart-class.js";

async function loadPage() {
  await loadProductsFetch();

  let cartQuantity = cart.calculateCartQuantity();
  document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;

  let trackingHtml = "";

  const urlId = window.location.href;

  const matchingOrderId = orders.find((order) => {
    return urlId.includes(order.id);
  });

  const matchingOrderProduct = matchingOrderId.products.find((product) => {
    return urlId.includes(product.productId);
  });

  const matchingProduct = getProduct(matchingOrderProduct.productId);

  const today = dayjs();
  const orderTime = dayjs(matchingOrderId.orderTime);
  const deliveryTime = dayjs(matchingOrderProduct.estimatedDeliveryTime);
  const percentProgress =
    (today.diff(orderTime) / deliveryTime.diff(orderTime)) * 100;

  trackingHtml += ` 
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        Arriving on ${dayjs(matchingOrderProduct.estimatedDeliveryTime).format(
          "dddd, MMMM D"
        )}
      </div>

      <div class="product-info">
        ${matchingProduct.name}
      </div>

      <div class="product-info">
        Quantity: ${matchingOrderProduct.quantity}
      </div>

      <img class="product-image" src=" ${matchingProduct.image}">

      <div class="progress-labels-container">
        <div class="progress-label ${
          percentProgress < 50 ? "current-status" : ""
        }">
          Preparing
        </div>
        <div class="progress-label ${
          percentProgress >= 50 && percentProgress < 100 ? "current-status" : ""
        }">
          Shipped
        </div>
        <div class="progress-label ${
          percentProgress >= 100 ? "current-status" : ""
        }">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${percentProgress}%;"></div>
      </div>
    `;

  document.querySelector(".js-order-tracking").innerHTML = trackingHtml;
}

loadPage();
