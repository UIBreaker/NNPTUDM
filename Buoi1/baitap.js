// --- Câu 1: Khai báo constructor function Product ---
function Product(id, name, price, quantity, category, isAvailable) {
  this.id = id;
  this.name = name;
  this.price = price;
  this.quantity = quantity;
  this.category = category;
  this.isAvailable = isAvailable;
}

// --- Câu 2: Khởi tạo mảng products (ít nhất 6 SP, 2 danh mục) ---
const products = [
  new Product(1, "iPhone 15 Pro", 32000000, 10, "Phone", true),
  new Product(2, "Samsung S24 Ultra", 31000000, 5, "Phone", true),
  new Product(3, "Ốp lưng iPhone", 150000, 100, "Accessories", true),
  new Product(4, "Cáp sạc Type-C", 200000, 0, "Accessories", true), // Hết hàng
  new Product(5, "Laptop Dell XPS", 45000000, 2, "Laptop", false), // Ngừng bán
  new Product(6, "Chuột Logitech", 500000, 15, "Accessories", true),
];

console.log("Danh sách sản phẩm ban đầu:", products);
// --- Câu 3: Tạo mảng mới chỉ chứa name và price ---
// Sử dụng map để chuyển đổi từng phần tử
const nameAndPrice = products.map((product) => {
  return { name: product.name, price: product.price };
});
console.log("Câu 3 - Mảng name và price:", nameAndPrice);

// --- Câu 4: Lọc các sản phẩm còn hàng (quantity > 0) ---
// Sử dụng filter để lọc
const inStockProducts = products.filter((product) => product.quantity > 0);
console.log("Câu 4 - Sản phẩm còn hàng:", inStockProducts);

// --- Câu 5: Kiểm tra có ít nhất 1 SP giá trên 30.000.000 hay không ---
// Sử dụng some (trả về true nếu có ít nhất 1 phần tử thỏa mãn)
const hasExpensiveProduct = products.some(
  (product) => product.price > 30000000
);
console.log(`Câu 5 - Có sản phẩm giá > 30tr không? -> ${hasExpensiveProduct}`);

// --- Câu 6: Kiểm tra tất cả SP danh mục "Accessories" có đang bán (isAvailable = true) hay không ---
// Bước 1: Lọc ra Accessories -> Bước 2: Dùng every để kiểm tra tất cả
const accessories = products.filter((p) => p.category === "Accessories");
const areAllAccessoriesAvailable = accessories.every(
  (p) => p.isAvailable === true
);
console.log(
  `Câu 6 - Tất cả phụ kiện đang được bán? -> ${areAllAccessoriesAvailable}`
);

// --- Câu 7: Tính tổng giá trị kho hàng (price * quantity) ---
// Sử dụng reduce để tính tổng tích lũy
const totalInventoryValue = products.reduce((total, product) => {
  return total + product.price * product.quantity;
}, 0);
console.log(
  "Câu 7 - Tổng giá trị kho hàng:",
  totalInventoryValue.toLocaleString() + " VNĐ"
);
// --- Câu 8: Dùng for...of duyệt mảng và in ra thông tin ---
console.log("--- Câu 8: Kết quả for...of ---");
for (const product of products) {
  console.log(`${product.name} - ${product.category} - ${product.isAvailable}`);
}

// --- Câu 9: Dùng for...in để in tên thuộc tính và giá trị ---
// for...in thường dùng để duyệt qua các keys của 1 đối tượng cụ thể.
// Ví dụ lấy sản phẩm đầu tiên để demo:
console.log("--- Câu 9: Kết quả for...in (cho sản phẩm đầu tiên) ---");
const firstProduct = products[0];

for (const key in firstProduct) {
  console.log(`Thuộc tính: ${key} | Giá trị: ${firstProduct[key]}`);
}

// --- Câu 10: Lấy danh sách tên các SP đang bán (isAvailable) VÀ còn hàng (quantity > 0) ---
// Kết hợp filter và map
const activeProductNames = products
  .filter((product) => product.isAvailable === true && product.quantity > 0)
  .map((product) => product.name);

console.log("Câu 10 - Tên SP đang bán và còn hàng:", activeProductNames);
