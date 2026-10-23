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
    const animeData = {
        title: anime.attributes.canonicalTitle,
        image: anime.attributes.posterImage?.small || "",
        rating: anime.attributes.averageRating || "Not available",
        synopsis: anime.attributes.synopsis ||
            "No description available."
    };

    const animeCard = document.createElement("div");
    animeCard.classList.add("anime-card");

    const animeImage = document.createElement("img");
    animeImage.src = animeData.image;
    animeImage.alt = animeData.title;
    animeImage.loading = "eager";
    animeImage.onerror = function() {
        this.style.display = "none";
    };

    const animeTitle = document.createElement("h3");
    animeTitle.textContent = animeData.title;
    const animeRating = document.createElement("p");
    animeRating.textContent = "Rating: " + animeData.rating;
    const animeDescription = document.createElement("p");
    animeDescription.classList.add("anime-description");
    animeDescription.textContent = animeData.synopsis;

    animeCard.appendChild(animeImage);
    animeCard.appendChild(animeTitle);
    animeCard.appendChild(animeRating);
    animeCard.appendChild(animeDescription);

    if (animeData.synopsis.length > 180) {
        const readMoreButton = document.createElement("button");
        readMoreButton.textContent = "Read more";

        readMoreButton.addEventListener("click", function() {
            animeDescription.classList.toggle("expanded");
            if (animeDescription.classList.contains("expanded")) {
                readMoreButton.textContent = "Read less";
            } else {
                readMoreButton.textContent = "Read more";
            }
        });
        animeCard.appendChild(readMoreButton);
    }

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save Anime";
    saveButton.addEventListener("click", async function() {
        try {
            const response = await fetch(
                "http://localhost:3002/savedAnime",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(animeData)
                }
            );
            if (!response.ok) {
                throw new Error("Could not save anime.");
            }
            saveButton.textContent = "Saved!";
            saveButton.disabled = true;
            await loadSavedAnime();
        } catch (error) {
            alert("Could not save anime. Check JSON Server.");
            console.error(error);
        }
    });
    animeCard.appendChild(saveButton);
    animeList.appendChild(animeCard);
});
}catch (error) {
    animeList.textContent = "Something went wrong. Please try again."}
    console.error(error);
}

async function loadSavedAnime() {
    const savedAnimeList = document.getElementById("saved-anime-list");
    try {
        const response = await fetch(
            "http://localhost:3002/savedAnime"
        );
        if (!response.ok) {
            throw new Error("Could not load saved anime.");
        }
        const savedAnime = await response.json();
        savedAnimeList.textContent = "";
        if (savedAnime.length === 0) {
            savedAnimeList.textContent = "No saved anime yet.";
            return;
        }
        savedAnime.forEach(function(anime) {
            const card = document.createElement("div");
            card.classList.add("anime-card");
            const title = document.createElement("h3");
            title.textContent = anime.title;
            const rating = document.createElement("p");
            rating.textContent = "Rating: " + anime.rating;
            card.appendChild(title);
            card.appendChild(rating);
            savedAnimeList.appendChild(card);
        });
    } catch (error) {
        savedAnimeList.textContent =
            "Could not load saved anime. Check JSON Server.";
        console.error(error);
    }
}
loadSavedAnime();

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