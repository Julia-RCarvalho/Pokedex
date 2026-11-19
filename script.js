"use strict";
;
const inputElement = document.getElementById("pokemonInput");
const searchButton = document.getElementById("searchBtn");
const cardContainer = document.getElementById("pokemonCard");
searchButton.addEventListener("click", async () => {
    const busca = inputElement.value.trim().toLowerCase();
    if (!busca) {
        cardContainer.innerHTML = '<p class="message error">Por favor, digite o nome de um Pokemon!</p>';
        return;
    }
    try {
        cardContainer.innerHTML = '<p class="message error">Buscando Pokemon...</p>';
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${busca}`);
        if (!resposta.ok) {
            throw new Error("Pokemon não encontrado!");
        }
        const data = await resposta.json();
        const tipo = data.types[0].type.name;
        cardContainer.innerHTML = `
        <div class="pokemon-card">
            <h2>${data.name}</h2>
            <img src="${data.sprites.front_default}" alt ="imagem do ${data.name}"/>
            <p><strong>Tipo:</strong> ${tipo}</p>
        </div>
        `;
    }
    catch (erro) {
        console.error("Erro na busca!", erro);
        cardContainer.innerHTML = `<p class="message error">Não encontramos o Pokemon</>`;
    }
});
