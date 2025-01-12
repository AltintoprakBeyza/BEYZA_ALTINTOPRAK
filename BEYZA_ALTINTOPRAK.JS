(() => {
  const init = () => {
    self.buildHTML();
    self.buildCSS();
    self.setEvents();
  };

  const self = {
    buildHTML: () => {
      const html = `
        <div class="out-container">
          <div class="carousel-container">
            <h3 class="carousel-title">You Might Also Like</h3>
            <div class="carousel-track"></div>
            <button class="carousel-button prev-button">❮</button>
            <button class="carousel-button next-button">❯</button>
          </div>
        </div>
      `;

      $(".product-detail").after(html);
    },

    buildCSS: () => {
      const css = `
        .out-container {
            background: #faf9f7;
            width: 100%;
            padding: 2rem 0;
        }

        .carousel-container {
            width: 100%;
            max-width: 1356px;
            margin: 2rem auto;
            position: relative; 
            padding: 0 3rem;
        }
        
        .carousel-title {
            font-size: 3rem;
            font-weight: lighter;
            color: #29323b;
        }

        .carousel-track {
            display: flex;
            gap: 1rem;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            padding: 1rem;
        }

        .carousel-track::-webkit-scrollbar {
            display: none;
        }

        .carousel-item {
            flex: 0 0 calc((100% / 6.5) - 6px);
            scroll-snap-align: start;
            position: relative;
        }

        .card {
            background: #fff;
            overflow: hidden;
            height: 100%;
            color: #333;
        }

        .card-favorite {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 2;
        }

        .favorite-btn {
            background: #fff;
            border: none;
            border-radius: 4px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,.1);
            font-size: 22px;
        }

        .favorite-btn.selected {
            color: blue;
        }

        .card-image {
            width: 100%;
            padding-top: 133%;
            position: relative;
            background: #f5f5f5;
        }

        .card-image img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .card-content {
            padding: .5rem 1rem 1rem;
        }

        .product-title {
            font-size: 14px;
            margin: 0 0 .5rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.4;
            color: #302e2b;
        }

        .product-price {
            font-size: 17px;
            font-weight: 700;
            margin: 0;
            margin-bottom: 2.5rem;
            color: #193db0;
        }

        .carousel-button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            color: #333;
            width: 40px;
            height: 40px;
            font-size: 20px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .prev-button {
            left: -1rem;
        }

        .next-button {
            right: -1rem;
        }

        @media (max-width: 1200px) {
            .carousel-item {
                flex: 0 0 calc(100% / 5.5);
            }
        }

        @media (max-width: 992px) {
            .carousel-item {
                flex: 0 0 calc(100% / 4.5);
            }
        }

        @media (max-width: 768px) {
            .carousel-item {
                flex: 0 0 calc(100% / 3.5);
            }
        }

        @media (max-width: 576px) {
            .carousel-item {
                flex: 0 0 calc(100% / 2.5);
            }
        }

        @media (max-width: 480px) {
            .carousel-item {
                flex: 0 0 calc(100% / 1.5);
            }
        }

        @media (max-width: 400px) {
            .carousel-container {
                width: 100%;
                margin: 0;
                padding: 0;
            }
            .carousel-track {
                padding: 1rem 0;
                gap: 0;
            }
            .carousel-item {
                flex: 0 0 100%;
            }
        }

        @media (max-width: 1024px) {
            .carousel-button {
                display: none;
            }
            .carousel-container {
                padding: 10px;
            }
        }
      `;

      $("<style>").addClass("carousel-style").html(css).appendTo("head");
    },

    setEvents: () => {
      const loadProducts = async () => {
        let products = localStorage.getItem("products");
        if (products) return JSON.parse(products);

        const res = await fetch(
          "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json"
        );
        products = await res.json();
        localStorage.setItem("products", JSON.stringify(products));
        return products;
      };

      const renderProducts = async () => {
        const products = await loadProducts();
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        const track = $(".carousel-track");

        track.html(
          products
            .map(
              (product, index) => `
              <div class="carousel-item">
                <div class="card">
                  <div class="card-favorite">
                    <button class="favorite-btn${
                      favorites.includes(String(index)) ? " selected" : ""
                    }" data-index="${index}">
                      ${favorites.includes(String(index)) ? "♥" : "♡"}
                    </button>
                  </div>
                  <a href="${
                    product.url
                  }" target="_blank" style="text-decoration:none;color:inherit">
                    <div class="card-image">
                      <img src="${product.img}" alt="${product.name}">
                    </div>
                    <div class="card-content">
                      <p class="product-title">${product.name}</p>
                      <p class="product-price">${product.price} TRY</p>
                    </div>
                  </a>
                </div>
              </div>
            `
            )
            .join("")
        );
      };

      const handleFavoriteClick = (e) => {
        if (!e.target.classList.contains("favorite-btn")) return;

        const index = e.target.dataset.index;
        let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        const isFavorite = favorites.includes(index);

        if (isFavorite) {
          favorites = favorites.filter(
            (favoriteIndex) => favoriteIndex !== index
          );
          e.target.classList.remove("selected");
          e.target.textContent = "♡";
        } else {
          favorites.push(index);
          e.target.classList.add("selected");
          e.target.textContent = "♥";
        }

        localStorage.setItem("favorites", JSON.stringify(favorites));
      };

      const scrollCarousel = (direction) => {
        const track = $(".carousel-track");
        const card = track.find(".carousel-item").first();
        const width = card.outerWidth() + 16;
        track.scrollLeft(track.scrollLeft() + width * direction);
      };

      const ARROW = {
        PREV: -1,
        NEXT: 1,
      };

      $(".carousel-container").on("click", handleFavoriteClick);
      $(".prev-button").on("click", () => scrollCarousel(ARROW.PREV));
      $(".next-button").on("click", () => scrollCarousel(ARROW.NEXT));

      renderProducts();
    },
  };

  init();
})();
