import { calculateCartQuantity } from "../../data/cart.js";

export function renderCheckoutHeader() {
  let cartQuantity = calculateCartQuantity();
  let checkoutHeaderHTML = `Checkout (<a class="return-to-home-link" href="amazon.html">${cartQuantity} items</a>)`;
  document.querySelector(".js-checkout-header-items").innerHTML =
    checkoutHeaderHTML;
  return checkoutHeaderHTML;
}
