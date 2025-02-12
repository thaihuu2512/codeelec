// Enhanced TableManager class with animations and interactions
class TableManager {
    constructor(tableId) {
        this.table = document.getElementById(tableId);
        this.sortDirection = {};
        this.setupSorting();
        this.setupRowHighlight();
        this.setupAnimations();
    }

    setupSorting() {
        if (!this.table) return;
        
        const headers = this.table.querySelectorAll('th');
        headers.forEach((header, index) => {
            // Add sort icons and styling
            header.style.position = 'relative';
            header.style.cursor = 'pointer';
            const icon = document.createElement('span');
            icon.className = 'sort-icon ml-2 opacity-0 transition-opacity duration-200';
            icon.innerHTML = '↕️';
            header.appendChild(icon);

            // Add click handler with animation
            header.addEventListener('click', () => {
                this.sortTable(index);
                // Animate the icon
                icon.style.opacity = '1';
                icon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                }, 200);
            });

            // Add hover effect
            header.addEventListener('mouseenter', () => {
                icon.style.opacity = '0.5';
            });
            header.addEventListener('mouseleave', () => {
                if (!this.sortDirection[index]) {
                    icon.style.opacity = '0';
                }
            });
        });
    }

    setupRowHighlight() {
        const tbody = this.table.querySelector('tbody');
        tbody.querySelectorAll('tr').forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.transition = 'all 0.2s ease';
                row.style.backgroundColor = '#EBF4FF';
                row.style.transform = 'translateX(5px)';
            });
            row.addEventListener('mouseleave', () => {
                row.style.backgroundColor = '';
                row.style.transform = 'translateX(0)';
            });
        });
    }

    setupAnimations() {
        // Add fade-in animation to rows
        const rows = this.table.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateY(10px)';
            setTimeout(() => {
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            }, index * 100); // Stagger the animations
        });
    }

    sortTable(column) {
        const tbody = this.table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const headers = this.table.querySelectorAll('th');

        // Toggle sort direction
        this.sortDirection[column] = !this.sortDirection[column];

        // Update sort icons
        headers.forEach(header => {
            const icon = header.querySelector('.sort-icon');
            icon.innerHTML = '↕️';
            icon.style.opacity = '0';
        });

        const currentIcon = headers[column].querySelector('.sort-icon');
        currentIcon.innerHTML = this.sortDirection[column] ? '↑' : '↓';
        currentIcon.style.opacity = '1';

        // Sort rows with animation
        rows.sort((a, b) => {
            const aValue = a.cells[column].textContent.trim();
            const bValue = b.cells[column].textContent.trim();
            
            const aNum = parseFloat(aValue.replace(/,/g, ''));
            const bNum = parseFloat(bValue.replace(/,/g, ''));
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return this.sortDirection[column] ? aNum - bNum : bNum - aNum;
            }
            return this.sortDirection[column] ? 
                aValue.localeCompare(bValue) : 
                bValue.localeCompare(aValue);
        });

        // Animate row reordering
        tbody.innerHTML = '';
        rows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateY(10px)';
            tbody.appendChild(row);
            
            setTimeout(() => {
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }
}

// Enhanced tab switching with animations
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-button');
    const activeClass = 'active';
    
    tabs.forEach(tab => {
        if (tab.textContent === tabName) {
            // Add slide and fade animation for active tab
            tab.classList.add(activeClass);
            tab.style.transform = 'translateY(-2px)';
            tab.style.transition = 'all 0.3s ease';
        } else {
            tab.classList.remove(activeClass);
            tab.style.transform = 'translateY(0)';
        }
    });
}

// Enhanced search functionality with highlighting
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                const match = text.includes(searchTerm);
                
                if (match) {
                    row.style.display = '';
                    // Highlight matching text with animation
                    const cells = row.querySelectorAll('td');
                    cells.forEach(cell => {
                        const content = cell.textContent;
                        if (content.toLowerCase().includes(searchTerm)) {
                            cell.innerHTML = content.replace(
                                new RegExp(searchTerm, 'gi'),
                                match => `<span class="bg-yellow-200 px-1 rounded animate-pulse">${match}</span>`
                            );
                        }
                    });
                } else {
                    // Fade out non-matching rows
                    row.style.transition = 'all 0.3s ease';
                    row.style.opacity = '0';
                    setTimeout(() => {
                        row.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Add search icon animation
    const searchIcon = document.querySelector('.fa-search');
    if (searchIcon) {
        searchInput.addEventListener('focus', () => {
            searchIcon.style.transform = 'scale(1.2)';
            searchIcon.style.transition = 'all 0.2s ease';
            searchIcon.style.color = '#4299e1';
        });
        searchInput.addEventListener('blur', () => {
            searchIcon.style.transform = 'scale(1)';
            searchIcon.style.color = '#718096';
        });
    }
}

// Enhanced checkbox interactions
function setupCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        const label = checkbox.closest('label');
        if (label) {
            label.addEventListener('mouseenter', () => {
                label.style.transform = 'translateX(5px)';
                label.style.transition = 'all 0.2s ease';
            });
            label.addEventListener('mouseleave', () => {
                label.style.transform = 'translateX(0)';
            });
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize table managers with enhanced animations
    new TableManager('leftTable');
    new TableManager('rightTable');

    // Setup other functionalities
    setupSearch();
    setupCheckboxes();

    // Set first tab as active with animation
    const firstTab = document.querySelector('.tab-button');
    if (firstTab) {
        firstTab.classList.add('active');
        firstTab.style.transform = 'translateY(-2px)';
    }

    // Add button hover effects
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.transition = 'all 0.2s ease';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });

    // Initialize date inputs with current date
    const today = new Date().toISOString().split('T')[0];
    document.querySelector('#from').value = today;
    document.querySelector('#to').value = today;
});
