const blogs = [
  {
    title: "Sustainable Farming Practices",
    image: "images/blog1.jpg",
    content: "Discover how eco-friendly farming methods can protect our planet while improving crop yields for future generations. Techniques like crop rotation, natural composting, and minimal chemical usage ensure soil fertility and biodiversity. Sustainable farming not only benefits the environment but also strengthens farmer livelihoods through efficient resource management."
  },
  {
    title: "The Future of Organic Agriculture",
    image: "images/blog2.jpg",
    content: "Organic farming is reshaping global agriculture by emphasizing soil health, biodiversity, and chemical-free produce. It promotes safer food, improves ecosystem balance, and reduces pollution. With growing consumer awareness, organic practices are creating new market opportunities for farmers and transforming agricultural supply chains worldwide."
  },
  {
    title: "Smart Irrigation Systems",
    image: "images/blog3.jpg",
    content: "Explore how AI and IoT-driven irrigation technologies conserve water while ensuring optimal crop hydration. Smart irrigation systems use soil moisture sensors and weather data to deliver precise water levels, preventing waste and reducing costs. These systems empower farmers to manage resources effectively even under unpredictable climate conditions."
  },
  {
    title: "Seed Selection for High Yield",
    image: "images/blog4.jpg",
    content: "Choosing the right seeds helps farmers boost productivity, resist pests, and adapt to changing climate conditions. High-quality hybrid seeds can increase yield potential and crop quality, ensuring a more reliable income for farmers. Modern agricultural research focuses on developing resilient seed varieties for global food security."
  },
  {
    title: "Farm-to-Table Revolution",
    image: "images/blog5.jpg",
    content: "Learn how connecting farmers directly with consumers ensures transparency, freshness, and fair pricing. The farm-to-table model reduces middlemen, cuts transportation costs, and promotes local produce consumption. It’s a movement that supports sustainable food systems and builds trust between growers and consumers."
  },
  {
    title: "Agricultural Machinery Evolution",
    image: "images/blog6.jpg",
    content: "From autonomous tractors to drone surveillance, modern machines are transforming how we cultivate and harvest crops. Advanced machinery improves productivity, reduces manual labor, and enables precision agriculture. As technology evolves, farmers can analyze soil data, monitor crops in real-time, and make informed decisions for better yields."
  }
];

const container = document.getElementById('blog-container');

blogs.forEach(blog => {
  const card = document.createElement('div');
  card.className = 'blog-card';
  
  card.innerHTML = `
    <img src="${blog.image}" alt="${blog.title}">
    <div class="blog-content">
      <h2>${blog.title}</h2>
      <p>${blog.content}</p>
    </div>
  `;
  
  container.appendChild(card);
});
