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
    const animeCard = document.createElement("div");
    animeCard.classList.add("anime-card");

    const animeImage = document.createElement("img");
    animeImage.src = anime.attributes.posterImage?.small || "";
    animeImage.alt = anime.attributes.canonicalTitle;
    const animeRating = document.createElement("p");
    animeRating.textContent = "Rating: " + (anime.attributes.averageRating || "Not available");
    const animeDescription = document.createElement("p");
    animeDescription.textContent = anime.attributes.synopsis || "No description available.";
    animeImage.loading = "eager";
    animeImage.onerror = function () {
        this.style.display = "none";
    }

    const animeTitle = document.createElement("h3");
    animeTitle.textContent = anime.attributes.canonicalTitle;

    animeCard.appendChild(animeImage);
    animeCard.appendChild(animeTitle);
    animeCard.appendChild(animeRating);
    animeCard.appendChild(animeDescription);
    animeList.appendChild(animeCard);
});
    } catch (error) {
        animeList.textContent =
            "Something went wrong. Please try again.";
        console.error(error);
    }
}
const suggestionForm = document.getElementById("suggestion-form");
const suggestionName = document.getElementById("suggestion-name");
const suggestionMessage = document.getElementById("suggestion-message");

suggestionForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    const animeName = suggestionName.value.trim();
    if (animeName === "") {
        suggestionMessage.textContent = "Please enter an anime name.";
        return;
    }
    suggestionMessage.textContent = "Sending suggestion...";
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                anime: animeName
            })
        });
        if (!response.ok) {
            throw new Error("Could not send suggestion.");
        }
        const result = await response.json();
        suggestionMessage.textContent =
            "Suggestion sent successfully! ID: " + result.id;
        suggestionForm.reset();
    } catch (error) {
        suggestionMessage.textContent =
            "Could not send your suggestion. Please try again.";
        console.error(error);
    }
});

suggestionForm.addEventListener("input", function () {
    suggestionMessage.textContent = "";
});