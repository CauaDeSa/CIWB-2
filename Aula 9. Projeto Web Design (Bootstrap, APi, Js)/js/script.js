var element = document.querySelector("html");
var setToDark = document.querySelector("#setColor");
var setNav = document.querySelectorAll('.nav-link');
var changePage = document.querySelectorAll('.pageSetter');
var cardSpace = document.querySelector('.row');
var searchLabel = document.querySelector('.cabecalho-pesquisa');
var tituloPagina = document.querySelector('.pageTitle');
var cardsQuantity = 0;
var isDark = true;

find();
tituloPagina.textContent = 'Mehores avaliados';

setToDark.addEventListener("click", () => {
    if (!isDark) {
        element.setAttribute('data-bs-theme', 'dark');
        document.querySelector('#Header').setAttribute('class', 'white');
        setNav.forEach(element => {
            element.setAttribute('id', 'navButton');
        });
        isDark = true;
    }

    else {
        element.setAttribute('data-bs-theme', 'light');
        document.querySelector('#Header').setAttribute('class', 'black');
        setNav.forEach(element => {
            element.setAttribute('id', 'navButton2');
        });
        isDark = false;
    }
});

searchLabel.addEventListener("keydown", function (e) {

    if (e.code === "Enter") {

        clear();

        let word = searchLabel.value;
        tituloPagina.textContent = 'Voce pesquisou por: "' + word + '"';

        searchLabel.value = '';

        find('https://api.themoviedb.org/3/search/multi?query=' + word + '&include_adult=false&language=pt-BR&page=1');
    }
})

changePage.forEach(function (botao) {

    botao.addEventListener('click', () => {
        if (botao.textContent == 'Lançamentos') {
            clear();
            tituloPagina.textContent = 'Lançamentos!';
            find('https://api.themoviedb.org/3/movie/now_playing?language=pt-BR&page=1', 1);
        }
        else if (botao.textContent == 'Filmes') {
            clear();
            tituloPagina.textContent = 'Melhor avaliados do momento';
            find('https://api.themoviedb.org/3/movie/upcoming?language=pt-BR&page=1', 2);
        }
        else {
            clear();
            tituloPagina.textContent = 'Melhor avaliadas do momento';
            find("https://api.themoviedb.org/3/tv/top_rated?language=pt-BR&page=1", 3);
        }
    })
});

async function find(url = 'https://api.themoviedb.org/3/movie/top_rated?language=pt-BR&page=1', key) {

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MGQ5ZGFjYzAwNjA5NmM0YzcwYWM0NGViNmUxM2VmNSIsInN1YiI6IjY1MWYzY2Q1OTY3Y2M3MzQyN2YzZjM4MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ImorXfIr9sQNG0vBOP5slVmaT52N8kKl1zmfh5CnOUg'
        }
    };

    let dataBlock = await fetch(url, options)
    const data = await dataBlock.json();
    const ore = await data.results;

    ore.forEach(element => {
        var card = document.createElement('div');
        var backgroundImage = document.createElement('img');
        var title = document.createElement('p');

        if (element.poster_path != null) {
            backgroundImage.setAttribute('src', 'https://image.tmdb.org/t/p/original' + element.poster_path);
            backgroundImage.setAttribute('class', 'img-card');

            card.setAttribute('class', 'card');
            card.appendChild(backgroundImage);
            card.appendChild(title);
            cardSpace.appendChild(card);
            card.setAttribute('id', element.id);
            cardsQuantity++;
        }
    })

    var description = document.querySelectorAll('.card');
    var count = 0;

    description.forEach(function descricao(selecionado) {
        selecionado.addEventListener('click', () => {
            clear();
            if (key == 3) {
                openList('https://api.themoviedb.org/3/tv/' + selecionado.id + '?language=pt-BR');    
            }
            else{
                openList('https://api.themoviedb.org/3/movie/' + selecionado.id + '?language=pt-BR');
            }
        })
    });
}

function clear() {
    if (cardsQuantity > 0) {

        document.querySelector('.row').innerHTML = '';
    }
}

async function openList(url) {

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MGQ5ZGFjYzAwNjA5NmM0YzcwYWM0NGViNmUxM2VmNSIsInN1YiI6IjY1MWYzY2Q1OTY3Y2M3MzQyN2YzZjM4MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ImorXfIr9sQNG0vBOP5slVmaT52N8kKl1zmfh5CnOUg'
        }
    };

    fetch(url, options)
    .then(response => response.json())
    .then(response => {
        let firstDiv = document.createElement('div');
        firstDiv.setAttribute('class', 'flex-row');

        cardSpace.appendChild(firstDiv);

        let movieImg = document.createElement('img');
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/original' + response.poster_path);
        
        firstDiv.appendChild(movieImg);

        let secondDiv = document.createElement('div');
        secondDiv.setAttribute('class', 'text-overview');
        
        firstDiv.appendChild(secondDiv);

        if (response.original_tittle != null) {
            tituloPagina.textContent = response.original_title;
        } else {
            tituloPagina.textContent = response.original_name;
        }

        let movieOverview = document.createElement('p');
        let vote = document.createElement('p');    
        let date = document.createElement('p');

        movieOverview.innerHTML = '<b> Visão geral: </b>';
        vote.innerHTML = '<b> Nota Média: </b>';
        date.innerHTML = '<b> Data de lançamento: </b>';

        if (response.overview != null) {
            movieOverview.innerHTML += response.overview;
        } else {
            movieOverview.innerHTML += 'Não disponível';
        }

        if (response.vote_average != null) {
            vote.innerHTML += response.vote_average;
        } else {
            vote.innerHTML += 'Não disponível';
        }

        
        if (response.release_date != null) {
            date.innerHTML += response.release_date;
        } else {
            date.innerHTML += 'Não disponível';
        }

        secondDiv.appendChild(movieOverview);
        secondDiv.appendChild(vote);
        secondDiv.appendChild(date);
    })
    .catch(err => console.error(err));
}