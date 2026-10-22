const searchForm = document.getElementById("search-form");
const animeSearch = document.getElementById("anime-search");
const animeList = document.getElementById("anime-list");

searchForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const animeName = animeSearch.value.trim();

    if (animeName === "") {
        alert("Please enter an anime name.");
        return;
    }

    searchAnime(animeName);
});

async function searchAnime(animeName) {
    animeList.textContent = "Loading anime...";
    try {
        const response = await fetch(
            `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(animeName)}&limit=10`
        );
        if (!response.ok) {
            throw new Error("Could not fetch anime.");
        }
        const result = await response.json();
        console.log(result);
        animeList.textContent = "";
        if (result.data.length === 0) {
            animeList.textContent =
                "No anime found. Try another name.";
            return;
        }
        
        result.data.forEach(function(anime) {
    // Create a card for each anime
    const animeCard = document.createElement("div");
    animeCard.classList.add("anime-card");

    // Create the anime poster
    const animeImage = document.createElement("img");
    animeImage.src = anime.attributes.posterImage?.small || "";
    animeImage.alt = anime.attributes.canonicalTitle;
    animeImage.loading = "eager";
    animeImage.onerror = function () {
        this.style.display = "none";
    }

    const animeTitle = document.createElement("h3");
    animeTitle.textContent = anime.attributes.canonicalTitle;

    animeCard.appendChild(animeImage);
    animeCard.appendChild(animeTitle);

    animeList.appendChild(animeCard);
});
    } catch (error) {
        animeList.textContent =
            "Something went wrong. Please try again.";
        console.error(error);
    }
}
