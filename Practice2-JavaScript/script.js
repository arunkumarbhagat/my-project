// Products with categories
const products = [
  { name: "T-Shirt", category: "Clothing" },
  { name: "Jeans", category: "Clothing" },
  { name: "Headphones", category: "Electronics" },
  { name: "Smartphone", category: "Electronics" },
  { name: "Novel", category: "Books" },
  { name: "Cookbook", category: "Books" }
];

const categorySelect = document.getElementById("category");
const productList = document.getElementById("product-list");

// Function to display products
function displayProducts(filter) {
  productList.innerHTML = ""; // clear previous items
  const filtered = filter === "All" 
    ? products 
    : products.filter(p => p.category === filter);

  filtered.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.textContent = product.name;
    productList.appendChild(div);
  });
}

// Event listener for dropdown
categorySelect.addEventListener("change", () => {
  displayProducts(categorySelect.value);
});

// Initial load
displayProducts("All");
