const $ = document
let pageNumber = 1
let maxPages;
let createdCharectersElements;
let charactersDiv = $.querySelector(".charactersDiv")
let listOfBookmarkedCharecters = JSON.parse(localStorage.getItem('bookmarkedCharacters')) || [];
let hoverArea = document.querySelector('.gameDivPartHoverArea');
let cards = document.querySelectorAll('.mortycard1, .rickcard1, .mortycard2, .rickcard2, .mortycard3, .rickcard3');



async function loadCharacters() {
    let apiLink = "https://rickandmortyapi.com/api/character/?page=" + pageNumber

    let request = await fetch(apiLink)
        .then(response => response.json())
        .then(data => {
            maxPages = data.info.pages
            createCharacters(data)
        })
}

async function createCharacters(data) {
    createdCharectersElements = ""
    data.results.forEach(function (characterData) {
        createdCharectersElements += `
        <div class="charactersDivCardDiv">
            <div style="background-image: url('${characterData.image}')" class="charactersDivCardDivImage"></div>
            <div class="charactersDivaddFav addFav"></div>
            <span class="charactersDivCardDivName charactersDivCardDivInfo">${characterData.name}</span>
            <span class="charactersDivCardDivStatus charactersDivCardDivInfo">${characterData.status}</span>
            <span class="charactersDivCardDivGender charactersDivCardDivInfo">${characterData.gender}</span>
            <span class="charactersDivCardDivSpecies charactersDivCardDivInfo">${characterData.species}</span>
        </div>
        `
    })
    charactersDiv.innerHTML += createdCharectersElements
    if (pageNumber < maxPages) {
        ++pageNumber
    }
    addToFavorites()
    updateFavorites()

}

function addToFavorites() {
    let charactersDivaddFav = document.querySelectorAll(".charactersDivaddFav");
    charactersDivaddFav.forEach(function (icon) {
        icon.addEventListener("click", function () {
            let bookmarkedCartName = icon.parentElement.children[2].innerHTML;

            if (listOfBookmarkedCharecters.includes(bookmarkedCartName)) {
                let index = listOfBookmarkedCharecters.indexOf(bookmarkedCartName);
                listOfBookmarkedCharecters.splice(index, 1);

                localStorage.setItem('bookmarkedCharacters', JSON.stringify(listOfBookmarkedCharecters));

                updateFavorites();
            } else {
                listOfBookmarkedCharecters.push(bookmarkedCartName);

                localStorage.setItem('bookmarkedCharacters', JSON.stringify(listOfBookmarkedCharecters));

                updateFavorites();
            }
        });
    });
}

function updateFavorites() {
    let charactersDivCardDivs = document.querySelectorAll('.charactersDivCardDiv');

    charactersDivCardDivs.forEach(function (box) {
        let nameElement = box.querySelector('.charactersDivCardDivName');
        let name = nameElement.innerHTML;

        let addFavElement = box.querySelector('.charactersDivaddFav');

        if (listOfBookmarkedCharecters.includes(name)) {
            addFavElement.classList.remove('addFav');
            addFavElement.classList.add('removeFav');
        } else {
            addFavElement.classList.remove('removeFav');
            addFavElement.classList.add('addFav');
        }
    });
}



loadCharacters()

window.addEventListener('load', function () {
    listOfBookmarkedCharecters = JSON.parse(localStorage.getItem('bookmarkedCharacters')) || [];
});

window.addEventListener('scroll', function () {
    let scrollProgress = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;

    if (scrollProgress === 1) {
        loadCharacters();
    }
});

hoverArea.addEventListener('mouseover', function () {
    cards.forEach(function (card) {
        const className = card.classList[1];
        card.classList.add(className + 'OnHover');
    });
});

hoverArea.addEventListener('mouseout', function () {
    cards.forEach(function (card) {
        const className = card.classList[1];
        card.classList.remove(className + 'OnHover');
    });
});