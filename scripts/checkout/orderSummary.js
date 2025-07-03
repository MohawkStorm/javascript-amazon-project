// Imports

import { cart } from "../../data/cart-class.js";
import { getProduct } from "../../data/products.js";
import { renderCheckoutHeader } from "../checkout/checkoutHeader.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import {
  deliveryOptions,
  getDeliveryOption,
  calculateDeliveryDate,
} from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";

// Generate checkout page's HTML

export function renderOrderSummary() {
  let cartSummaryHTML = ``;

  cart.cartItems.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
  <div class="cart-item-container js-cart-item-container js-cart-item-container-${
    matchingProduct.id
  }">
          <div class="delivery-date">
            Delivery date: ${dateString}
          </div>

          <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingProduct.image}">

            <div class="cart-item-details">
              <div class="product-name js-product-name-${matchingProduct.id}">
                ${matchingProduct.name}
              </div>
              <div class="product-price js-product-price-${matchingProduct.id}">
              ${matchingProduct.getPrice()}
              </div>
              <div class="product-quantity js-product-quantity-${
                matchingProduct.id
              }">
                <span>
                  Quantity: <span class="quantity-label js-quantity-label-${
                    matchingProduct.id
                  }">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${
                  matchingProduct.id
                }">
                  Update
                </span>
                 <input class="quantity-input js-quantity-input-${
                   matchingProduct.id
                 }">
            <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${
              matchingProduct.id
            }">Save</span>
                <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${
                  matchingProduct.id
                }" data-product-id="${matchingProduct.id}">
                  Delete
                </span>
              </div>
            </div>

            <div class="delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>
             ${deliveryOptionsHTML(matchingProduct, cartItem)}
            </div>
          </div>
        </div>
        
        `;
  });

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  // Update quantity

  document.querySelectorAll(".js-update-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );

      const currentQuantity = document.querySelector(
        `.js-quantity-label-${productId}`
      ).textContent;

      const inputQuantity = document.querySelector(
        `.js-quantity-input-${productId}`
      );

      inputQuantity.value = currentQuantity;

      container.classList.add("is-editing-quantity");
    });
  });

  // Save new quantity

  document.querySelectorAll(".js-save-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.remove("is-editing-quantity");

      const inputQuantity = document.querySelector(
        `.js-quantity-input-${productId}`
      );
      const newQuantity = Number(inputQuantity.value);

      if (newQuantity < 1 || newQuantity >= 1000) {
        alert("Quantity must be at least 1 and less than 1000 ");
        return;
      } else {
        cart.updateQuantity(productId, newQuantity);

        const quantityLabel = document.querySelector(
          `.js-quantity-label-${productId}`
        );

        quantityLabel.innerHTML = newQuantity;

        renderPaymentSummary();
        renderCheckoutHeader();
        renderOrderSummary();
      }
    });
  });

  // Delete items from checkout

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      cart.removeFromCart(productId);
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();
      renderPaymentSummary();
      renderCheckoutHeader();
      renderOrderSummary();
    });
  });

  // delivery date options

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";

    deliveryOptions.forEach((deliveryOption) => {
      const dateString = calculateDeliveryDate(deliveryOption);
      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)}`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += ` <div class="delivery-option js-delivery-option" data-product-id="${
        matchingProduct.id
      }" data-delivery-option-id="${deliveryOption.id}">
                <input type="radio" ${
                  isChecked ? "checked" : ""
                } class="delivery-option-input" name="delivery-option-${
        matchingProduct.id
      }">
                <div>
                  <div class="delivery-option-date">
                    ${dateString}
                  </div>
                  <div class="delivery-option-price">
                    ${priceString} Shipping
                  </div>
                </div>
              </div>
              `;
    });

    return html;
  }

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      cart.updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  renderPaymentSummary();
  renderCheckoutHeader();
}
