// ==========================================
// BASE DE DONNÉES DES CITATIONS
// ==========================================
const baseQuotes = [
    {
        text: "La seule façon de faire du bon travail est d'aimer ce que vous faites.",
        author: "Steve Jobs",
        source: "Discours Stanford",
        year: 2005,
        category: "motivation"
    },
    {
        text: "Le succès est la somme de petits efforts répétés chaque jour.",
        author: "Robert Collier",
        source: "The Secret of the Ages",
        year: 1926,
        category: "success"
    },
    {
        text: "L'avenir appartient à ceux qui croient en la beauté de leurs rêves.",
        author: "Eleanor Roosevelt",
        source: "My Day",
        year: 1945,
        category: "motivation"
    },
    {
        text: "Se réunir est un début, rester ensemble est un progrès, travailler ensemble est la réussite.",
        author: "Henry Ford",
        source: "My Life and Work",
        year: 1922,
        category: "leadership"
    },
    {
        text: "Je ne suis pas un produit de mes circonstances. Je suis un produit de mes décisions.",
        author: "Stephen Covey",
        source: "Les 7 habitudes",
        year: 1989,
        category: "life"
    },
    {
        text: "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte.",
        author: "Winston Churchill",
        source: "Discours parlement",
        year: 1942,
        category: "success"
    },
    {
        text: "Le bonheur est la seule chose qui se double si on le partage.",
        author: "Albert Schweitzer",
        source: "Philosophie de la civilisation",
        year: 1923,
        category: "life"
    },
    {
        text: "Soyons les leaders que nous rêvions d'avoir.",
        author: "Simon Sinek",
        source: "Start With Why",
        year: 2009,
        category: "leadership"
    },
    {
        text: "La motivation te permet de démarrer, mais c'est l'habitude qui te fait continuer.",
        author: "Jim Rohn",
        source: "The Art of Exceptional Living",
        year: 1993,
        category: "motivation"
    },
    {
        text: "Ne rêve pas ta vie, vis tes rêves.",
        author: "Walt Disney",
        source: "The Wisdom of Walt Disney",
        year: 1957,
        category: "motivation"
    },
    {
        text: "L'éducation est l'arme la plus puissante que vous pouvez utiliser pour changer le monde.",
        author: "Nelson Mandela",
        source: "Discours Planetarium",
        year: 2003,
        category: "life"
    },
    {
        text: "Le courage croît en osant et la peur en hésitant.",
        author: "Proverbe Romain",
        source: "Sagesse antique",
        year: -100,
        category: "motivation"
    },
    {
        text: "Un vrai leader n'a pas besoin de conduire. Il suffit qu'il montre le chemin.",
        author: "Lao Tseu",
        source: "Tao Te King",
        year: -400,
        category: "leadership"
    },
    {
        text: "Ce sont vos choix qui déterminent qui vous êtes, bien plus que vos compétences.",
        author: "J.K. Rowling",
        source: "Harry Potter",
        year: 1998,
        category: "life"
    },
    {
        text: "Le bonheur ne dépend pas de ce que vous avez ou de qui vous êtes. Il dépend uniquement de ce que vous pensez.",
        author: "Bouddha",
        source: "Dhammapada",
        year: -500,
        category: "life"
    },
    {
        text: "Le travail acharné bat le talent lorsque le talent ne travaille pas dur.",
        author: "Kevin Durant",
        source: "Interview ESPN",
        year: 2014,
        category: "success"
    },
    {
        text: "Je pense que tout est possible à qui rêve, ose, travaille et n'abandonne jamais.",
        author: "Xavier Dolan",
        source: "Interview Cannes",
        year: 2014,
        category: "motivation"
    },
    {
        text: "Pour vaincre, il nous faut de l'audace, encore de l'audace, toujours de l'audace.",
        author: "Georges Jacques Danton",
        source: "Discours Assemblée",
        year: 1792,
        category: "leadership"
    },
    {
        text: "Ce n'est pas ce que vous regardez qui compte, c'est ce que vous voyez.",
        author: "Henry David Thoreau",
        source: "Walden",
        year: 1854,
        category: "life"
    },
    {
        text: "Le plus grand secret de la réussite, c'est de se fixer un but et de ne le perdre jamais de vue.",
        author: "Christine de Suède",
        source: "Maximes",
        year: 1650,
        category: "success"
    }
];

// ==========================================
// Mes Variables GLOBALES
// ==========================================
let quotes = [...baseQuotes];
let currentQuote = null;
let recentQuotes = [];
let currentFilter = 'all';

// Stockage des citations favoris et historique
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];
let stats = JSON.parse(localStorage.getItem('stats')) || { views: 0, shares: 0 };

// Catégories disponibles
const categories = ['all', 'motivation', 'success', 'leadership', 'life', 'custom'];

// ==========================================
// INITIALISATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    // Chargement mes citations personnalisées
    const customQuotes = JSON.parse(localStorage.getItem('customQuotes')) || [];
    quotes = [...baseQuotes, ...customQuotes];
    
    // Initialisation de moninterface
    renderFilters();
    loadFavorites();
    loadHistory();
    updateStats();
    
    // Chargement de mon thème sauvegardé
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        document.getElementById('theme').textContent = 'Mode Clair';
    }
}

// ==========================================
// GESTION DES FILTRES
// ==========================================
function renderFilters() {
    const filtersContainer = document.getElementById('filters');
    const filterLabels = {
        all: 'Toutes',
        motivation: 'Motivation',
        success: 'Succès',
        leadership: 'Leadership',
        life: 'Vie',
        custom: 'Perso'
    };
    
    filtersContainer.innerHTML = categories.map((cat, index) => 
        `<button class="filter ${index === 0 ? 'active' : ''}" onclick="setFilter('${cat}')">
            ${filterLabels[cat]}
        </button>`
    ).join('');
}

function setFilter(category) {
    currentFilter = category;
    
    // Ma mise à jour de mes boutons actifs
    document.querySelectorAll('.filter').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Génération d'une nouvelle citation
    generate();
}

// ==========================================
// GÉNÉRATION DE CITATIONS
// ==========================================
function generate() {
    // Filtrage des citations selon la catégorie
    const filteredQuotes = currentFilter === 'all' 
        ? quotes 
        : quotes.filter(q => q.category === currentFilter);
    
    if (filteredQuotes.length === 0) {
        showToast('Aucune citation dans cette catégorie');
        return;
    }
    
    // Sélection aléatoire avec évitement des répétitions
    let newQuote;
    let attempts = 0;
    
    do {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        newQuote = filteredQuotes[randomIndex];
        attempts++;
    } while (
        recentQuotes.includes(newQuote.text) && 
        attempts < 10 && 
        filteredQuotes.length > 3
    );
    
    currentQuote = newQuote;
    recentQuotes.push(newQuote.text);
    
    // Garde seulement les 5 dernières citations
    if (recentQuotes.length > 5) {
        recentQuotes.shift();
    }
    
    // Affichage de la citation
    displayQuote(newQuote);
    
    // Ajout à l'historique
    addToHistory(newQuote);
    
    // Mis à jour des statistiques
    stats.views++;
    localStorage.setItem('stats', JSON.stringify(stats));
    updateStats();
}

function displayQuote(quote) {
    document.getElementById('qText').textContent = quote.text;
    document.getElementById('qAuthor').textContent = quote.author;
    document.getElementById('qMeta').innerHTML = `
        <span>📖 ${quote.source}</span>
        <span>📅 ${quote.year}</span>
        <span style="background:var(--accent);color:#fff;padding:2px 8px;font-size:0.75rem">
            ${quote.category.toUpperCase()}
        </span>
    `;
}

// ==========================================
// GESTION DES FAVORIS
// ==========================================
function addFav() {
    if (!currentQuote) {
        showToast('Aucune citation à ajouter');
        return;
    }
    
    // Vérification si déjà dans les favoris
    if (favorites.some(fav => fav.text === currentQuote.text)) {
        showToast('Déjà dans vos favoris');
        return;
    }
    
    favorites.push(currentQuote);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites();
    updateStats();
    showToast('★ Ajouté aux favoris !');
}

function loadFavorites() {
    const list = document.getElementById('favsList');
    
    if (favorites.length === 0) {
        list.innerHTML = '<div class="empty">Aucun favori pour le moment</div>';
        return;
    }
    
    list.innerHTML = favorites.map((quote, index) => `
        <div class="item">
            <div class="item-text">
                "${quote.text.substring(0, 100)}${quote.text.length > 100 ? '...' : ''}"
                <div class="item-author">${quote.author}</div>
            </div>
            <div class="item-actions">
                <button class="icon-btn" onclick="loadFav(${index})" title="Afficher">👁</button>
                <button class="icon-btn" onclick="deleteFav(${index})" title="Supprimer">🗑</button>
            </div>
        </div>
    `).join('');
}

function loadFav(index) {
    currentQuote = favorites[index];
    displayQuote(currentQuote);
    switchTab(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteFav(index) {
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites();
    updateStats();
    showToast('Favori supprimé');
}

// ==========================================
// GESTION DE L'HISTORIQUE
// ==========================================
function addToHistory(quote) {
    history.unshift({
        ...quote,
        timestamp: Date.now()
    });
    
    // Garde seulement les 50 dernières
    if (history.length > 50) {
        history.pop();
    }
    
    localStorage.setItem('history', JSON.stringify(history));
}

function loadHistory() {
    const list = document.getElementById('histList');
    
    if (history.length === 0) {
        list.innerHTML = '<div class="empty">Aucun historique pour le moment</div>';
        return;
    }
    
    list.innerHTML = history.slice(0, 30).map((quote, index) => `
        <div class="item">
            <div class="item-text">
                "${quote.text.substring(0, 80)}${quote.text.length > 80 ? '...' : ''}"
                <div class="item-author">${quote.author}</div>
            </div>
            <button class="icon-btn" onclick="loadHistoryItem(${index})" title="Afficher">👁</button>
        </div>
    `).join('');
}

function loadHistoryItem(index) {
    currentQuote = history[index];
    displayQuote(currentQuote);
    switchTab(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearHist() {
    if (confirm('Voulez-vous vraiment effacer tout l\'historique ?')) {
        history = [];
        localStorage.setItem('history', JSON.stringify(history));
        loadHistory();
        showToast('Historique effacé');
    }
}

// ==========================================
// FONCTIONS UTILITAIRES
// ==========================================
function copy() {
    if (!currentQuote) return;
    
    const text = `"${currentQuote.text}" — ${currentQuote.author}`;
    navigator.clipboard.writeText(text).then(() => {
        showToast('📋 Citation copiée !');
    });
}

function share() {
    if (!currentQuote) return;
    
    const text = `"${currentQuote.text}" — ${currentQuote.author}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'QuoteFlow',
            text: text
        });
    } else {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    }
    
    stats.shares++;
    localStorage.setItem('stats', JSON.stringify(stats));
    updateStats();
    showToast('🔗 Partagé !');
}

// ==========================================
// RECHERCHE
// ==========================================
function search() {
    const query = document.getElementById('searchIn').value.toLowerCase().trim();
    
    if (!query) {
        showToast('Veuillez entrer un terme de recherche');
        return;
    }
    
    const results = quotes.filter(q => 
        q.text.toLowerCase().includes(query) || 
        q.author.toLowerCase().includes(query) ||
        q.category.toLowerCase().includes(query)
    );
    
    const resultsDiv = document.getElementById('searchRes');
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<div class="empty">Aucun résultat trouvé</div>';
        return;
    }
    
    resultsDiv.innerHTML = results.map(quote => `
        <div class="item">
            <div class="item-text">
                "${quote.text}"
                <div class="item-author">${quote.author}</div>
            </div>
            <button class="icon-btn" onclick="loadSearchResult(${quotes.indexOf(quote)})" title="Afficher">👁</button>
        </div>
    `).join('');
}

function loadSearchResult(index) {
    currentQuote = quotes[index];
    displayQuote(currentQuote);
    switchTab(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// CITATIONS PERSONNALISÉES et MODERNE
// ==========================================
function openModal() {
    document.getElementById('modal').classList.add('show');
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

function addCustom(event) {
    event.preventDefault();
    
    const newQuote = {
        text: document.getElementById('cText').value,
        author: document.getElementById('cAuthor').value,
        source: document.getElementById('cSource').value,
        year: parseInt(document.getElementById('cYear').value),
        category: document.getElementById('cCat').value
    };
    
    // Ajout à la liste principale
    quotes.push(newQuote);
    
    // Sauvegarde dans le local storage
    const customQuotes = JSON.parse(localStorage.getItem('customQuotes')) || [];
    customQuotes.push(newQuote);
    localStorage.setItem('customQuotes', JSON.stringify(customQuotes));
    
    // Mise à jour des statistiques
    updateStats();
    
    // Fermeture de mon modele et réinitialisation du formulaire
    closeModal();
    event.target.reset();
    
    showToast('✨ Citation ajoutée avec succès !');
}

// ==========================================
// EXPORTATION DES FAVORIS
// ==========================================
function exportData(format) {
    if (favorites.length === 0) {
        showToast('Aucun favori à exporter');
        return;
    }
    
    let content = '';
    let filename = `favoris_quoteflow.${format}`;
    
    if (format === 'json') {
        content = JSON.stringify(favorites, null, 2);
    } else if (format === 'txt') {
        content = favorites.map(q => 
            `"${q.text}"\n— ${q.author}\n(${q.source}, ${q.year})\n`
        ).join('\n');
    } else if (format === 'csv') {
        content = 'Citation,Auteur,Source,Année,Catégorie\n';
        content += favorites.map(q => 
            `"${q.text}","${q.author}","${q.source}",${q.year},${q.category}`
        ).join('\n');
    }
    
    // Téléchargement du fichier
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    
    showToast(`📥 Exporté en ${format.toUpperCase()}`);
}

// ==========================================
// STATISTIQUES
// ==========================================
function updateStats() {
    document.getElementById('sViews').textContent = stats.views;
    document.getElementById('sFavs').textContent = favorites.length;
    document.getElementById('sShares').textContent = stats.shares;
    document.getElementById('sTotal').textContent = quotes.length;
}

// ==========================================
// NAVIGATION DES ONGLETS
// ==========================================
function switchTab(tabIndex) {
    // Mise à jour de mes boutons
    document.querySelectorAll('.tab').forEach((tab, index) => {
        tab.classList.toggle('active', index === tabIndex);
    });
    
    // Mise à jour du contenu
    document.querySelectorAll('.tab-content').forEach((content, index) => {
        content.classList.toggle('active', index === tabIndex);
    });
}

// ==========================================
// THÈME SOMBRE / CLAIR
// ==========================================
function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    document.getElementById('theme').textContent = isDark ? 'Mode Clair' : 'Mode Sombre';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// ==========================================
// NOTIFICATIONS TOAST
// ==========================================
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==========================================
// RACCOURCIS CLAVIER
// ==========================================
document.addEventListener('keydown', (e) => {
    // Espace ou Entrée : Génération d'une nouvelle citation
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        generate();
    }
    
    // F : Ma commande pour ajouter aux favoris
    if (e.key === 'f' || e.key === 'F') {
        addFav();
    }
    
    // C : Ma commande pour copier
    if (e.key === 'c' || e.key === 'C') {
        copy();
    }
});