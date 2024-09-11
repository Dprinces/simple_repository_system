document.addEventListener('DOMContentLoaded', () => {
    const itemList = document.getElementById('itemList');
    const itemForm = document.getElementById('itemForm');
    const pictureInput = document.getElementById('picture');
    const nameInput = document.getElementById('name');
    const categorySelect = document.getElementById('category');
    const itemIdInput = document.getElementById('itemId');
    const deleteSelectedButton = document.getElementById('deleteSelected');
   
    const loadItems = () => {
        itemList.innerHTML = '';
        const items = JSON.parse(localStorage.getItem('items')) || [];
        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <input type="checkbox" class="item-checkbox" data-id="${item.id}">
                <img src="${item.picture}" alt="${item.name}">
                <span>${item.name}</span>
                <span>(${item.category})</span>
                <button class="delete-button" data-id="${item.id}">Delete</button>
            `;
            itemList.appendChild(listItem);
        });
    };

    // Function to read a file and convert it to a Base64 string
    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

  
    // Function to save an item (either new or updated)
    const saveItem = async (event) => {
        event.preventDefault();

        const id = itemIdInput.value;
        const name = nameInput.value;
        const category = categorySelect.value;
        const file = pictureInput.files[0];
        const picture = file ? await readFileAsBase64(file) : '';

        const items = JSON.parse(localStorage.getItem('items')) || [];

        if (id) {
            // Update existing item
            const index = items.findIndex(item => item.id === id);
            items[index] = { id, name, category, picture };
        } else {
            // Add new item
            const newItem = {
                id: Date.now().toString(),
                name,
                category,
                picture
            };
            items.push(newItem);
        }

        // Save items to localStorage and reload the list
        localStorage.setItem('items', JSON.stringify(items));
        itemForm.reset();
        itemIdInput.value = '';
        loadItems(); // Reload the item list
    };

    
    // Function to delete an item
    const deleteItem = (id) => {
        let items = JSON.parse(localStorage.getItem('items')) || [];
        items = items.filter(item => item.id !== id);
        localStorage.setItem('items', JSON.stringify(items));
        loadItems(); // Reload the item list
    };

    // Function to delete selected items
    const deleteSelectedItems = () => {
        const selectedItems = document.querySelectorAll('.item-checkbox:checked');
        selectedItems.forEach(checkbox => {
            const id = checkbox.dataset.id;
            deleteItem(id);
        });
    };

    // Event listeners
      itemList.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-button')) {
            editItem(event.target.dataset.id);
        } else if (event.target.classList.contains('delete-button')) {
            deleteItem(event.target.dataset.id);
        }
    });

    deleteSelectedButton.addEventListener('click', deleteSelectedItems);
    itemForm.addEventListener('submit', saveItem);

    // Initial load
    loadItems();
});
