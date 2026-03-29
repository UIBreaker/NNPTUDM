const API_URL = "https://api.escuelajs.co/api/v1/products";

let originalData = [];
let filteredData = [];
let currentPage = 1;
let pageSize = 5;

const productTableBody = document.getElementById("productTableBody");
const searchInput = document.getElementById("searchTitle");
const pageSizeSelect = document.getElementById("pageSize");
const pageIndicator = document.getElementById("pageIndicator");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");

// --- Khởi chạy khi load trang ---
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

// --- Lấy dữ liệu (Hàm getall của dashboard) ---
async function fetchProducts() {
    try {
        // Có thể hiện trạng thái loading ở đây
        productTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Đang tải dữ liệu...</td></tr>`;
        
        const response = await fetch(API_URL);
        originalData = await response.json();
        filteredData = [...originalData];
        
        renderTable();
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu từ Escuelajs API:", error);
        productTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:red;">Lỗi kết nối API!</td></tr>`;
    }
}

// --- Hiển thị dữ liệu (Render Table) ---
function renderTable() {
    productTableBody.innerHTML = "";

    // Phân trang
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filteredData.slice(startIndex, endIndex);

    if (pageData.length === 0) {
        productTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Không tìm thấy sản phẩm nào.</td></tr>`;
    } else {
        pageData.forEach(product => {
            // YÊU CẦU: Hiển thị toàn bộ hình ảnh
            let imagesHtml = `<div class="img-container">`;
            if (product.images && Array.isArray(product.images)) {
                product.images.forEach(imgRawUrl => {
                    // API đôi khi trả về mảng có chứa chuỗi ngoặc vuông/ngoặc kép cần dọn lại: '["https..."]'
                    let cleanUrl = imgRawUrl.replace(/[\[\]"]/g, "");
                    // Fallback lỗi hình
                    imagesHtml += `<img src="${cleanUrl}" alt="${product.title}" onerror="this.src='https://via.placeholder.com/80?text=No+Image'">`;
                });
            }
            imagesHtml += `</div>`;

            const row = `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.title}</td>
                    <td>$${product.price}</td>
                    <td>${imagesHtml}</td>
                </tr>
            `;
            productTableBody.innerHTML += row;
        });
    }

    // Cập nhật Pagination UI
    const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
    pageIndicator.innerText = `Trang ${currentPage} / ${totalPages}`;

    btnPrev.disabled = currentPage === 1;
    btnNext.disabled = currentPage >= totalPages;
}

// --- Chức năng Tìm kiếm (onChange / input) ---
searchInput.addEventListener("input", function (e) {
    const keyword = e.target.value.toLowerCase();
    
    // Lọc dữ liệu từ mảng gốc
    filteredData = originalData.filter(product => 
        product.title.toLowerCase().includes(keyword)
    );
    
    currentPage = 1; // Reset về trang 1
    renderTable();
});

// Có thể bắt thêm onchange nếu người dùng paste chuột
searchInput.addEventListener("change", function (e) {
    const keyword = e.target.value.toLowerCase();
    filteredData = originalData.filter(product => 
        product.title.toLowerCase().includes(keyword)
    );
    currentPage = 1;
    renderTable();
});

// --- Lắng nghe thay đổi Số lượng phần tử mỗi trang ---
pageSizeSelect.addEventListener("change", function (e) {
    pageSize = parseInt(e.target.value);
    currentPage = 1; // Trở lại trang 1
    renderTable();
});

// --- Điều hướng phân trang (Next/Prev) ---
function navigatePage(direction) {
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const newPage = currentPage + direction;

    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderTable();
    }
}

// --- Sắp xếp Dữ liệu (Sort) ---
function sortData(key, order) {
    filteredData.sort((a, b) => {
        if (key === 'price') {
            return order === 'asc' ? a.price - b.price : b.price - a.price;
        } else if (key === 'title') {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            if (titleA < titleB) return order === 'asc' ? -1 : 1;
            if (titleA > titleB) return order === 'asc' ? 1 : -1;
            return 0;
        }
    });

    currentPage = 1; // Về lại trang 1 sau khi sort
    renderTable();
}
