const gameSelect = document.getElementById('game-select');
const editionSelect = document.getElementById('edition-select');
const cardsGrid = document.querySelector('.cards-grid');
const modal = document.getElementById('card-modal');
const btnOpenModal = document.getElementById('btn-open-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancelModal = document.getElementById('btn-cancel-modal');
const cardForm = document.getElementById('card-form');

const imageUrlInput = document.getElementById('image_url');
const previewImage = document.getElementById('preview-image');

let currentCardId = null;
let allCards = [];
let currentFilter = 'all';
let selectedEditions = [];
let searchTerm = '';

// --- 0. PREVIEW DINÂMICO DA IMAGEM ---
if (imageUrlInput && previewImage) {
    imageUrlInput.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        previewImage.src = url !== '' ? url : 'https://placehold.co/300x420';
    });
}

// --- 1. LÓGICA DE EDIÇÕES (FETCH) ---
if (editionSelect) editionSelect.disabled = true;

if (gameSelect) {
    gameSelect.addEventListener('change', async (e) => {
        const game = e.target.value;

        editionSelect.innerHTML = '<option value="">Carregando...</option>';
        editionSelect.disabled = true;

        if (!game) {
            editionSelect.innerHTML = '<option value="">Selecione um jogo primeiro</option>';
            return;
        }

        try {
            const response = await fetch(`/api/editions.php?game=${game}`);
            const data = await response.json();

            editionSelect.innerHTML = '<option value="">Selecione uma edição *</option>';
            data.forEach(ed => {
                const option = document.createElement('option');
                option.value = ed.id;
                option.textContent = ed.name;
                editionSelect.appendChild(option);
            });

            editionSelect.disabled = false;
        } catch (error) {
            console.error("Erro ao buscar edições:", error);
            editionSelect.innerHTML = '<option value="">Erro ao carregar edições</option>';
        }
    });
}

// --- 2. LISTAGEM DE CARTAS E FILTROS LATERAL ---
async function loadCards() {
    if (!cardsGrid) return;
    try {
        const response = await fetch('/api/get_cards.php');
        allCards = await response.json();
        renderCards();
    } catch (error) {
        console.error("Erro ao carregar cartas:", error);
    }
}

async function updateEditionFilters(game) {
    const container = document.getElementById('edition-filters-container');
    selectedEditions = [];

    if (game === 'all') {
        container.innerHTML = '<p style="font-size: 13px; color: #666; margin-top: 10px;">Selecione um Card Game para filtrar por edição.</p>';
        return;
    }

    container.innerHTML = '<p style="font-size: 13px; color: #666;">Carregando edições...</p>';

    try {
        const response = await fetch(`/api/editions.php?game=${game}`);
        const data = await response.json();

        container.innerHTML = '';

        data.forEach(ed => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '8px';
            label.style.fontSize = '14px';
            label.style.cursor = 'pointer';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = ed.id;
            checkbox.style.marginRight = '8px';

            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    selectedEditions.push(e.target.value);
                } else {
                    selectedEditions = selectedEditions.filter(id => id !== e.target.value);
                }
                renderCards();
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(ed.name));
            container.appendChild(label);
        });

    } catch (error) {
        console.error("Erro ao buscar edições pro filtro:", error);
        container.innerHTML = '<p style="color: red;">Erro ao carregar edições.</p>';
    }
}

// --- 3. RENDERIZAÇÃO E CRUZAMENTO DE FILTROS ---
function renderCards() {
    cardsGrid.innerHTML = `
        <div class="card-item add-new" id="btn-open-modal-grid">
            <span class="plus-icon" style="font-size: 50px; cursor: pointer;">+</span>
        </div>
    `;
    document.getElementById('btn-open-modal-grid').addEventListener('click', abrirModalNovo);

    let cartasFiltradas = currentFilter === 'all'
        ? allCards
        : allCards.filter(card => card.game_category === currentFilter);

    if (selectedEditions.length > 0) {
        cartasFiltradas = cartasFiltradas.filter(card => selectedEditions.includes(card.edition));
    }

    if (searchTerm.trim() !== '') {
        const termo = searchTerm.toLowerCase();
        cartasFiltradas = cartasFiltradas.filter(card => {
            const nomeEn = (card.name_en || '').toLowerCase();
            const nomePt = (card.name_pt || '').toLowerCase();
            return nomeEn.includes(termo) || nomePt.includes(termo);
        });
    }

    cartasFiltradas.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.classList.add('card-item');
        cardEl.innerHTML = `
            <img src="${card.image_url || 'https://placehold.co/300x420'}" alt="${card.name_en}">
            <h4 style="margin: 10px 0 5px 0; text-align: center; font-size: 15px;">${card.name_en}</h4>
            <button class="btn-primary" style="width: 100%; margin-top: 10px; background-color: #ffd700; color: #000; border: none; padding: 10px; cursor: pointer; font-weight: bold;" onclick="prepararEdicao(${card.id})">Editar</button>
        `;
        cardsGrid.appendChild(cardEl);
    });
}

// --- 4. CONTROLE DE FILTROS DAS ABAS ---
const catButtons = document.querySelectorAll('.cat-btn');
if (catButtons.length > 0) {
    catButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            catButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            currentFilter = e.target.getAttribute('data-game');
            updateEditionFilters(currentFilter);
            renderCards();
        });
    });
}

const btnClearFilters = document.getElementById('btn-clear-filters');
if (btnClearFilters) {
    btnClearFilters.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('#edition-filters-container input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        selectedEditions = [];
        renderCards();
    });
}

// --- 5. PESQUISA E CONTROLE DO MODAL ---
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderCards();
    });
}

function abrirModalNovo() {
    currentCardId = null;
    cardForm.reset();
    editionSelect.innerHTML = '<option value="">Selecione uma edição *</option>';
    editionSelect.disabled = true;
    if (previewImage) previewImage.src = 'https://placehold.co/300x420';
    modal.classList.remove('hidden');
}

if (btnOpenModal) btnOpenModal.addEventListener('click', abrirModalNovo);
if (btnCloseModal) btnCloseModal.addEventListener('click', () => modal.classList.add('hidden'));
if (btnCancelModal) btnCancelModal.addEventListener('click', () => modal.classList.add('hidden'));

// --- 6. SALVAR / EDITAR / DELETAR CARTA ---
if (cardForm) {
    cardForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const cardData = {
            id: currentCardId,
            name_en: document.getElementById('name_en').value,
            name_pt: document.getElementById('name_pt').value,
            game_category: document.getElementById('game-select').value,
            edition: document.getElementById('edition-select').value,
            rarity: document.getElementById('rarity').value,
            image_url: document.getElementById('image_url').value
        };

        try {
            const response = await fetch('/api/save_card.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cardData)
            });
            const result = await response.json();

            if (result.success) {
                modal.classList.add('hidden');
                loadCards();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
        }
    });
}

async function prepararEdicao(id) {
    currentCardId = id;
    try {
        const response = await fetch(`/api/get_card.php?id=${id}`);
        const card = await response.json();

        document.getElementById('name_en').value = card.name_en;
        document.getElementById('name_pt').value = card.name_pt;
        document.getElementById('rarity').value = card.rarity;
        document.getElementById('image_url').value = card.image_url || '';
        
        if (previewImage) {
            previewImage.src = card.image_url ? card.image_url : 'https://placehold.co/300x420';
        }

        gameSelect.value = card.game_category;
        gameSelect.dispatchEvent(new Event('change'));

        setTimeout(() => {
            editionSelect.value = card.edition;
        }, 300);

        modal.classList.remove('hidden');
    } catch (error) {
        console.error("Erro ao buscar dados da carta:", error);
    }
}

const btnDelete = document.querySelector('.btn-danger');
if (btnDelete) {
    btnDelete.addEventListener('click', async () => {
        if (!currentCardId) return;
        if (confirm("Tem certeza que deseja deletar esta carta?")) {
            try {
                const response = await fetch('/api/delete_card.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: currentCardId })
                });
                const result = await response.json();

                if (result.success) {
                    modal.classList.add('hidden');
                    loadCards();
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error("Erro ao deletar:", error);
            }
        }
    });
}

const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/logout.php');
            const result = await response.json();
            if (result.success) {
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    });
}

document.addEventListener('DOMContentLoaded', loadCards);