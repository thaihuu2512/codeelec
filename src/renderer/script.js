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

// Enhanced TableManager class with animations and interactions
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
            tr.className = 'hover:bg-gray-50';
            
            Object.values(row).forEach(value => {
                const td = document.createElement('td');
                td.className = 'p-3 border-b';
                td.textContent = typeof value === 'number' ? 
                    value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : 
                    value;
                
                // Add color to win/lose values
                if (typeof value === 'number' && td.textContent.includes('.')) {
                    td.style.color = value >= 0 ? '#10B981' : '#EF4444';
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
        const tbody = this.table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
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

    // Method to update data
    updateData(newData) {
        this.data = newData;
        this.renderData();
        this.setupRowHighlight();
        this.setupAnimations();
    }
}

// Enhanced tab switching with animations
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

    // Simulate data update when switching tabs
    updateTableData();
}

// Function to generate random data
function generateRandomData() {
    const types = ['1H', 'FT'];
    const hdps = ['0.25', '0.50', '0.75', '1.00'];
    const detaileds = ['Trên', 'Dưới'];

    return {
        leftTable: Array(3).fill(null).map(() => ({
            type: types[Math.floor(Math.random() * types.length)],
            hdp: hdps[Math.floor(Math.random() * hdps.length)],
            detailed: detaileds[Math.floor(Math.random() * detaileds.length)],
            turnover: Math.floor(Math.random() * 10000),
            winLose: (Math.random() * 4000 - 2000),
            votes: Math.floor(Math.random() * 30),
            lose: Math.floor(Math.random() * 5),
            win: Math.floor(Math.random() * 5),
            rc: Math.floor(Math.random() * 3)
        })),
        rightTable: Array(3).fill(null).map(() => ({
            detailed: detaileds[Math.floor(Math.random() * detaileds.length)],
            type: `${types[Math.floor(Math.random() * types.length)]} Handicap`,
            turnover: Math.floor(Math.random() * 15000),
            winLose: (Math.random() * 5000 - 2500),
            votes: Math.floor(Math.random() * 40),
            lose: Math.floor(Math.random() * 6),
            win: Math.floor(Math.random() * 8),
            rc: Math.floor(Math.random() * 4)
        }))
    };
}

// Function to update table data
function updateTableData() {
    const newData = generateRandomData();
    leftTableManager.updateData(newData.leftTable);
    rightTableManager.updateData(newData.rightTable);
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

// Enhanced checkbox interactions
function setupCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Update data when checkboxes change
            updateTableData();
        });

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

// Setup date range functionality
function setupDateRange() {
    const fromDate = document.getElementById('from');
    const toDate = document.getElementById('to');
    const dateButtons = document.querySelectorAll('button');

    // Update data when date range changes
    fromDate.addEventListener('change', updateTableData);
    toDate.addEventListener('change', updateTableData);

    // Add click handlers for date shortcut buttons
    dateButtons.forEach(button => {
        if (button.textContent.includes('Hôm')) {
            button.addEventListener('click', () => {
                updateTableData();
            });
        }
    });
}

let leftTableManager, rightTableManager;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize table managers with sample data
    leftTableManager = new TableManager('leftTable', sampleData.leftTable);
    rightTableManager = new TableManager('rightTable', sampleData.rightTable);

    // Setup other functionalities
    setupSearch();
    setupCheckboxes();
    setupDateRange();

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
