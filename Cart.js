document.addEventListener('DOMContentLoaded', function() {
    let cart = window.cartFunctions.getCart();
    const itemsList = document.querySelector('.items-list');
    const orderForm = document.getElementById('order-form');

    function displayCartItems() {
        itemsList.innerHTML = '';
        
        if (cart.length === 0) {
            itemsList.innerHTML = `
                <div class="empty-cart">
                    <p>Your cart is empty</p>
                    <a href="Index.html">Browse our delicious foods</a>
                </div>
            `;
            updateCartTotals();
            return;
        }

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-info">
                    <img src="${item.image}" alt="${item.name}" class="item-image">
                    <div>
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">${formatRupiah(item.price)}</div>
                    </div>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
                <div>
                    <button class="remove-item" data-index="${index}">Remove</button>
                </div>
            `;
            itemsList.appendChild(cartItem);
        });

        updateCartTotals();
    }

    function updateCartTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = cart.length > 0 ? 12000 : 0;
        const total = subtotal + deliveryFee;

        document.getElementById('subtotal').textContent = formatRupiah(subtotal);
        document.getElementById('delivery-fee').textContent = formatRupiah(deliveryFee);
        document.getElementById('total').textContent = formatRupiah(total);

        window.cartFunctions.updateCartCount();
    }

    itemsList.addEventListener('click', function(e) {
        if (e.target.classList.contains('quantity-btn')) {
            const index = e.target.dataset.index;
            if (e.target.classList.contains('plus')) {
                cart[index].quantity += 1;
            } else if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            window.cartFunctions.saveCart(cart);
            displayCartItems();
        } else if (e.target.classList.contains('remove-item')) {
            cart.splice(e.target.dataset.index, 1);
            window.cartFunctions.saveCart(cart);
            displayCartItems();
        }
    });

    // Initial display
    displayCartItems();
});