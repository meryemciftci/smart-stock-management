const API_BASE_URL = 'http://localhost:8081/api';

// Sidebar toggle (mobil için)
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}


// Sayfa değiştirme
function showPage(pageName) {
    // Tüm sayfaları gizle
    const pages = document.querySelectorAll('.content-page');
    pages.forEach(page => page.style.display = 'none');

    // Tüm menü itemlarını pasif yap
    const menuItems = document.querySelectorAll('.nav-item');
    menuItems.forEach(item => item.classList.remove('active'));

    // Tıklanan menü itemını aktif yap
    event.target.closest('.nav-item').classList.add('active');

    // Seçili sayfayı göster
    document.getElementById(pageName + '-page').style.display = 'block';

    // Sayfa yüklendiğinde veri çek
    if (pageName === 'dashboard') {
        loadDashboard();
    } else if (pageName === 'products') {
        loadProducts();
    } else if (pageName === 'warehouses') {
        loadWarehouses();
    } else if (pageName === 'suppliers') {
        loadSuppliers();
    } else if (pageName === 'stocks') {
        loadStocks();
    } else if (pageName === 'batches') {
        loadBatches();
    } else if (pageName === 'transfers') {
        loadTransfers();
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

        if (products.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Henüz ürün eklenmemiş</td></tr>';
            return;
        }

        products.forEach(product => {
            const row = `
                <tr>
                    <td><strong>${product.sku}</strong></td>
                    <td>${product.name}</td>
                    <td>${product.unitPrice ? product.unitPrice.toFixed(2) + ' ₺' : '-'}</td>
                    <td>${product.unit || '-'}</td>
                    <td>${product.minimumStockLevel || '-'}</td>
                    <td class="text-end">
                        <button class="btn-modern btn-warning btn-sm" onclick="editProduct(${product.id})" title="Düzenle">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-modern btn-danger btn-sm" onclick="deleteProduct(${product.id})" title="Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
        showNotification('Ürünler yüklenemedi!', 'error');
    }
}

// Ürün formu göster/gizle
function showProductForm() {
    document.getElementById('product-form').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    showNotification('Ürün başarıyla eklendi!', 'success');
                    hideProductForm();
                    loadProducts();
                    loadDashboard();
                } else {
                    showNotification('Ürün eklenirken hata oluştu!', 'error');
                }
            } catch (error) {
                console.error('Hata:', error);
                showNotification('Bağlantı hatası!', 'error');
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
                showNotification('Ürün başarıyla silindi!', 'success');
                loadProducts();
                loadDashboard();
            } else {
                showNotification('Ürün silinemedi!', 'error');
            }
        } catch (error) {
            console.error('Hata:', error);
            showNotification('Bağlantı hatası!', 'error');
        }
    }
}

// Ürün düzenleme
function editProduct(id) {
    showNotification('Düzenleme özelliği yakında eklenecek!', 'info');
}

// Bildirim göster
function showNotification(message, type = 'info') {
    // Basit alert - sonra toast notification yapabiliriz
    alert(message);
}
// ============================================
// WAREHOUSE (DEPO) FONKSİYONLARI
// ============================================

// Depoları listele
async function loadWarehouses() {
    try {
        const response = await fetch(`${API_BASE_URL}/warehouses`);
        const warehouses = await response.json();

        const tableBody = document.getElementById('warehouses-table');
        tableBody.innerHTML = '';

        if (warehouses.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Henüz depo eklenmemiş</td></tr>';
            return;
        }

        warehouses.forEach(warehouse => {
            const usagePercent = warehouse.totalCapacity > 0
                ? ((warehouse.currentUsage / warehouse.totalCapacity) * 100).toFixed(1)
                : 0;

            const statusBadge = warehouse.isActive
                ? '<span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">Aktif</span>'
                : '<span style="background: #ef4444; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">Pasif</span>';

            const row = `
                <tr>
                    <td><strong>${warehouse.code}</strong></td>
                    <td>${warehouse.name}</td>
                    <td>${warehouse.city || '-'}</td>
                    <td>${warehouse.totalCapacity ? warehouse.totalCapacity.toFixed(0) + ' m³' : '-'}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span>${warehouse.currentUsage ? warehouse.currentUsage.toFixed(0) + ' m³' : '-'}</span>
                            <span style="color: #6b7280; font-size: 12px;">(${usagePercent}%)</span>
                        </div>
                    </td>
                    <td>${warehouse.managerName || '-'}</td>
                    <td>${statusBadge}</td>
                    <td class="text-end">
                        <button class="btn-modern btn-warning btn-sm" onclick="editWarehouse(${warehouse.id})" title="Düzenle">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-modern btn-danger btn-sm" onclick="deleteWarehouse(${warehouse.id})" title="Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Depolar yüklenirken hata:', error);
        showNotification('Depolar yüklenemedi!', 'error');
    }
}

// Depo formu göster/gizle
function showWarehouseForm() {
    document.getElementById('warehouse-form').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideWarehouseForm() {
    document.getElementById('warehouse-form').style.display = 'none';
    document.getElementById('add-warehouse-form').reset();
}

// Depo ekleme formu
document.addEventListener('DOMContentLoaded', function() {
    const warehouseForm = document.getElementById('add-warehouse-form');
    if (warehouseForm) {
        warehouseForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const warehouse = {
                code: document.getElementById('warehouse-code').value,
                name: document.getElementById('warehouse-name').value,
                address: document.getElementById('warehouse-address').value,
                city: document.getElementById('warehouse-city').value,
                phone: document.getElementById('warehouse-phone').value,
                totalCapacity: parseFloat(document.getElementById('warehouse-capacity').value) || 0,
                currentUsage: parseFloat(document.getElementById('warehouse-usage').value) || 0,
                managerName: document.getElementById('warehouse-manager').value,
                isActive: true
            };

            try {
                const response = await fetch(`${API_BASE_URL}/warehouses`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(warehouse)
                });

                if (response.ok) {
                    showNotification('Depo başarıyla eklendi!', 'success');
                    hideWarehouseForm();
                    loadWarehouses();
                    loadDashboard();
                } else {
                    showNotification('Depo eklenirken hata oluştu!', 'error');
                }
            } catch (error) {
                console.error('Hata:', error);
                showNotification('Bağlantı hatası!', 'error');
            }
        });
    }
});

// Depo silme
async function deleteWarehouse(id) {
    if (confirm('Bu depoyu silmek istediğinizden emin misiniz?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/warehouses/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showNotification('Depo başarıyla silindi!', 'success');
                loadWarehouses();
                loadDashboard();
            } else {
                showNotification('Depo silinemedi!', 'error');
            }
        } catch (error) {
            console.error('Hata:', error);
            showNotification('Bağlantı hatası!', 'error');
        }
    }
}

// Depo düzenleme
function editWarehouse(id) {
    showNotification('Düzenleme özelliği yakında eklenecek!', 'info');
}
// ============================================
// SUPPLIER (TEDARİKÇİ) FONKSİYONLARI
// ============================================

// Tedarikçileri listele
async function loadSuppliers() {
    try {
        const response = await fetch(`${API_BASE_URL}/suppliers`);
        const suppliers = await response.json();

        const tableBody = document.getElementById('suppliers-table');
        tableBody.innerHTML = '';

        if (suppliers.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Henüz tedarikçi eklenmemiş</td></tr>';
            return;
        }

        suppliers.forEach(supplier => {
            const score = supplier.performanceScore || 0;
            let scoreBadge = '';
            if (score >= 80) {
                scoreBadge = `<span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">${score.toFixed(1)}</span>`;
            } else if (score >= 60) {
                scoreBadge = `<span style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">${score.toFixed(1)}</span>`;
            } else {
                scoreBadge = `<span style="background: #ef4444; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">${score.toFixed(1)}</span>`;
            }

            const statusBadge = supplier.isActive
                ? '<span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">Aktif</span>'
                : '<span style="background: #ef4444; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">Pasif</span>';

            const row = `
                <tr>
                    <td><strong>${supplier.code}</strong></td>
                    <td>${supplier.name}</td>
                    <td>${supplier.contactPerson || '-'}</td>
                    <td>${supplier.phone || '-'}</td>
                    <td>${supplier.email || '-'}</td>
                    <td>${scoreBadge}</td>
                    <td>${statusBadge}</td>
                    <td class="text-end">
                        <button class="btn-modern btn-warning btn-sm" onclick="editSupplier(${supplier.id})" title="Düzenle">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-modern btn-danger btn-sm" onclick="deleteSupplier(${supplier.id})" title="Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Tedarikçiler yüklenirken hata:', error);
        showNotification('Tedarikçiler yüklenemedi!', 'error');
    }
}

// Tedarikçi formu göster/gizle
function showSupplierForm() {
    document.getElementById('supplier-form').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideSupplierForm() {
    document.getElementById('supplier-form').style.display = 'none';
    document.getElementById('add-supplier-form').reset();
}

// Tedarikçi ekleme formu
document.addEventListener('DOMContentLoaded', function() {
    const supplierForm = document.getElementById('add-supplier-form');
    if (supplierForm) {
        supplierForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const supplier = {
                code: document.getElementById('supplier-code').value,
                name: document.getElementById('supplier-name').value,
                contactPerson: document.getElementById('supplier-contact').value,
                email: document.getElementById('supplier-email').value,
                address: document.getElementById('supplier-address').value,
                city: document.getElementById('supplier-city').value,
                phone: document.getElementById('supplier-phone').value,
                taxNumber: document.getElementById('supplier-tax').value,
                performanceScore: 0.0,
                isActive: true
            };

            try {
                const response = await fetch(`${API_BASE_URL}/suppliers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(supplier)
                });

                if (response.ok) {
                    showNotification('Tedarikçi başarıyla eklendi!', 'success');
                    hideSupplierForm();
                    loadSuppliers();
                } else {
                    showNotification('Tedarikçi eklenirken hata oluştu!', 'error');
                }
            } catch (error) {
                console.error('Hata:', error);
                showNotification('Bağlantı hatası!', 'error');
            }
        });
    }
});

// Tedarikçi silme
async function deleteSupplier(id) {
    if (confirm('Bu tedarikçiyi silmek istediğinizden emin misiniz?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showNotification('Tedarikçi başarıyla silindi!', 'success');
                loadSuppliers();
            } else {
                showNotification('Tedarikçi silinemedi!', 'error');
            }
        } catch (error) {
            console.error('Hata:', error);
            showNotification('Bağlantı hatası!', 'error');
        }
    }
}

// Tedarikçi düzenleme
function editSupplier(id) {
    showNotification('Düzenleme özelliği yakında eklenecek!', 'info');
}
// ============================================
// STOCK (STOK) FONKSİYONLARI
// ============================================

// Stokları listele
async function loadStocks() {
    try {
        const response = await fetch(`${API_BASE_URL}/stocks`);
        const stocks = await response.json();

        const tableBody = document.getElementById('stocks-table');
        tableBody.innerHTML = '';

        if (stocks.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Henüz stok kaydı eklenmemiş</td></tr>';
            return;
        }

        stocks.forEach(stock => {
            const productName = stock.product ? stock.product.name : 'Bilinmiyor';
            const warehouseName = stock.warehouse ? stock.warehouse.name : 'Bilinmiyor';

            let statusBadge = '';
            if (stock.availableQuantity <= (stock.reorderPoint || 0)) {
                statusBadge = '<span style="background: #ef4444; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">Düşük Stok</span>';
            } else if (stock.availableQuantity <= (stock.reorderPoint || 0) * 1.5) {
                statusBadge = '<span style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">Uyarı</span>';
            } else {
                statusBadge = '<span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">Normal</span>';
            }

            const row = `
                <tr>
                    <td><strong>${productName}</strong></td>
                    <td>${warehouseName}</td>
                    <td>${stock.quantity || 0}</td>
                    <td>${stock.reservedQuantity || 0}</td>
                    <td><strong>${stock.availableQuantity || 0}</strong></td>
                    <td>${stock.reorderPoint || '-'}</td>
                    <td>${statusBadge}</td>
                    <td class="text-end">
                        <button class="btn-modern btn-warning btn-sm" onclick="updateStockQuantity(${stock.id}, 10)" title="+10 Ekle">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn-modern btn-danger btn-sm" onclick="updateStockQuantity(${stock.id}, -10)" title="-10 Çıkar">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="btn-modern btn-danger btn-sm" onclick="deleteStock(${stock.id})" title="Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Stoklar yüklenirken hata:', error);
        showNotification('Stoklar yüklenemedi!', 'error');
    }
}

// Stok formu göster
async function showStockForm() {
    // Önce dropdown'ları doldur
    await loadProductsDropdown('stock-product');
    await loadWarehousesDropdown('stock-warehouse');

    document.getElementById('stock-form').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideStockForm() {
    document.getElementById('stock-form').style.display = 'none';
    document.getElementById('add-stock-form').reset();
}

// Ürünleri dropdown'a yükle
// Ürünleri dropdown'a yükle
async function loadProductsDropdown(selectId = 'stock-product') {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const products = await response.json();

        const select = document.getElementById(selectId);
        if (!select) return;

        select.innerHTML = '<option value="">Ürün seçin...</option>';

        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.sku} - ${product.name}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
    }
}

// Depoları dropdown'a yükle
async function loadWarehousesDropdown(selectId = 'stock-warehouse') {
    try {
        const response = await fetch(`${API_BASE_URL}/warehouses`);
        const warehouses = await response.json();

        const select = document.getElementById(selectId);
        if (!select) return;

        select.innerHTML = '<option value="">Depo seçin...</option>';

        warehouses.forEach(warehouse => {
            const option = document.createElement('option');
            option.value = warehouse.id;
            option.textContent = `${warehouse.code} - ${warehouse.name}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Depolar yüklenirken hata:', error);
    }
}


// Stok ekleme formu
document.addEventListener('DOMContentLoaded', function() {
    const stockForm = document.getElementById('add-stock-form');
    if (stockForm) {
        stockForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const stock = {
                product: {
                    id: parseInt(document.getElementById('stock-product').value)
                },
                warehouse: {
                    id: parseInt(document.getElementById('stock-warehouse').value)
                },
                quantity: parseInt(document.getElementById('stock-quantity').value),
                reservedQuantity: parseInt(document.getElementById('stock-reserved').value) || 0,
                reorderPoint: parseInt(document.getElementById('stock-reorder').value) || null
            };

            try {
                const response = await fetch(`${API_BASE_URL}/stocks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(stock)
                });

                if (response.ok) {
                    showNotification('Stok kaydı başarıyla eklendi!', 'success');
                    hideStockForm();
                    loadStocks();
                    loadDashboard();
                } else {
                    showNotification('Stok kaydı eklenirken hata oluştu!', 'error');
                }
            } catch (error) {
                console.error('Hata:', error);
                showNotification('Bağlantı hatası!', 'error');
            }
        });
    }
});

// Stok miktarını güncelle
async function updateStockQuantity(stockId, change) {
    try {
        const response = await fetch(`${API_BASE_URL}/stocks/${stockId}/quantity?quantityChange=${change}`, {
            method: 'PUT'
        });

        if (response.ok) {
            showNotification(`Stok ${change > 0 ? 'eklendi' : 'çıkarıldı'}!`, 'success');
            loadStocks();
            loadDashboard();
        } else {
            showNotification('Stok güncellenemedi!', 'error');
        }
    } catch (error) {
        console.error('Hata:', error);
        showNotification('Bağlantı hatası!', 'error');
    }
}

// Stok silme
async function deleteStock(id) {
    if (confirm('Bu stok kaydını silmek istediğinizden emin misiniz?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/stocks/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showNotification('Stok kaydı silindi!', 'success');
                loadStocks();
                loadDashboard();
            } else {
                showNotification('Stok kaydı silinemedi!', 'error');
            }
        } catch (error) {
            console.error('Hata:', error);
            showNotification('Bağlantı hatası!', 'error');
        }
    }
}
// ============================================
// BATCH (PARTİ) FONKSİYONLARI
// ============================================

// Partileri listele
async function loadBatches() {
    try {
        const response = await fetch(`${API_BASE_URL}/batches`);
        const batches = await response.json();

        // Uyarı kartlarını güncelle
        const expiringResponse = await fetch(`${API_BASE_URL}/batches/expiring?days=30`);
        const expiringBatches = await expiringResponse.json();

        const expiredResponse = await fetch(`${API_BASE_URL}/batches/expired`);
        const expiredBatches = await expiredResponse.json();

        document.getElementById('expiring-count').textContent = `${expiringBatches.length} parti 30 gün içinde sona erecek`;
        document.getElementById('expired-count').textContent = `${expiredBatches.length} parti süresi dolmuş`;

        const tableBody = document.getElementById('batches-table');
        tableBody.innerHTML = '';

        if (batches.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">Henüz parti eklenmemiş</td></tr>';
            return;
        }

        batches.forEach(batch => {
            const productName = batch.product ? batch.product.name : 'Bilinmiyor';
            const warehouseName = batch.warehouse ? batch.warehouse.name : 'Bilinmiyor';

            const mfgDate = batch.manufacturingDate ? new Date(batch.manufacturingDate).toLocaleDateString('tr-TR') : '-';
            const expDate = batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString('tr-TR') : '-';

            let statusBadge = '';
            if (batch.isExpired) {
                statusBadge = '<span style="background: #ef4444; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">Süresi Doldu</span>';
            } else if (batch.expiryDate) {
                const today = new Date();
                const expiry = new Date(batch.expiryDate);
                const daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

                if (daysLeft <= 30 && daysLeft > 0) {
                    statusBadge = `<span style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">${daysLeft} gün kaldı</span>`;
                } else if (daysLeft > 30) {
                    statusBadge = '<span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">Normal</span>';
                } else {
                    statusBadge = '<span style="background: #ef4444; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">Süresi Doldu</span>';
                }
            } else {
                statusBadge = '<span style="background: #6b7280; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">SKT Yok</span>';
            }

            const row = `
                <tr>
                    <td><strong>${batch.batchNumber}</strong></td>
                    <td>${productName}</td>
                    <td>${warehouseName}</td>
                    <td>${batch.quantity || 0}</td>
                    <td>${batch.remainingQuantity || 0}</td>
                    <td>${mfgDate}</td>
                    <td>${expDate}</td>
                    <td>${statusBadge}</td>
                    <td class="text-end">
                        <button class="btn-modern btn-danger btn-sm" onclick="deleteBatch(${batch.id})" title="Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Partiler yüklenirken hata:', error);
        showNotification('Partiler yüklenemedi!', 'error');
    }
}

// Parti formu göster
async function showBatchForm() {
    await loadProductsDropdown('batch-product');
    await loadWarehousesDropdown('batch-warehouse');
    await loadSuppliersDropdown();

    document.getElementById('batch-form').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideBatchForm() {
    document.getElementById('batch-form').style.display = 'none';
    document.getElementById('add-batch-form').reset();
}

// Tedarikçileri dropdown'a yükle
async function loadSuppliersDropdown() {
    try {
        const response = await fetch(`${API_BASE_URL}/suppliers`);
        const suppliers = await response.json();

        const select = document.getElementById('batch-supplier');
        select.innerHTML = '<option value="">Tedarikçi seçin...</option>';

        suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.textContent = `${supplier.code} - ${supplier.name}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Tedarikçiler yüklenirken hata:', error);
    }
}

// Parti ekleme formu
document.addEventListener('DOMContentLoaded', function() {
    const batchForm = document.getElementById('add-batch-form');
    if (batchForm) {
        batchForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const supplierId = document.getElementById('batch-supplier').value;

            const batch = {
                batchNumber: document.getElementById('batch-number').value,
                product: {
                    id: parseInt(document.getElementById('batch-product').value)
                },
                warehouse: {
                    id: parseInt(document.getElementById('batch-warehouse').value)
                },
                supplier: supplierId ? { id: parseInt(supplierId) } : null,
                quantity: parseInt(document.getElementById('batch-quantity').value),
                manufacturingDate: document.getElementById('batch-manufacturing').value || null,
                expiryDate: document.getElementById('batch-expiry').value || null,
                receivedDate: new Date().toISOString().split('T')[0]
            };

            try {
                const response = await fetch(`${API_BASE_URL}/batches`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(batch)
                });

                if (response.ok) {
                    showNotification('Parti başarıyla eklendi!', 'success');
                    hideBatchForm();
                    loadBatches();
                    loadDashboard();
                } else {
                    showNotification('Parti eklenirken hata oluştu!', 'error');
                }
            } catch (error) {
                console.error('Hata:', error);
                showNotification('Bağlantı hatası!', 'error');
            }
        });
    }
});

// Parti silme
async function deleteBatch(id) {
    if (confirm('Bu partiyi silmek istediğinizden emin misiniz?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/batches/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showNotification('Parti silindi!', 'success');
                loadBatches();
                loadDashboard();
            } else {
                showNotification('Parti silinemedi!', 'error');
            }
        } catch (error) {
            console.error('Hata:', error);
            showNotification('Bağlantı hatası!', 'error');
        }
    }
}

// ============================================
// TRANSFER (DEPO TRANSFERİ) FONKSİYONLARI
// ============================================

// Transferleri listele
async function loadTransfers() {
    try {
        const response = await fetch(`${API_BASE_URL}/transfers`);
        const transfers = await response.json();

        const tableBody = document.getElementById('transfers-table');
        tableBody.innerHTML = '';

        if (transfers.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Henüz transfer kaydı eklenmemiş</td></tr>';
            return;
        }

        transfers.forEach(transfer => {
            const productName = transfer.product ? transfer.product.name : 'Bilinmiyor';
            const fromWarehouse = transfer.fromWarehouse ? transfer.fromWarehouse.name : 'Bilinmiyor';
            const toWarehouse = transfer.toWarehouse ? transfer.toWarehouse.name : 'Bilinmiyor';

            const transferDate = transfer.transferDate
                ? new Date(transfer.transferDate).toLocaleString('tr-TR')
                : '-';

            let statusBadge = '';
            const status = transfer.status || 'PENDING';

            switch(status) {
                case 'PENDING':
                    statusBadge = '<span style="background: #6b7280; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">Beklemede</span>';
                    break;
                case 'APPROVED':
                    statusBadge = '<span style="background: #3b82f6; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">Onaylandı</span>';
                    break;
                case 'IN_TRANSIT':
                    statusBadge = '<span style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">Yolda</span>';
                    break;
                case 'COMPLETED':
                    statusBadge = '<span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">Tamamlandı</span>';
                    break;
                case 'CANCELLED':
                    statusBadge = '<span style="background: #ef4444; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">İptal</span>';
                    break;
            }

            const row = `
                <tr>
                    <td><strong>${transfer.transferCode}</strong></td>
                    <td>${productName}</td>
                    <td>${fromWarehouse}</td>
                    <td><i class="fas fa-arrow-right" style="color: #6b7280;"></i> ${toWarehouse}</td>
                    <td>${transfer.quantity || 0}</td>
                    <td>${statusBadge}</td>
                    <td>${transferDate}</td>
                    <td class="text-end">
                        <button class="btn-modern btn-danger btn-sm" onclick="deleteTransfer(${transfer.id})" title="Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Transferler yüklenirken hata:', error);
        showNotification('Transferler yüklenemedi!', 'error');
    }
}

// Transfer formu göster
async function showTransferForm() {
    await loadProductsDropdown('transfer-product');
    await loadWarehousesDropdown('transfer-from-warehouse');
    await loadWarehousesDropdown('transfer-to-warehouse');

    // Şu anki tarih-saati ayarla
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('transfer-date').value = now.toISOString().slice(0, 16);

    document.getElementById('transfer-form').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideTransferForm() {
    document.getElementById('transfer-form').style.display = 'none';
    document.getElementById('add-transfer-form').reset();
}

// Transfer ekleme formu
document.addEventListener('DOMContentLoaded', function() {
    const transferForm = document.getElementById('add-transfer-form');
    if (transferForm) {
        transferForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const fromWarehouseId = parseInt(document.getElementById('transfer-from-warehouse').value);
            const toWarehouseId = parseInt(document.getElementById('transfer-to-warehouse').value);

            // Aynı depoya transfer kontrolü
            if (fromWarehouseId === toWarehouseId) {
                showNotification('Kaynak ve hedef depo aynı olamaz!', 'error');
                return;
            }

            const transfer = {
                transferCode: document.getElementById('transfer-code').value,
                product: {
                    id: parseInt(document.getElementById('transfer-product').value)
                },
                fromWarehouse: {
                    id: fromWarehouseId
                },
                toWarehouse: {
                    id: toWarehouseId
                },
                quantity: parseInt(document.getElementById('transfer-quantity').value),
                transferDate: document.getElementById('transfer-date').value || null,
                notes: document.getElementById('transfer-notes').value,
                requestedBy: document.getElementById('transfer-requested-by').value,
                status: 'PENDING'
            };

            try {
                const response = await fetch(`${API_BASE_URL}/transfers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(transfer)
                });

                if (response.ok) {
                    showNotification('Transfer başarıyla oluşturuldu!', 'success');
                    hideTransferForm();
                    loadTransfers();
                } else {
                    showNotification('Transfer oluşturulurken hata oluştu!', 'error');
                }
            } catch (error) {
                console.error('Hata:', error);
                showNotification('Bağlantı hatası!', 'error');
            }
        });
    }
});

// Transfer silme
async function deleteTransfer(id) {
    if (confirm('Bu transfer kaydını silmek istediğinizden emin misiniz?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/transfers/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showNotification('Transfer kaydı silindi!', 'success');
                loadTransfers();
            } else {
                showNotification('Transfer kaydı silinemedi!', 'error');
            }
        } catch (error) {
            console.error('Hata:', error);
            showNotification('Bağlantı hatası!', 'error');
        }
    }
}