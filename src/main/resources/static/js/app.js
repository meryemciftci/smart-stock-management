const API_BASE_URL = 'http://localhost:8081/api';

// Sayfa değiştirme
function showPage(pageName) {
    // Tüm sayfaları gizle
    const pages = document.querySelectorAll('.content-page');
    pages.forEach(page => page.style.display = 'none');

    // Tüm menü itemlarını pasif yap
    const menuItems = document.querySelectorAll('.list-group-item');
    menuItems.forEach(item => item.classList.remove('active'));

    // Seçili sayfayı göster
    document.getElementById(pageName + '-page').style.display = 'block';

    // Sayfa yüklendiğinde veri çek
    if (pageName === 'dashboard') {
        loadDashboard();
    } else if (pageName === 'products') {
        loadProducts();
    }
}

// Dashboard verilerini yükle
async function loadDashboard() {
    try {
        const products = await fetch(`${API_BASE_URL}/products`).then(r => r.json());
        const warehouses = await fetch(`${API_BASE_URL}/warehouses`).then(r => r.json());
        const lowStock = await fetch(`${API_BASE_URL}/stocks/low-stock`).then(r => r.json());
        const expiredBatches = await fetch(`${API_BASE_URL}/batches/expired`).then(r => r.json());

        document.getElementById('total-products').textContent = products.length;
        document.getElementById('total-warehouses').textContent = warehouses.length;
        document.getElementById('low-stock').textContent = lowStock.length;
        document.getElementById('expired-batches').textContent = expiredBatches.length;
    } catch (error) {
        console.error('Dashboard yüklenirken hata:', error);
    }
}

// Ürünleri listele
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const products = await response.json();

        const tableBody = document.getElementById('products-table');
        tableBody.innerHTML = '';

        products.forEach(product => {
            const row = `
                <tr>
                    <td>${product.sku}</td>
                    <td>${product.name}</td>
                    <td>${product.unitPrice || '-'} ₺</td>
                    <td>${product.unit || '-'}</td>
                    <td>${product.minimumStockLevel || '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editProduct(${product.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
        alert('Ürünler yüklenemedi!');
    }
}

// Ürün formu göster/gizle
function showProductForm() {
    document.getElementById('product-form').style.display = 'block';
}

function hideProductForm() {
    document.getElementById('product-form').style.display = 'none';
    document.getElementById('add-product-form').reset();
}

// Ürün ekleme formu
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-product-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const product = {
                sku: document.getElementById('product-sku').value,
                name: document.getElementById('product-name').value,
                description: document.getElementById('product-description').value,
                unitPrice: parseFloat(document.getElementById('product-price').value) || 0,
                unit: document.getElementById('product-unit').value,
                minimumStockLevel: parseInt(document.getElementById('product-min-stock').value) || 0,
                currentStock: 0
            };

            try {
                const response = await fetch(`${API_BASE_URL}/products`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(product)
                });

                if (response.ok) {
                    alert('Ürün başarıyla eklendi!');
                    hideProductForm();
                    loadProducts();
                } else {
                    alert('Ürün eklenirken hata oluştu!');
                }
            } catch (error) {
                console.error('Hata:', error);
                alert('Bağlantı hatası!');
            }
        });
    }

    // Sayfa yüklendiğinde dashboard göster
    loadDashboard();
});

// Ürün silme
async function deleteProduct(id) {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Ürün silindi!');
                loadProducts();
            } else {
                alert('Ürün silinemedi!');
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Bağlantı hatası!');
        }
    }
}

// Ürün düzenleme (basit versiyon)
function editProduct(id) {
    alert('Düzenleme özelliği yakında eklenecek!');
}