// Shopping Cart Functionality
// Initialize cart from localStorage, ensuring prices are numbers to avoid NaN issues
let cart = JSON.parse(localStorage.getItem('cart')) || [];
cart = cart.map(item => ({
    ...item,
    price: parseFloat(item.price) || 0
}));
let cartTotal = 0;

// Orders storage - array to hold previous orders
let orders = JSON.parse(localStorage.getItem('orders')) || [];

const floatingCart = document.getElementById('floating-cart');
const cartItems = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const closeCartBtn = document.getElementById('close-cart');
const checkoutBtn = document.getElementById('checkout-btn');
const floatingCartBtn = document.getElementById('floating-cart-btn');
const cartCountElement = document.getElementById('cart-count');

// مستمعي الأحداث لأزرار إضافة إلى السلة
// أزرار إضافة إلى السلة - تتعامل مع إضافة عنصر واحد
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const name = e.target.dataset.name; // الحصول على اسم العنصر من خاصية البيانات
        const price = parseFloat(e.target.dataset.price); // الحصول على السعر وتحويله إلى رقم
        addToCart(name, price); // إضافة العنصر إلى السلة
    });
});

// أزرار الدبل - تتعامل مع إضافة عنصرين (نفس المنطق كالواحد)
document.querySelectorAll('.double-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const name = e.target.dataset.name; // الحصول على اسم العنصر من خاصية البيانات
        const price = parseFloat(e.target.dataset.price); // الحصول على السعر وتحويله إلى رقم
        addToCart(name, price); // إضافة العنصر إلى السلة
    });
});

// أزرار الإضافات - تتعامل مع إضافة الإضافات
document.querySelectorAll('.add-extra-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const name = e.target.dataset.name; // الحصول على اسم الإضافة من خاصية البيانات
        const price = parseFloat(e.target.dataset.price); // الحصول على السعر وتحويله إلى رقم
        addToCart(name, price); // إضافة الإضافة إلى السلة
    });
});

// Add item to cart
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    saveCart();
    updateCartDisplay();
    updateCartCount();
    updateExtraButtons();
}

// Remove item from cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCartDisplay();
    updateCartCount();
}

// Update cart quantity
function updateQuantity(name, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(name);
        return;
    }
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartDisplay();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// تحديث عرض السلة - يعرض عناصر السلة في واجهة المستخدم ويحسب المجموع
function updateCartDisplay() {
    cartItems.innerHTML = ''; // مسح عناصر السلة الموجودة
    cartTotal = 0; // إعادة تعيين المجموع

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-400 text-sm">السلة فارغة</p>'; // عرض رسالة السلة الفارغة
        cartTotalElement.textContent = '0.00'; // تعيين المجموع إلى 0
        return;
    }

    // التكرار على كل عنصر في السلة وإنشاء عناصر واجهة المستخدم
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity; // حساب المجموع الفرعي للعنصر
        cartTotal += itemTotal; // إضافة إلى المجموع العام

        // إنشاء عنصر السلة
        const itemElement = document.createElement('div');
        itemElement.className = 'flex justify-between items-center mb-2 p-2 bg-gray-700 rounded';
        itemElement.innerHTML = `
            <div class="flex-1">
                <p class="text-sm font-bold">${item.name}</p> <!-- اسم العنصر -->
                <p class="text-xs text-gray-400">${item.price} ج.م × ${item.quantity}</p> <!-- السعر والكمية -->
            </div>
            <div class="flex items-center gap-2">
                <!-- زر تقليل الكمية -->
                <button class="quantity-btn bg-gray-600 text-white px-2 py-1 rounded text-xs" data-action="decrease" data-name="${item.name}">-</button>
                <span class="text-sm">${item.quantity}</span> <!-- الكمية الحالية -->
                <!-- زر زيادة الكمية -->
                <button class="quantity-btn bg-gray-600 text-white px-2 py-1 rounded text-xs" data-action="increase" data-name="${item.name}">+</button>
                <!-- زر إزالة العنصر -->
                <button class="remove-btn text-red-400 hover:text-red-300 ml-2" data-name="${item.name}">×</button>
            </div>
        `;
        cartItems.appendChild(itemElement); // إضافة العنصر إلى واجهة السلة
    });

    cartTotalElement.textContent = cartTotal.toFixed(2); // تحديث عرض المجموع

    // إضافة مستمعي الأحداث لأزرار الكمية وأزرار الإزالة
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.dataset.action; // الحصول على الإجراء (زيادة/تقليل)
            const name = e.target.dataset.name; // الحصول على اسم العنصر
            const item = cart.find(item => item.name === name);
            if (action === 'increase') {
                updateQuantity(name, item.quantity + 1); // زيادة الكمية
            } else if (action === 'decrease') {
                updateQuantity(name, item.quantity - 1); // تقليل الكمية
            }
        });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            removeFromCart(e.target.dataset.name); // إزالة العنصر من السلة
        });
    });
}

// Toggle cart
floatingCartBtn.addEventListener('click', () => {
    floatingCart.classList.toggle('hidden');
    // Pre-select user's area if logged in
    if (userData.area) {
        const areaSelect = document.getElementById('area-select');
        areaSelect.value = userData.area;
    }
});

// Hide cart
function hideCart() {
    floatingCart.classList.add('hidden');
}

// Show cart
function showCart() {
    floatingCart.classList.remove('hidden');
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    if (totalItems === 0) {
        cartCountElement.classList.add('hidden');
    } else {
        cartCountElement.classList.remove('hidden');
    }
}

// Event listeners
closeCartBtn.addEventListener('click', hideCart);

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('السلة فارغة!');
        return;
    }

    // Check if user is logged in
    if (!userData.name || !userData.phone || !userData.address) {
        alert('يرجى تسجيل الدخول أولاً!');
        loginModal.classList.remove('hidden');
        return;
    }

    let area = '';
    let deliveryFee = 0;
    let areaText = '';

    if (orderType === 'delivery') {
        // Get selected area and fee for delivery
        const areaSelect = document.getElementById('area-select');
        const selectedOption = areaSelect.options[areaSelect.selectedIndex];
        area = selectedOption.value;
        deliveryFee = parseFloat(selectedOption.getAttribute('data-fee')) || 0;
        areaText = selectedOption.text;
    } else {
        // Takeaway - no delivery fee
        area = 'تيك أوي';
        areaText = 'تيك أوي';
        deliveryFee = 0;
    }

    let total = cartTotal + deliveryFee;

    // Format order message
    let message = `طلب جديد من ${userData.name}\n`;
    message += `الهاتف: ${userData.phone}\n`;
    message += `العنوان: ${userData.address}\n`;
    message += `نوع الطلب: ${areaText}\n\n`;
    message += `الطلبات:\n`;

    cart.forEach(item => {
        message += `- ${item.name} (الكمية: ${item.quantity}) - ${item.price * item.quantity} ج.م\n`;
    });

    message += `\nالمجموع: ${total.toFixed(2)} ج.م`;
    if (deliveryFee > 0) {
        message += ` (شامل رسوم التوصيل: ${deliveryFee} ج.م)`;
    }

    // Encode message and open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/201121334575?text=${encodedMessage}`, '_blank');

    // Save order to history
    const order = {
        id: Date.now(),
        user: userData,
        items: [...cart],
        area: areaText,
        deliveryFee: deliveryFee,
        total: total,
        date: new Date().toLocaleString('ar-EG')
    };
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart after sending
    cart = [];
    saveCart();
    updateCartDisplay();
    updateCartCount();
    hideCart();
});

// Initialize cart display on page load
updateCartDisplay();
updateCartCount();

// Order type selection
const takeawayBtn = document.getElementById('takeaway-btn');
const deliveryBtn = document.getElementById('delivery-btn');
const areaSelection = document.getElementById('area-selection');
let orderType = 'takeaway'; // Default to takeaway

takeawayBtn.addEventListener('click', () => {
    orderType = 'takeaway';
    takeawayBtn.classList.add('bg-red-600');
    takeawayBtn.classList.remove('bg-gray-600');
    deliveryBtn.classList.add('bg-gray-600');
    deliveryBtn.classList.remove('bg-blue-600');
    areaSelection.classList.add('hidden');
});

deliveryBtn.addEventListener('click', () => {
    orderType = 'delivery';
    deliveryBtn.classList.add('bg-blue-600');
    deliveryBtn.classList.remove('bg-gray-600');
    takeawayBtn.classList.add('bg-gray-600');
    takeawayBtn.classList.remove('bg-red-600');
    areaSelection.classList.remove('hidden');
});

// Modal elements
const loginModal = document.getElementById('login-modal');
const complaintModal = document.getElementById('complaint-modal');

// User data storage
let userData = JSON.parse(localStorage.getItem('userData')) || {};

// Orders modal elements
const ordersModal = document.getElementById('orders-modal');
const ordersList = document.getElementById('orders-list');
const currentCartStatus = document.getElementById('current-cart-status');
const closeOrdersModal = document.getElementById('close-orders-modal');

document.getElementById('orders-btn').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('translate-x-full');
    displayOrders();
    ordersModal.classList.remove('hidden');
});

closeOrdersModal.addEventListener('click', () => {
    ordersModal.classList.add('hidden');
});

// Function to display orders
function displayOrders() {
    ordersList.innerHTML = '';

    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="text-gray-400 text-sm">لا توجد طلبات سابقة</p>';
    } else {
        orders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.className = 'bg-gray-700 p-4 rounded mb-4';
            orderElement.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <h4 class="text-lg font-bold">طلب رقم ${order.id}</h4>
                    <span class="text-sm text-gray-400">${order.date}</span>
                </div>
                <p class="text-sm text-gray-300 mb-2">العميل: ${order.user.name}</p>
                <p class="text-sm text-gray-300 mb-2">المنطقة: ${order.area}</p>
                <div class="mb-2">
                    <p class="text-sm font-bold mb-1">الطلبات:</p>
                    ${order.items.map(item => `<p class="text-sm text-gray-300">- ${item.name} (الكمية: ${item.quantity}) - ${item.price * item.quantity} ج.م</p>`).join('')}
                </div>
                <p class="text-sm font-bold">المجموع: ${order.total.toFixed(2)} ج.م</p>
            `;
            ordersList.appendChild(orderElement);
        });
    }

    // Display current cart status
    currentCartStatus.innerHTML = '';
    if (cart.length === 0) {
        currentCartStatus.innerHTML = '<p class="text-gray-400 text-sm">السلة فارغة</p>';
    } else {
        currentCartStatus.innerHTML = `
            <p class="text-sm font-bold mb-2">المنتجات في السلة:</p>
            ${cart.map(item => `<p class="text-sm text-gray-300">- ${item.name} (الكمية: ${item.quantity}) - ${item.price * item.quantity} ج.م</p>`).join('')}
            <p class="text-sm font-bold mt-2">المجموع: ${cartTotal.toFixed(2)} ج.م</p>
        `;
    }
}

document.getElementById('contact-btn').addEventListener('click', () => {
    window.open('https://wa.me/201557783914', '_blank');
});

document.getElementById('complaint-btn').addEventListener('click', () => {
    complaintModal.classList.remove('hidden');
});

document.getElementById('location-btn').addEventListener('click', () => {
    window.open('https://maps.app.goo.gl/LDaxaTJ8yu8QJCc56', '_blank');
});

document.getElementById('login-btn').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('translate-x-full');
    loginModal.classList.remove('hidden');
});

// Sidebar functionality
document.getElementById('sidebar-toggle').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('translate-x-full');
});

document.getElementById('close-sidebar').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('translate-x-full');
});

// Login modal actions
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    const address = document.getElementById('user-address').value;
    const area = document.getElementById('user-area').value;

    if (name && phone && address && area) {
        userData = { name, phone, address, area };
        localStorage.setItem('userData', JSON.stringify(userData));
        alert('تم تسجيل الدخول بنجاح!');
        loginModal.classList.add('hidden');
        document.getElementById('login-form').reset();
    } else {
        alert('يرجى ملء جميع الحقول!');
    }
});

document.getElementById('close-login-modal').addEventListener('click', () => {
    loginModal.classList.add('hidden');
});

// Complaint modal actions
document.getElementById('send-complaint').addEventListener('click', () => {
    const complaintText = document.getElementById('complaint-text').value;
    if (complaintText.trim()) {
        const message = encodeURIComponent(`شكوى: ${complaintText}`);
        window.open(`https://wa.me/201121334575?text=${message}`, '_blank');
        complaintModal.classList.add('hidden');
        document.getElementById('complaint-text').value = '';
    } else {
        alert('يرجى كتابة الشكوى!');
    }
});

document.getElementById('close-complaint-modal').addEventListener('click', () => {
    complaintModal.classList.add('hidden');
});

// Update extra buttons based on cart contents
function updateExtraButtons() {
    const hasSandwich = cart.some(item => !['صوص على البطاطس', 'سويت كورن'].includes(item.name));
    document.querySelectorAll('.add-extra-btn').forEach(button => {
        button.disabled = !hasSandwich;
        if (hasSandwich) {
            button.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            button.classList.add('opacity-50', 'cursor-not-allowed');
        }
    });
}

// Initialize extra buttons on page load
updateExtraButtons();

// Category selection functionality
document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.dataset.category;

        // Hide all sections
        document.querySelectorAll('.menu-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(category);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigation active state
        document.querySelectorAll('.category-link').forEach(navLink => {
            navLink.classList.remove('active');
        });
        e.target.classList.add('active');

        // Smooth scroll to section
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});
function updateRestaurantStatus() {
    const now = new Date();
    const hour = now.getHours();
    
    // المواعيد: من 11 صباحاً حتى 3 فجراً
    const isOpen = (hour >= 11 || hour < 3);
    
    // ابحث عن العنصر الذي يعرض الحالة (تأكد أن له id="status-text" أو استخدم الكلاس)
    const statusElement = document.getElementById('status-text') || document.querySelector('.status-bar span');
    
    if (statusElement) {
        if (isOpen) {
            statusElement.innerText = "🟢 المطعم مفتوح الآن - نتشرف بزيارتكم";
            statusElement.parentElement.style.backgroundColor = "#16a34a"; // أخضر هادئ
        } else {
            statusElement.innerText = "🔴 المطعم مغلق الآن - نعود للعمل الساعة 11 صباحاً";
            statusElement.parentElement.style.backgroundColor = "#991b1b"; // أحمر داكن
        }
    }

    // قفل جميع أزرار الإضافة (الرئيسي، الدبل، الإضافات) إذا كان مغلقاً
    if (!isOpen) {
        const allAddButtons = document.querySelectorAll('button, .btn');
        allAddButtons.forEach(btn => {
            if (btn.innerText.includes("أضف") || btn.innerText.includes("سلة")) {
                btn.innerText = "مغلق حالياً";
                btn.style.pointerEvents = "none";
                btn.style.opacity = "0.5";
                btn.style.filter = "grayscale(1)";
            }
        });
    }
}

// تنفيذ الفحص فور تحميل الصفحة
window.addEventListener('DOMContentLoaded', updateRestaurantStatus);
