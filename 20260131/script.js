// 1. Khai báo biến toàn cục để lưu trạng thái
let originalData = []; // Dữ liệu gốc từ API
let currentData = []; // Dữ liệu đang hiển thị (đã filter/sort)
let currentPage = 1;
let pageSize = 5; // Mặc định 5 phần tử/trang

// 2. Hàm lấy dữ liệu (Hàm getall của dashboard)
async function getAllProducts() {
  try {
    const response = await fetch("https://api.escuelajs.co/api/v1/products");
    originalData = await response.json();
    currentData = [...originalData]; // Copy dữ liệu để thao tác
    renderTable();
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
  }
}

// 3. Hàm hiển thị dữ liệu ra bảng (Render)
function renderTable() {
  const tableBody = document.getElementById("productTableBody");
  tableBody.innerHTML = ""; // Xóa dữ liệu cũ

  // Tính toán phân trang
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageData = currentData.slice(startIndex, endIndex);

  // Duyệt qua dữ liệu và tạo dòng HTML
  pageData.forEach((product) => {
    // Xử lý hiển thị toàn bộ hình ảnh
    let imagesHtml = '<div class="product-images">';
    if (product.images && product.images.length > 0) {
      product.images.forEach((imgUrl) => {
        // Làm sạch URL hình ảnh (API này đôi khi trả về chuỗi JSON stringify lỗi)
        let cleanUrl = imgUrl.replace(/[\[\]"]/g, "");
        imagesHtml += `<img src="${cleanUrl}" class="product-img" alt="img">`;
      });
    }
    imagesHtml += "</div>";

    const row = `
            <tr>
                <td>${product.id}</td>
                <td>${product.title}</td>
                <td>$${product.price}</td>
                <td>${imagesHtml}</td>
            </tr>
        `;
    tableBody.innerHTML += row;
  });

  // Cập nhật thông tin trang
  document.getElementById("pageInfo").innerText =
    `Trang ${currentPage} / ${Math.ceil(currentData.length / pageSize)}`;

  // Ẩn hiện nút phân trang nếu cần
  document.getElementById("btnPrev").disabled = currentPage === 1;
  document.getElementById("btnNext").disabled =
    currentPage >= Math.ceil(currentData.length / pageSize);
}

// 4. Chức năng Tìm kiếm (theo Title)
document.getElementById("searchInput").addEventListener("input", function (e) {
  const keyword = e.target.value.toLowerCase();

  // Lọc dữ liệu từ bản gốc
  currentData = originalData.filter((product) =>
    product.title.toLowerCase().includes(keyword),
  );

  currentPage = 1; // Reset về trang 1 khi tìm kiếm
  renderTable();
});

// 5. Chức năng Thay đổi số lượng hiển thị (Pagination size)
document
  .getElementById("pageSizeSelect")
  .addEventListener("change", function (e) {
    pageSize = parseInt(e.target.value);
    currentPage = 1; // Reset về trang 1
    renderTable();
  });

// 6. Chức năng Chuyển trang (Next/Prev)
function changePage(direction) {
  const totalPages = Math.ceil(currentData.length / pageSize);
  const newPage = currentPage + direction;

  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    renderTable();
  }
}

// 7. Chức năng Sắp xếp (Sort)
function sortData(key, order) {
  currentData.sort((a, b) => {
    if (key === "price") {
      return order === "asc" ? a.price - b.price : b.price - a.price;
    } else if (key === "title") {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA < titleB) return order === "asc" ? -1 : 1;
      if (titleA > titleB) return order === "asc" ? 1 : -1;
      return 0;
    }
  });
  renderTable();
}

// Khởi chạy ứng dụng
getAllProducts();
