let plyr;

async function displayHymns() {
  const hymns = await fetchHymns();
  const sortedHymns = hymns.sort((a, b) => a.title.localeCompare(b.title));

  const list = document.createElement("ul");
  sortedHymns.forEach((hymn) => {
    const item = document.createElement("li");
    item.innerHTML = `<a href="#" class="hymn-title" onclick="searchHymns(${hymn.number})">${hymn.title} - ${hymn.number}</a>`;
    list.appendChild(item);
  });

  document.getElementById("hymn-list").appendChild(list);

  // Initialize the player
  plyr = new Plyr("#player", {
    controls: ["play", "progress", "current-time", "mute", "volume", "restart"],
  });
}

async function searchHymns(number) {
  const player = document.getElementById("player");
  const audioSource = document.getElementById("audioSource");
  const hymns = await fetchHymns();

  let hymn;
  if (number && number >= 1 && number <= 650) {
    hymn = hymns.find((h) => h.number == number);
  } else {
    const searchInput = document.getElementById("search-input");
    if (searchInput.value >= 1 && searchInput.value <= 650) {
      hymn = hymns.find((h) => h.number == searchInput.value);
    } else {
      searchInput.value = "";
      return;
    }
  }

  if (!hymn) {
    return;
  }

  const hymnContainer = document.getElementById("hymn-container");
  hymnContainer.innerHTML = "";

  const hymnDiv = document.createElement("div");
  hymnDiv.classList.add("hymn");

  const title = document.createElement("h2");
  title.innerText = `${hymn.number} - ${hymn.title}`;
  hymnDiv.appendChild(title);

  const chapter = document.createElement("p");
  chapter.innerText = hymn.chapter;
  chapter.classList.add("chapter");
  hymnDiv.appendChild(chapter);

  const melody = document.createElement("p");
  melody.innerText = `${hymn.melody} - ${hymn.sameAs}`;
  melody.classList.add("subtext");
  hymnDiv.appendChild(melody);

  const verse = document.createElement("p");
  const modifiedVerse = hymn.verse.replace(/\n/g, "<br>");
  verse.innerHTML = modifiedVerse;
  verse.classList.add("verse");
  hymnDiv.appendChild(verse);

  hymnContainer.appendChild(hymnDiv);

  audioSource.src = `data/Melodi/${hymn.melody}.mp3`;
  player.load();
}

async function fetchHymns() {
  try {
    const response = await fetch("data/hymns.json");
    const hymnData = await response.json();
    return hymnData;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Nullstill input box når salme valgt fra liste
const input = document.querySelector("#search-query");
const hymnList = document.querySelector("#hymn-list");

hymnList.addEventListener("click", function () {
  input.value = "";
  filterHymns();
});

async function filterHymns() {
  const searchQuery = document
    .getElementById("search-query")
    .value.toLowerCase()
    .replace(/[^a-zæøå\s]/g, ""); // only use alphabet from the search query
  const hymns = await fetchHymns();
  const filteredHymns = hymns
    .filter((hymn) => {
      const title = hymn.title.toLowerCase().replace(/[^a-zæøå\s]/g, ""); // only use alphabet from the hymn title
      return title.includes(searchQuery);
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  const list = document.createElement("ul");
  filteredHymns.forEach((hymn) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <a href="#" class="hymn-title">
        ${hymn.title} - ${hymn.number}
      </a>
    `;
    item.addEventListener("click", () => {
      searchHymns(hymn.number);
      const hymnList = document.getElementById("hymn-list");
      hymnList.innerHTML = "";
      displayHymns();
    });
    list.appendChild(item);
  });

  const hymnList = document.getElementById("hymn-list");
  hymnList.innerHTML = "";
  hymnList.appendChild(list);
}
document.getElementById("search-query").addEventListener("input", filterHymns);

displayHymns();
