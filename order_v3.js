// Associative array for item prices
const prices = {
    "Hotdogs": 4.80,
    "French Fries": 3.95,
    "Drinks": 1.99
};

// Associative array for item quantities (initially set to 0)
let quantities = {
    "Hotdogs": 0,
    "French Fries": 0,
    "Drinks": 0
};

// Timer for the automatic order prompt
let autoPromptTimer;

// Function to round to exactly 2 decimal places and format as a string
function showMoney(amount) {
    let rounded = Math.round(amount * 100) / 100;
    let parts = rounded.toString().split(".");
    if (parts.length === 1) {
        return parts[0] + ".00";
    } else if (parts[1].length === 1) {
        return parts[0] + "." + parts[1] + "0";
    }
    return parts[0] + "." + parts[1];
}

// Function to start the order
function startOrder() {
    document.getElementById("orderCancelledMessage").textContent = ""; // Clear any previous cancellation message
    let cancelled = false;

    for (let item in quantities) {
        let quantity = prompt(`How many ${item} would you like?`, "0");

        // If the user presses "Cancel" in the prompt, cancel the order immediately
        if (quantity === null) {
            cancelOrder("Order cancelled due to prompt cancellation.");
            cancelled = true;
            break;
        }

        quantity = parseInt(quantity, 10);
        // If the user inputs a non-number, cancel the order
        if (isNaN(quantity)) {
            cancelOrder("Order cancelled due to invalid input.");
            cancelled = true;
            break;
        }

        quantities[item] = quantity;
    }

    if (!cancelled) {
        displayOrderDetails();
    }
}

// Cancel order function
function cancelOrder(message) {
    // Reset quantities to zero
    quantities = {
        "Hotdogs": 0,
        "French Fries": 0,
        "Drinks": 0
    };
    // Hide order details, show home page, and display cancellation message
    document.getElementById("orderDetails").classList.add("hidden");
    document.getElementById("homePage").classList.remove("hidden");
    document.getElementById("orderCancelledMessage").textContent = message;

    // Clear the automatic prompt timer if still active
    clearTimeout(autoPromptTimer);
}

// Function to calculate and display the order details
function displayOrderDetails() {
    // Calculate subtotal using a loop
    let subtotalBeforeDiscount = 0;
    for (let item in quantities) {
        subtotalBeforeDiscount += quantities[item] * prices[item];
    }

    let discount = 0;

    // Apply discount if eligible
    if (subtotalBeforeDiscount >= 25) {
        discount = subtotalBeforeDiscount * 0.10;
    }

    let subtotalAfterDiscount = subtotalBeforeDiscount - discount;

    // Calculate tax (6.25%)
    let tax = subtotalAfterDiscount * 0.0625;

    // Calculate final total
    let finalTotal = subtotalAfterDiscount + tax;

    // Display the order details
    let orderSummaryHTML = `
        <h2>Order Summary:</h2>
    `;

    for (let item in quantities) {
        orderSummaryHTML += `<p>${item}: ${quantities[item]} x $${showMoney(prices[item])} = $${showMoney(quantities[item] * prices[item])}</p>`;
    }

    orderSummaryHTML += `
        <hr>
        <p>Subtotal before discount: $${showMoney(subtotalBeforeDiscount)}</p>
        <p>Discount: -$${showMoney(discount)}</p>
        <p>Subtotal after discount: $${showMoney(subtotalAfterDiscount)}</p>
        <p>Tax (6.25%): $${showMoney(tax)}</p>
        <hr>
        <p><strong>Final Total: $${showMoney(finalTotal)}</strong></p>
    `;

    document.getElementById("orderSummary").innerHTML = orderSummaryHTML;
    document.getElementById("homePage").classList.add("hidden");
    document.getElementById("orderDetails").classList.remove("hidden");
}

// Start order button click event
document.getElementById("startOrderButton").addEventListener("click", startOrder);

// Cancel order button click event
document.getElementById("cancelOrderButton").addEventListener("click", () => {
    cancelOrder("Order cancelled.");
});

// Automatically prompt user to start an order after 10 seconds
window.addEventListener('load', () => {
    autoPromptTimer = setTimeout(() => {
        startOrder();
    }, 10000);
});
