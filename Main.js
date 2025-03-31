// Format jadi rupiah
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

const products = [
    {
        id: 1,
        name: "Soto",
        price: 30000,
        image: "Photo/Soto.png",
        description: "Sup khas Indonesia dengan kuah rempah dan daging."
    },
    {
        id: 2,
        name: "Pempek",
        price: 25000,
        image: "Photo/Pepek.png",
        description: "Makanan khas Palembang berbahan ikan dan sagu, disajikan dengan cuko."
    },
    {
        id: 3,
        name: "Rendang",
        price: 35000,
        image: "Photo/Rendang.png",
        description: "Hidangan daging khas Indonesia dengan santan dan rempah khas."
    }
];

// Debugging log to check if script is running
console.log("Main.js loaded successfully!");
console.log("Products:", products);

// Render products dynamically
function renderProducts() {
    console.log("Rendering products...");

    const container = document.querySelector('.products-container');
    if (!container) {
        console.error("ERROR: .products-container not found in Index.html");
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">${formatRupiah(product.price)}</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `).join('');

    console.log("Products rendered successfully.");
}

document.addEventListener('DOMContentLoaded', renderProducts);

if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}

window.cartFunctions = {
    getCart: function() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    },
    saveCart: function(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartCount();
    },
    updateCartCount: function() {
        const cart = this.getCart();
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
        });
    },
    addToCart: function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        let cart = this.getCart();
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart(cart);
        return cart;
    }
};

if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}

window.cartFunctions.updateCartCount();

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('add-to-cart')) {
        const productId = parseInt(e.target.dataset.id);
        console.log("Adding to cart:", productId);
        window.cartFunctions.addToCart(productId);
    }
});
