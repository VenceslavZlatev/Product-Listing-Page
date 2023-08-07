const productsPerPage = 6;
let currentPage = 1;
let filteredProducts = [];
let sortedProducts = [];
let productData = [];
let totalProductsDisplayed = 0;
const defaultSortOption = 'name-asc';

async function fetchProductData() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

function displayProducts(products) {
  const productGrid = document.getElementById('product-list');
  productGrid.innerHTML = ''; // Clear existing products

  products.forEach((product) => {
    const productCard = createProductCard(product);
    productGrid.appendChild(productCard);
  });
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.classList.add('product-card');

  const image = document.createElement('img');
  image.classList.add('product-image');
  image.src = product.image;
  card.appendChild(image);

  const name = document.createElement('h3');
  name.textContent = product.name;
  card.appendChild(name);

  const description = document.createElement('p');
  description.textContent = product.description;
  card.appendChild(description);

  const price = document.createElement('p');
  price.textContent = `$${product.price.toFixed(2)}`;
  card.appendChild(price);

  const rating = document.createElement('p');
  rating.textContent = `rating: ${product.rating.toFixed(2)}`;
  card.appendChild(rating);

  const addToCartBtn = document.createElement('button');
  addToCartBtn.textContent = 'Add to Cart';
  addToCartBtn.classList.add('add-to-cart-btn');
  card.appendChild(addToCartBtn);


  addToCartBtn.addEventListener('click', function () {
    alert(`${product.name} added to cart`);
  });

  return card;
}

function filterProducts(category, priceFilter, colorFilter) {
  filteredProducts = productData.filter(product => {
    const categoryMatch = product.category === category;
    const priceMatch = product.price <= priceFilter;
    const colorMatch = colorFilter === '' || product.color === colorFilter;
    return categoryMatch && priceMatch && colorMatch;
  });
  displayProducts(filteredProducts.slice(0, productsPerPage));
  updateProductCounter();
}

function appendProducts(products) {
  const productGrid = document.getElementById('product-list');

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const productCard = createProductCard(product);
    productGrid.appendChild(productCard);
  }
}

function sortProducts(option) {
  switch (option) {
    case 'name-asc':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'price-asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    default:
      break;
  }
}

function renderProductsBatch() {
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToRender = filteredProducts.slice(startIndex, endIndex);

  const productGrid = document.getElementById('product-list');

  productsToRender.forEach((product) => {
    const productCard = createProductCard(product);
    productGrid.appendChild(productCard);
  });
}

function updateProductCounter() {
  const productCounter = document.getElementById('product-counter');
  const count = filteredProducts.length;
  productCounter.textContent = `${count} ${count === 1 ? 'product' : 'products'}`;
}

document.getElementById('load-more-btn').addEventListener('click', function () {
  currentPage++;
  renderProductsBatch();

  if (currentPage * productsPerPage >= filteredProducts.length) {
    this.style.display = 'none';
  }
  updateProductCounter();
});

document.getElementById('sort-by').addEventListener('change', function () {
  const selectedOption = this.value;
  sortProducts(selectedOption);
  currentPage = 1;
  const productGrid = document.getElementById('product-list');
  productGrid.innerHTML = '';
  renderProductsBatch();
  const loadMoreBtn = document.getElementById('load-more-btn');
  loadMoreBtn.style.display = 'inline-block';
});

// Event listener for category filter buttons
document.querySelectorAll('.category-filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const category = btn.getAttribute('data-category');
    document.getElementById('category-header').textContent = category;
    document.getElementById('load-more-btn').style.display = 'inline-block';
    currentPage = 1;
    filterProducts(category, 200, '');
  });
});

// Event listener for price and color filters
document.getElementById('price-filter').addEventListener('input', () => {
  const priceFilterValue = document.getElementById('price-filter').value;
  const priceValueDisplay = document.getElementById('price-display');
  priceValueDisplay.textContent = `$${priceFilterValue}`;
  const colorFilterValue = document.getElementById('color-filter').value;
  const category = document.getElementById('category-header').textContent;
  currentPage = 1;
  filterProducts(category, priceFilterValue, colorFilterValue);
  document.getElementById('load-more-btn').style.display = 'inline-block';
});

document.getElementById('color-filter').addEventListener('change', () => {
  const priceFilterValue = document.getElementById('price-filter').value;
  const colorFilterValue = document.getElementById('color-filter').value;

  const category = document.getElementById('category-header').textContent;
  currentPage = 1;
  filterProducts(category, priceFilterValue, colorFilterValue);
  document.getElementById('load-more-btn').style.display = 'inline-block';
});

//document.getElementById('load-more-btn').addEventListener('click', handleLoadMore);

function applyDefaultFilter() {
  const defaultCategory = 'watch';

  const categoryHeader = document.getElementById('category-header');
  categoryHeader.textContent = defaultCategory;


  const priceFilterValue = document.getElementById('price-filter').value;
  const colorFilterValue = document.getElementById('color-filter').value;
  const category = document.getElementById('category-header').textContent;
  filterProducts(category, priceFilterValue, colorFilterValue);

  currentPage = 1;
  //renderProductsBatch();
}


fetchProductData()
  .then(data => {
    productData = data;
    //filterProducts('watch', 200, '');
    applyDefaultFilter();
    updateProductCounter();
  });
