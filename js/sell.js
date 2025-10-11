const productContainer = document.getElementById('productContainer');
const addProductForm = document.getElementById('addProductForm');
const newProductImagesContainer = document.getElementById('newProductImagesContainer');

// Modal elements
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeModalBtn = document.getElementById('closeModal');
const editImageContainer = document.getElementById('editImageContainer');
const addNewImageInput = document.getElementById('addNewImage');

const MAX_IMAGE_SIZE_KB = 200;
const MAX_IMAGES = 3;

let editIndex = null;
let tempImages = [];
let newProductTempImages = [null, null, null];

// Default products (with new Category field)
const defaultProducts = [
  {
    name: "Tomatoes",
    price: 40,
    quantity: 25,
    description: "Freshly picked organic tomatoes, perfect for salads and cooking.",
    availableQuantity: 20,
    freshness: "Excellent",
    category: "Vegetable",
    images: ["Images/tomato.jpg", "Images/tomato1.jpg", "Images/tomato2.jpg"]
  },
  {
    name: "Potatoes",
    price: 30,
    quantity: 50,
    description: "High-quality, starchy potatoes ideal for mashing or baking.",
    availableQuantity: 45,
    freshness: "Very Good",
    category: "Vegetable",
    images: ["Images/potato.jpg", "Images/potato1.jpg", "Images/potato2.jpg"]
  },
  {
    name: "Carrots",
    price: 45,
    quantity: 20,
    description: "Sweet and crunchy carrots, great for snacks or juice.",
    availableQuantity: 18,
    freshness: "Excellent",
    category: "Vegetable",
    images: ["Images/carrot.jpg", "Images/carrot1.jpg", "Images/carrot2.jpg"]
  }
];

let products = JSON.parse(localStorage.getItem('agrikartProducts')) || defaultProducts;
saveProducts();

function saveProducts() {
  localStorage.setItem('agrikartProducts', JSON.stringify(products));
}

// Convert file to base64 and validate size
function getBase64(file) {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_IMAGE_SIZE_KB * 1024) {
      reject(`Image size must be less than ${MAX_IMAGE_SIZE_KB}KB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Render all products
function renderProducts() {
  productContainer.innerHTML = '';
  products.forEach((product, index) => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    // Image slider
    const slider = document.createElement('div');
    slider.classList.add('image-slider');
    product.images.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      if (i === 0) img.classList.add('active');
      slider.appendChild(img);
    });

    const prev = document.createElement('button');
    prev.classList.add('slider-btn', 'prev');
    prev.textContent = '‹';
    const next = document.createElement('button');
    next.classList.add('slider-btn', 'next');
    next.textContent = '›';
    slider.append(prev, next);

    const imgs = slider.querySelectorAll('img');
    if (imgs.length === 0) {
      const placeholder = document.createElement('div');
      placeholder.style.height = '200px';
      placeholder.style.display = 'flex';
      placeholder.style.alignItems = 'center';
      placeholder.style.justifyContent = 'center';
      placeholder.textContent = 'No image';
      slider.appendChild(placeholder);
    }

    let currentIndex = 0;
    prev.onclick = () => {
      if (imgs.length === 0) return;
      imgs[currentIndex].classList.remove('active');
      currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
      imgs[currentIndex].classList.add('active');
    };
    next.onclick = () => {
      if (imgs.length === 0) return;
      imgs[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % imgs.length;
      imgs[currentIndex].classList.add('active');
    };

    // Info section including Category
    const info = document.createElement('div');
    info.classList.add('product-info');
    info.innerHTML = `
      <h3>${product.name}</h3>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Price:</strong> ₹${product.price} per kg</p>
      <p><strong>Quantity:</strong> ${product.quantity} kg (Total Weight)</p>
      <p><strong>Available:</strong> ${product.availableQuantity} kg</p>
      <p><strong>Freshness:</strong> ${product.freshness}</p>
      <p><strong>Description:</strong> ${product.description}</p>
    `;

    // Buttons
    const btns = document.createElement('div');
    btns.classList.add('edit-btns');

    const edit = document.createElement('button');
    edit.textContent = 'Edit';
    edit.classList.add('edit');
    edit.onclick = () => openEditModal(index);

    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.classList.add('delete');
    del.onclick = () => deleteProduct(index);

    btns.append(edit, del);
    card.append(slider, info, btns);
    productContainer.appendChild(card);
  });
}

// Open edit modal
function openEditModal(index) {
  editIndex = index;
  const p = products[index];
  tempImages = Array.isArray(p.images) ? [...p.images] : [];

  document.getElementById('editName').value = p.name;
  document.getElementById('editPrice').value = p.price;
  document.getElementById('editQuantity').value = p.quantity;
  document.getElementById('editDescription').value = p.description;
  document.getElementById('editAvailableQuantity').value = p.availableQuantity;
  document.getElementById('editFreshness').value = p.freshness;
  document.getElementById('editCategory').value = p.category;

  renderEditImages();
  editModal.classList.remove('hidden');
}

// Render images in edit modal
function renderEditImages() {
  editImageContainer.innerHTML = '';
  tempImages.forEach((src, i) => {
    const idx = i;
    const box = document.createElement('div');
    box.classList.add('edit-image-box');

    const imgEl = document.createElement('img');
    imgEl.src = src;
    imgEl.alt = `Product Image ${idx + 1}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';

    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (tempImages.length > 1) {
        tempImages.splice(idx, 1);
        renderEditImages();
      } else {
        alert("A product must have at least one image.");
      }
    });

    box.append(imgEl, deleteBtn);
    editImageContainer.appendChild(box);
  });
}

// Handle Add New Product images
newProductImagesContainer.querySelectorAll('.image-upload-box').forEach((box, index) => {
  const fileInput = box.querySelector('.hidden-file-input');
  const imgElement = box.querySelector('.uploaded-img');
  const plusIcon = box.querySelector('.plus-icon');
  const removeBtn = box.querySelector('.remove-new-image');

  box.addEventListener('click', () => {
    if (imgElement.classList.contains('hidden')) fileInput.click();
  });

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await getBase64(file);
        newProductTempImages[index] = base64;
        imgElement.src = base64;
        imgElement.classList.remove('hidden');
        plusIcon.classList.add('hidden');
        removeBtn.classList.remove('hidden');
      } catch (error) {
        alert(error);
        fileInput.value = '';
      }
    }
  });

  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    newProductTempImages[index] = null;
    imgElement.src = '';
    imgElement.classList.add('hidden');
    plusIcon.classList.remove('hidden');
    removeBtn.classList.add('hidden');
    fileInput.value = '';
  });
});

// Add new image in edit modal
addNewImageInput.addEventListener('click', (e) => {
  if (tempImages.length >= MAX_IMAGES) {
    e.preventDefault();
    alert(`You can only have up to ${MAX_IMAGES} images.`);
  }
});
addNewImageInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    if (tempImages.length < MAX_IMAGES) {
      try {
        const base64 = await getBase64(file);
        tempImages.push(base64);
        renderEditImages();
      } catch (error) {
        alert(error);
      }
    } else {
      alert(`You can only have up to ${MAX_IMAGES} images.`);
    }
  }
  addNewImageInput.value = '';
});

// Save edits
editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('editName').value.trim();
  const price = parseFloat(document.getElementById('editPrice').value);
  const quantity = parseInt(document.getElementById('editQuantity').value);
  const description = document.getElementById('editDescription').value.trim();
  const availableQuantity = parseInt(document.getElementById('editAvailableQuantity').value);
  const freshness = document.getElementById('editFreshness').value;
  const category = document.getElementById('editCategory').value;

  products[editIndex] = {
    ...products[editIndex],
    name,
    price,
    quantity,
    description,
    availableQuantity,
    freshness,
    category,
    images: [...tempImages]
  };
  saveProducts();
  renderProducts();
  editModal.classList.add('hidden');
});

closeModalBtn.addEventListener('click', () => {
  editModal.classList.add('hidden');
});

function deleteProduct(index) {
  if (confirm('Delete this product?')) {
    products.splice(index, 1);
    saveProducts();
    renderProducts();
  }
}

// Add new product
addProductForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('productName').value.trim();
  const price = parseFloat(document.getElementById('productPrice').value);
  const quantity = parseInt(document.getElementById('productQuantity').value);
  const description = document.getElementById('productDescription').value.trim();
  const availableQuantity = parseInt(document.getElementById('availableQuantity').value);
  const freshness = document.getElementById('freshness').value;
  const category = document.getElementById('productCategory').value;

  const uploadedImages = newProductTempImages.filter(img => img !== null);
  if (uploadedImages.length === 0) {
    alert("Please add at least one image for the product.");
    return;
  }

  const newProduct = {
    name,
    price,
    quantity,
    description,
    availableQuantity,
    freshness,
    category,
    images: uploadedImages
  };
  products.push(newProduct);
  saveProducts();
  renderProducts();
  addProductForm.reset();

  newProductTempImages = [null, null, null];
  newProductImagesContainer.querySelectorAll('.image-upload-box').forEach(box => {
    box.querySelector('.uploaded-img').classList.add('hidden');
    box.querySelector('.uploaded-img').src = '';
    box.querySelector('.plus-icon').classList.remove('hidden');
    box.querySelector('.remove-new-image').classList.add('hidden');
    box.querySelector('.hidden-file-input').value = '';
  });
});

renderProducts();

// Back to profile
document.getElementById('backToProfile').addEventListener('click', () => {
  window.location.href = 'profile.html';
});
