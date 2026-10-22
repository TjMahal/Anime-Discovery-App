
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
            "https://anipub.org/api/search/" 
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
            const animeTitle = document.createElement("p");
            animeTitle.textContent = anime.title;
            animeList.appendChild(animeTitle);
        });
    } catch (error) {
        animeList.textContent =
            "Something went wrong. Please try again.";
        console.error(error);
    }
}
