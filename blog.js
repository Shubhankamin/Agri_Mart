const blogs = {
  featured: {
    title: "How to Make Extra Money from Your Farm",
    date: "8/10/2025 07:52 AM",
    image: "Images/blog1.jpg",
    description:
      "Discover how farmers can boost income by selling surplus produce online and adopting modern marketing strategies.",
  },
  sidebar: [
    {
      title: "7 Big Things a Start-up Must Have to Succeed",
      date: "13/08/2025 07:52 AM",
      image: "Images/blog2.jpg",
      description:
        "Key steps to launch a successful agri-startup and make a lasting impact in the agricultural sector.",
    },
    {
      title: "9 Steps to Starting an Agribusiness",
      date: "18/01/2025 07:52 AM",
      image: "Images/blog3.jpg",
      description:
        "A practical guide to starting your own agribusiness and connecting directly with consumers.",
    },
    {
      title: "10 Rules to Build a Sustainable Future",
      date: "28/12/2024 07:52 AM",
      image: "Images/blog4.jpg",
      description:
        "Learn how eco-friendly farming practices can transform the agricultural industry for good.",
    },
  ],
};

const container = document.getElementById("blog-container");

container.innerHTML = `
  <div class="featured">
    <img src="${blogs.featured.image}" alt="Featured Blog">
    <div class="featured-content">
      <h2>${blogs.featured.title}</h2>
      <p class="meta">🕒 ${blogs.featured.date}</p>
      <p>${blogs.featured.description}</p>
      <a href="#" class="read-more">Read More →</a>
    </div>
  </div>

  <div class="sidebar">
    ${blogs.sidebar
      .map(
        (item) => `
      <div class="sidebar-item">
        <img src="${item.image}" alt="${item.title}">
        <div class="sidebar-text">
          <h3>${item.title}</h3>
          <p class="meta">🕒 ${item.date}</p>
          <p>${item.description}</p>
          <a href="#" class="read-more">Read More →</a>
        </div>
      </div>
    `
      )
      .join("")}
  </div>
`;
