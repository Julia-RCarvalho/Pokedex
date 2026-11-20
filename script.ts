interface PokemonResponse {
    id: number;
    name: string;
    sprites: {
        front_default: string;
    };
    types: Array<{
        type: {
            name: string;
        };
    }>;
}

const inputElement = document.getElementById("pokemonInput") as HTMLInputElement;
const searchButton = document.getElementById("searchBtn") as HTMLButtonElement;
const cleanButton = document.getElementById("cleanBtn") as HTMLButtonElement;
const cardContainer = document.getElementById("cardContainer") as HTMLDivElement;
const screenMessage = document.getElementById("screenMessage") as HTMLDivElement;
const playMusicButton = document.getElementById("playMusicBtn") as HTMLDivElement | null;
const stopMusicButton = document.getElementById("stopMusicBtn") as HTMLDivElement | null;

const bgMusic = new Audio("ceruleancity.mp3");
bgMusic.loop = true;

function tocarMusica() {
    bgMusic.play().catch((erro) => {
        console.error("Erro ao reproduzir música:", erro);
    });
}

function pararMusica() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

function mostrarMensagem(texto: string, tipoClasse: "message" | "message error" = "message") {
    cardContainer.innerHTML = "";
    screenMessage.textContent = texto;
    screenMessage.className = tipoClasse;
}

function limparTela() {
    inputElement.value = "";
    cardContainer.innerHTML = "";
    screenMessage.textContent = "";
    screenMessage.className = "message";
    inputElement.focus();
}

async function buscarPokemon() {
    const busca = inputElement.value.trim().toLowerCase();

    if (!busca) {
        mostrarMensagem("Por favor, digite o nome de um Pokemon!", "message error");
        return;
    }

    try {
        mostrarMensagem("Buscando Pokemon...", "message");

        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${busca}`);

        if (!resposta.ok) {
            throw new Error("Pokemon não encontrado!");
        }

        const data: PokemonResponse = await resposta.json();
        const numeroFormatado = `#${String(data.id).padStart(3, "0")}`;

        // Gera uma badge para cada tipo do Pokémon (funciona para 1 ou 2 tipos)
        const tiposHtml = data.types
            .map((t) => `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`)
            .join("");

        screenMessage.textContent = "";
        screenMessage.className = "message";

        cardContainer.innerHTML = `
            <div class="pokemon-card">
                <span class="pokemon-number">${numeroFormatado}</span>
                <img src="${data.sprites.front_default}" alt="imagem do ${data.name}" />
                <div class="pokemon-info">
                    <h2>${data.name}</h2>
                    <div class="pokemon-types">${tiposHtml}</div>
                </div>
            </div>
        `;
    } catch (erro) {
        console.error("Erro na busca!", erro);
        mostrarMensagem("Não encontramos o Pokemon", "message error");
    }
}

searchButton.addEventListener("click", buscarPokemon);

inputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        buscarPokemon();
    }
});

cleanButton?.addEventListener("click", limparTela);
playMusicButton?.addEventListener("click", tocarMusica);
stopMusicButton?.addEventListener("click", pararMusica);

const volUpButton = document.getElementById("volUpBtn") as HTMLDivElement | null;
const volDownButton = document.getElementById("volDownBtn") as HTMLDivElement | null;

function aumentarVolume() {
    bgMusic.volume = Math.min(1, Number((bgMusic.volume + 0.1).toFixed(2)));
}

function diminuirVolume() {
    bgMusic.volume = Math.max(0, Number((bgMusic.volume - 0.1).toFixed(2)));
}

volUpButton?.addEventListener("click", aumentarVolume);
volDownButton?.addEventListener("click", diminuirVolume);