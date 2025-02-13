// Menu data structure
const menuData = [
    { id: 'member-ibc', text: 'Member IBC', icon: 'fas fa-users', active: true },
    { id: 'member-sbo', text: 'Member SBO', icon: 'fas fa-users' },
    { id: 'agent-sbo', text: 'Agent SBO', icon: 'fas fa-user-tie' },
    { id: 'agent-ibc', text: 'Agent IBC', icon: 'fas fa-user-tie' },
    { id: 'agent-p88', text: 'Agent P88', icon: 'fas fa-user-tie' },
    { id: 'agent-betisn', text: 'Agent BetISN', icon: 'fas fa-user-tie' }
];

// Sample data for tables
const sampleData = {
    leftTable: [
        { type: '1H', hdp: '0.25', detailed: 'Dưới', turnover: 7210, winLose: 1825.00, votes: 23, lose: 0, win: 3, rc: 0 },
        { type: 'FT', hdp: '0.50', detailed: 'Trên', turnover: 5430, winLose: -925.00, votes: 15, lose: 2, win: 1, rc: 1 },
        { type: '1H', hdp: '0.75', detailed: 'Trên', turnover: 3890, winLose: 650.00, votes: 18, lose: 1, win: 4, rc: 0 }
    ],
    rightTable: [
        { detailed: 'Dưới', type: '1H Handicap', turnover: 10430.00, winLose: 2668.00, votes: 31.00, lose: 0.00, win: 10.00, rc: 10.00 },
        { detailed: 'Trên', type: 'FT Handicap', turnover: 8250.00, winLose: -1520.00, votes: 25.00, lose: 5.00, win: 3.00, rc: 2.00 },
        { detailed: 'Trên', type: '1H Handicap', turnover: 6780.00, winLose: 890.00, votes: 20.00, lose: 2.00, win: 6.00, rc: 1.00 }
    ]
};

// Function to render menu
function renderMenu() {
    const menuContainer = document.querySelector('.bg-gray-800 ul');
    if (!menuContainer) return;

    menuContainer.innerHTML = menuData.map((item, index) => `
        <li class="menu-item" data-id="${item.id}">
            <a href="#" class="block p-2 ${item.active ? 'bg-gray-700' : ''} rounded hover:bg-gray-600 transition-all duration-300 flex items-center space-x-2">
                <i class="${item.icon}"></i>
                <span>${item.text}</span>
            </a>
        </li>
    `).join('');

    // Add click handlers to menu items
    const menuItems = menuContainer.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active state in data
            menuData.forEach(menuItem => menuItem.active = false);
            menuData[index].active = true;

            // Update UI
            menuItems.forEach(mi => {
                const link = mi.querySelector('a');
                link.classList.remove('bg-gray-700');
                link.classList.add('hover:bg-gray-700');
            });
            
            const clickedLink = item.querySelector('a');
            clickedLink.classList.add('bg-gray-700');
            clickedLink.classList.remove('hover:bg-gray-700');

            // Add slide animation
            item.style.transform = 'translateX(5px)';
            setTimeout(() => {
                item.style.transform = 'translateX(0)';
            }, 200);

            // Update content based on selection
            updateContent(menuData[index]);
        });

        // Add hover animation
        item.addEventListener('mouseenter', () => {
            if (!menuData[index].active) {
                item.style.transform = 'translateX(5px)';
            }
        });

        item.addEventListener('mouseleave', () => {
            if (!menuData[index].active) {
                item.style.transform = 'translateX(0)';
            }
        });
    });
}

// Function to update main content
function updateContent(menuItem) {
    console.log(`Loading content for: ${menuItem.text}`);
    
    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-indicator fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg';
    loadingDiv.textContent = `Loading ${menuItem.text} data...`;
    document.body.appendChild(loadingDiv);

    // Simulate content update
    setTimeout(() => {
        // Update tables with new data
        updateTableData();
        
        // Remove loading indicator
        loadingDiv.style.opacity = '0';
        setTimeout(() => loadingDiv.remove(), 300);

        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg';
        notification.textContent = `${menuItem.text} data loaded successfully`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 500);
}

// Enhanced TableManager class
class TableManager {
    constructor(tableId, data) {
        this.table = document.getElementById(tableId);
        this.data = data;
        this.sortDirection = {};
        this.setupSorting();
        this.setupRowHighlight();
        this.renderData();
        this.setupAnimations();
    }

    renderData() {
        const tbody = this.table.querySelector('tbody');
        tbody.innerHTML = '';
        
        this.data.forEach(row => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50 transition-all duration-300';
            
            Object.values(row).forEach(value => {
                const td = document.createElement('td');
                td.className = 'p-3 border-b transition-all duration-300';
                td.textContent = typeof value === 'number' ? 
                    value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : 
                    value;
                
                if (typeof value === 'number' && td.textContent.includes('.')) {
                    td.style.color = value >= 0 ? '#10B981' : '#EF4444';
                    td.style.fontWeight = 'bold';
                }
                
                tr.appendChild(td);
            });
            
            tbody.appendChild(tr);
        });
    }

    setupSorting() {
        if (!this.table) return;
        
        const headers = this.table.querySelectorAll('th');
        headers.forEach((header, index) => {
            header.style.position = 'relative';
            header.style.cursor = 'pointer';
            const icon = document.createElement('span');
            icon.className = 'sort-icon ml-2 opacity-0 transition-opacity duration-200';
            icon.innerHTML = '↕️';
            header.appendChild(icon);

            header.addEventListener('click', () => {
                this.sortTable(index);
                icon.style.opacity = '1';
                icon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                }, 200);
            });

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
        const rows = this.table.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateY(10px)';
            setTimeout(() => {
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    sortTable(column) {
        const headers = this.table.querySelectorAll('th');
        this.sortDirection[column] = !this.sortDirection[column];

        headers.forEach(header => {
            const icon = header.querySelector('.sort-icon');
            icon.innerHTML = '↕️';
            icon.style.opacity = '0';
        });

        const currentIcon = headers[column].querySelector('.sort-icon');
        currentIcon.innerHTML = this.sortDirection[column] ? '↑' : '↓';
        currentIcon.style.opacity = '1';

        this.data.sort((a, b) => {
            const values = Object.values(a);
            const aValue = values[column];
            const bValue = Object.values(b)[column];
            
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return this.sortDirection[column] ? aValue - bValue : bValue - aValue;
            }
            return this.sortDirection[column] ? 
                String(aValue).localeCompare(String(bValue)) : 
                String(bValue).localeCompare(String(aValue));
        });

        this.renderData();
        this.setupRowHighlight();
        this.setupAnimations();
    }

    updateData(newData) {
        const tbody = this.table.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '0';
            row.style.transform = 'translateY(-10px)';
        });

        setTimeout(() => {
            this.data = newData;
            this.renderData();
            this.setupRowHighlight();
            this.setupAnimations();
        }, 300);
    }
}

// Function to generate random data
function generateRandomData() {
    const types = ['1H', 'FT'];
    const hdps = ['0.25', '0.50', '0.75', '1.00'];
    const detaileds = ['Trên', 'Dưới'];

    const randomAmount = () => Math.floor(Math.random() * 15000) + 5000;
    const randomWinLose = () => (Math.random() * 8000 - 4000).toFixed(2);

    return {
        leftTable: Array(3).fill(null).map(() => ({
            type: types[Math.floor(Math.random() * types.length)],
            hdp: hdps[Math.floor(Math.random() * hdps.length)],
            detailed: detaileds[Math.floor(Math.random() * detaileds.length)],
            turnover: randomAmount(),
            winLose: parseFloat(randomWinLose()),
            votes: Math.floor(Math.random() * 30) + 10,
            lose: Math.floor(Math.random() * 5),
            win: Math.floor(Math.random() * 8),
            rc: Math.floor(Math.random() * 3)
        })),
        rightTable: Array(3).fill(null).map(() => ({
            detailed: detaileds[Math.floor(Math.random() * detaileds.length)],
            type: `${types[Math.floor(Math.random() * types.length)]} Handicap`,
            turnover: randomAmount(),
            winLose: parseFloat(randomWinLose()),
            votes: Math.floor(Math.random() * 40) + 15,
            lose: Math.floor(Math.random() * 6),
            win: Math.floor(Math.random() * 8),
            rc: Math.floor(Math.random() * 4)
        }))
    };
}

// Function to update table data
function updateTableData() {
    document.body.style.cursor = 'wait';
    const newData = generateRandomData();
    
    setTimeout(() => {
        leftTableManager.updateData(newData.leftTable);
        rightTableManager.updateData(newData.rightTable);
        document.body.style.cursor = 'default';
    }, 300);
}

// Tab switching function
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-button');
    const activeClass = 'active';
    
    tabs.forEach(tab => {
        if (tab.textContent === tabName) {
            tab.classList.add(activeClass);
            tab.style.transform = 'translateY(-2px)';
            tab.style.transition = 'all 0.3s ease';
        } else {
            tab.classList.remove(activeClass);
            tab.style.transform = 'translateY(0)';
        }
    });

    updateTableData();
}

// Search functionality
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
                    row.style.transition = 'all 0.3s ease';
                    row.style.opacity = '0';
                    setTimeout(() => {
                        row.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

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

let leftTableManager, rightTableManager;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize menu
    renderMenu();
    
    // Initialize table managers
    leftTableManager = new TableManager('leftTable', sampleData.leftTable);
    rightTableManager = new TableManager('rightTable', sampleData.rightTable);

    // Setup other functionalities
    setupSearch();

    // Set first tab as active
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

    // Initialize date inputs
    const today = new Date().toISOString().split('T')[0];
    document.querySelector('#from').value = today;
    document.querySelector('#to').value = today;
});
