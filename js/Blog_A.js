const blogs = [
  {
    title: "Sustainable Farming Practices",
    image: "images/blog1.jpg",
    content: "Discover how eco-friendly farming methods can protect our planet while improving crop yields for future generations. Techniques like crop rotation, natural composting, and minimal chemical usage ensure soil fertility and biodiversity."
  },
  {
    title: "The Future of Organic Agriculture",
    image: "images/blog2.jpg",
    content: "Organic farming is reshaping global agriculture by emphasizing soil health, biodiversity, and chemical-free produce. With growing consumer awareness, organic practices are creating new market opportunities."
  },
  {
    title: "Smart Irrigation Systems",
    image: "images/blog3.jpg",
    content: "Explore how AI and IoT-driven irrigation technologies conserve water while ensuring optimal crop hydration. Smart irrigation empowers farmers to manage resources effectively."
  },
  {
    title: "Seed Selection for High Yield",
    image: "images/blog4.jpg",
    content: "Choosing the right seeds helps farmers boost productivity, resist pests, and adapt to changing climate conditions. Modern research focuses on developing resilient seed varieties."
  },
  {
    title: "Farm-to-Table Revolution",
    image: "images/blog5.jpg",
    content: "Connecting farmers directly with consumers ensures transparency, freshness, and fair pricing. The farm-to-table model supports sustainable food systems."
  },
  {
    title: "Agricultural Machinery Evolution",
    image: "images/blog6.jpg",
    content: "From autonomous tractors to drone surveillance, modern machines are transforming agriculture. Advanced machinery enables precision farming and better yields."
  }
];

const container = document.getElementById('blog-container');

blogs.forEach((blog, index) => {
  const card = document.createElement('article');
  card.className = 'blog-card';
  
  if(index % 2 !== 0) card.classList.add('alt');

  card.innerHTML = `
    <div class="blog-image">
      <img src="${blog.image}" alt="${blog.title}">
    </div>
    <div class="blog-content">
      <h3>${blog.title}</h3>
      <p>${blog.content}</p>
    </div>
  `;

  container.appendChild(card);
});
