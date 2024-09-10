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
                <button class="edit-button" data-id="${item.id}">Edit</button>
                <button class="delete-button" data-id="${item.id}">Delete</button>
            `;
            itemList.appendChild(listItem);
        });
    };

    const saveItem = (event) => {
        event.preventDefault();

        const id = itemIdInput.value;
        const name = nameInput.value;
        const category = categorySelect.value;
        const picture = pictureInput.files[0] ? URL.createObjectURL(pictureInput.files[0]) : '';

        const items = JSON.parse(localStorage.getItem('items')) || [];

        if (id) {
            const index = items.findIndex(item => item.id === id);
            items[index] = { id, name, category, picture };
        } else {
            const newItem = {
                id: Date.now().toString(),
                name,
                category,
                picture
            };
            items.push(newItem);
        }

        localStorage.setItem('items', JSON.stringify(items));
        itemForm.reset();
        itemIdInput.value = '';
        loadItems();
    };

    const editItem = (id) => {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        const item = items.find(item => item.id === id);
        if (item) {
            nameInput.value = item.name;
            categorySelect.value = item.category;
            itemIdInput.value = item.id;
            // Load picture if needed
            pictureInput.value = '';
        }
    };

    const deleteItem = (id) => {
        let items = JSON.parse(localStorage.getItem('items')) || [];
        items = items.filter(item => item.id !== id);
        localStorage.setItem('items', JSON.stringify(items));
        loadItems();
    };

    const deleteSelectedItems = () => {
        const selectedItems = document.querySelectorAll('.item-checkbox:checked');
        selectedItems.forEach(checkbox => {
            const id = checkbox.dataset.id;
            deleteItem(id);
        });
    };

    itemList.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-button')) {
            editItem(event.target.dataset.id);
        } else if (event.target.classList.contains('delete-button')) {
            deleteItem(event.target.dataset.id);
        }
    });

    deleteSelectedButton.addEventListener('click', deleteSelectedItems);
    itemForm.addEventListener('submit', saveItem);

    loadItems();
});
