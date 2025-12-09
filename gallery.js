// Gallery Filtering Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

// Initialize gallery - show all items
window.addEventListener('DOMContentLoaded', () => {
    galleryItems.forEach(item => {
        item.classList.add('show');
    });
});

// Filter gallery items based on category
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        // Filter gallery items
        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.classList.contains(filterValue)) {
                item.classList.add('show');
                setTimeout(() => {
                    item.style.display = 'block';
                }, 50);
            } else {
                item.classList.remove('show');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Lightbox Functionality
const viewButtons = document.querySelectorAll('.view-btn');
const lightboxModal = document.getElementById('lightboxModal');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const lightboxCategory = document.getElementById('lightboxCategory');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Gallery data for lightbox
const galleryData = [
    {
        img: 'images/m3.jpg',
        title: 'Healing Crystals',
        desc: 'Natural crystals used for energy work and spiritual protection. Each stone has unique properties for different types of healing. Crystals like amethyst, quartz, and obsidian are carefully selected for their specific vibrations.',
        category: 'Healing Tools'
    },
    {
        img: 'images/m7.jpg',
        title: 'Divination Bones',
        desc: 'Traditional throwing bones used for fortune telling and spiritual guidance. Passed down through generations of healers. Each bone, shell, and object in the set has specific meanings and interpretations.',
        category: 'Healing Tools'
    },
    {
        img: 'images/m8.jpg',
        title: 'Smoke Cleansing',
        desc: 'Sacred smoke ritual using sage and other herbs to purify spaces, remove negative energy, and invite positive vibrations. This ancient practice clears energetic blockages and restores balance.',
        category: 'Rituals'
    },
    {
        img: 'images/m2.jpg',
        title: 'Ancestral Connection',
        desc: 'Ritual to communicate with ancestors for guidance and wisdom. A sacred practice to honor those who came before us. Offerings and prayers create a bridge between the physical and spiritual worlds.',
        category: 'Rituals'
    },
    {
        img: 'images/m10.jpg',
        title: 'Healing Herbs Collection',
        desc: 'Traditional medicinal herbs used for physical and spiritual healing. Each herb has specific properties for different ailments. Herbs are carefully harvested, dried, and stored for various healing purposes.',
        category: 'Herbs & Remedies'
    },
    {
        img: 'images/m11.jpg',
        title: 'Herbal Potions',
        desc: 'Traditional potions and remedies prepared from natural ingredients for spiritual protection and healing. These blends are created during specific moon phases for maximum potency.',
        category: 'Herbs & Remedies'
    },
    {
        img: 'images/m12.jpg',
        title: 'Healing Altar',
        desc: 'Personal altar space where healing rituals are performed. Contains sacred objects, candles, and offerings. This space is consecrated and maintained as a focal point for spiritual work.',
        category: 'Sacred Spaces'
    },
    {
        img: 'images/m13.jpg',
        title: 'Outdoor Ceremony Space',
        desc: 'Natural outdoor setting for larger ceremonies and rituals, connecting with earth energies and natural elements. These spaces are often near trees, water, or other natural features.',
        category: 'Sacred Spaces'
    },
    {
        img: 'images/m14.jpg',
        title: 'Ceremonial Rattles',
        desc: 'Handmade rattles used in healing ceremonies to create rhythmic sounds that alter consciousness and invite spirits. The materials and construction vary based on their intended use.',
        category: 'Healing Tools'
    },
    {
        img: 'images/m15.jpg',
        title: 'Water Blessing Ceremony',
        desc: 'Ritual for cleansing and blessing with sacred water, often performed at natural water sources like rivers or springs. Water is charged with prayers and intentions for healing.',
        category: 'Rituals'
    },
    {
        img: 'images/m16.jpg',
        title: 'Traditional Incense',
        desc: 'Hand-blended incense made from aromatic herbs, resins, and woods used for purification and spiritual connection. Different blends are used for specific rituals and intentions.',
        category: 'Herbs & Remedies'
    },
    {
        img: 'images/m17.jpg',
        title: 'Meditation Corner',
        desc: 'Peaceful space for meditation, reflection, and connecting with spiritual guides during healing sessions. This space is designed to facilitate deep relaxation and spiritual connection.',
        category: 'Sacred Spaces'
    }
];

let currentIndex = 0;

// Open lightbox with specific image
viewButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        currentIndex = parseInt(button.getAttribute('data-index'));
        updateLightbox(currentIndex);
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close lightbox
lightboxClose.addEventListener('click', () => {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close lightbox when clicking outside the content
lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Navigation with arrow keys
    if (lightboxModal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        }
    }
});

// Navigate lightbox
function navigateLightbox(direction) {
    currentIndex += direction;
    
    // Loop around if at beginning or end
    if (currentIndex < 0) {
        currentIndex = galleryData.length - 1;
    } else if (currentIndex >= galleryData.length) {
        currentIndex = 0;
    }
    
    updateLightbox(currentIndex);
}

// Update lightbox content
function updateLightbox(index) {
    const item = galleryData[index];
    lightboxImg.src = item.img;
    lightboxImg.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxDesc.textContent = item.desc;
    lightboxCategory.textContent = item.category;
    
    // Update button states for navigation
    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
}

// Add event listeners for navigation buttons
prevBtn.addEventListener('click', () => navigateLightbox(-1));
nextBtn.addEventListener('click', () => navigateLightbox(1));

// Update main JavaScript file to handle gallery page navigation
// Add to the existing script.js file:
const navLinksGallery = document.querySelectorAll('.nav-list a');
navLinksGallery.forEach(link => {
    link.addEventListener('click', () => {
        // Close mobile menu if open
        if (navList.classList.contains('active')) {
            navList.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});