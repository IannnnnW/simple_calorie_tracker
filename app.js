//Storage Controller
const StorageCtrl = (function(){
    //Public functions
    return{
        addToStorage:function(item){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        fetchFromStorage:function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateStorage:function(update){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index)=>{
                if(item.id === update.id){
                    items.splice(index, 1, update);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        }, 
        deleteFromStorage:function(deletedId){
            let items = JSON.parse(localStorage.getItem('items'));
            let ids = items.map((item)=>{
                return item.id;
            });
            items.splice(ids.indexOf(deletedId), 1);
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearAll(){
            // let items = JSON.parse(localStorage.getItem('items'));
            // items = [];
            // localStorage.setItem('items', JSON.stringify(items));
            localStorage.removeItem('items');
        }
    }
})();

//Item Contoller
const ItemCtrl = (function(){
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    //Data Structure
    const data = {
        items: StorageCtrl.fetchFromStorage(),
        currentItem: null,
        totalCalories: 0
    }
    // public methods
    return {
        logData: function(){
            return data;
        },
        getItems: function(){
            return data.items;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        addItem: function(name, calories){
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            calories = parseInt(calories);
            data.items.push(new Item(ID, name, calories));

            return new Item(ID, name, calories);
        },
        getTotalCalories:function(){
            let total = 0;
            data.items.forEach((item)=>{
                total += item.calories;
            });
            data.totalCalories = total;

            return data.totalCalories;
        }, 
        getItemById:function(id){
            let found = null;
            data.items.forEach((item)=>{
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        }, 
        setCurrentItem:function(item){
            data.currentItem = item;
        },
        updatedItem:function(name, calories){
            calories = parseInt(calories);
            let found = null;
            data.items.forEach((item)=>{
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem:function(id){
            let ids = data.items.map((item)=>{
                return item.id;
            });
            const index = ids.indexOf(id);
            data.items.splice(index, 1);
        },
        deleteAll:function(){
            data.items = [];
        }
    }
})();


//UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList:'#item-list',
        itemName: '#item-name',
        itemCalories: '#item-calories',
        addBtn: '.add-btn',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        listItems: '#items-list li'
    }
    return {
        populateItemList: function(items){
        let html = '';

        items.forEach((item)=>{
            html += `
            <li id="item-${item.id}" class="collection-item">
                <strong>${item.name}:  </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>
            `;
        });
        document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function(){
            return UISelectors;
        },
        getItemInput: function(){
            return{
                name: document.querySelector(UISelectors.itemName).value,
                calories:document.querySelector(UISelectors.itemCalories).value,
            }
        },
        addListItem: function(item){
            //Show list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `
            <strong>${item.name}:  </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemName).value = "";
            document.querySelector(UISelectors.itemCalories).value = "";
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        updateCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showItem: function(itemName, itemCalories){
            document.querySelector(UISelectors.itemName).value = itemName;
            document.querySelector(UISelectors.itemCalories).value = itemCalories;
            UICtrl.showEditState();
        }, 
        showEditState:function(){
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        updateEdit:function(item){
            const itemId = document.querySelector(`#item-${item.id}`);
            itemId.innerHTML = `
            <strong>${item.name}:  </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;
        },
        deleteListItem:function(id){
            document.querySelector(`#item-${id}`).remove();
        },
        clearList:function(){
            let list = document.querySelectorAll(UISelectors.listItems);
            list = Array.from(list);
            list.forEach(function(item){
                item.remove();
            });
        }
    } 
    
})();


//App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    //load event listeners
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors();

        //Adding an Item
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //Disable enter press
        document.querySelector("keypress", (e)=>{
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault()
                return false;
            }
        })

        //Editing an Item
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //Submitting Editted Item
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemEditSubmit);

        //Exiting Edit State
        document.querySelector(UISelectors.backBtn).addEventListener('click',backAction);

        //deleting an Item
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteItem);

        //clear all
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearList);



    }
    const itemAddSubmit = function(e){
        const input = UICtrl.getItemInput();
        if(input.name !== '' && input.calories !== ''){
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //Add item to the UI
            UICtrl.addListItem(newItem);

            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.updateCalories(totalCalories);

            //Set to local Storage
            StorageCtrl.addToStorage(newItem);

            //Clear input fields
            UICtrl.clearInput();

        }
        e.preventDefault();
    }
    const itemEditClick= function(e){
        if(e.target.classList.contains('edit-item')){
            const itemId = e.target.parentNode.parentNode.id;

            const itemArray = itemId.split("-");

            const id = parseInt(itemArray[1]);

            const current = ItemCtrl.getItemById(id);

            ItemCtrl.setCurrentItem(current);

            UICtrl.showItem(current.name, current.calories);

            UICtrl.showEditState();
        }
        e.preventDefault();
    }
    const itemEditSubmit = function(e){
        const input = UICtrl.getItemInput();
        const updatedItem = ItemCtrl.updatedItem(input.name, input.calories);
        UICtrl.updateEdit(updatedItem);
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.updateCalories(totalCalories);
        StorageCtrl.updateStorage(updatedItem);
        UICtrl.clearEditState();
        e.preventDefault();
    }
    const deleteItem = function(e){
        let currentItem = ItemCtrl.getCurrentItem();
        ItemCtrl.deleteItem(currentItem.id);
        UICtrl.deleteListItem(currentItem.id);
        StorageCtrl.deleteFromStorage(currentItem.id);
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.updateCalories(totalCalories);
        UICtrl.clearEditState();
        e.preventDefault();
    }
    const backAction = function(e){
        UICtrl.clearEditState();
        e.preventDefault();
    }
    const clearList = function(e){
        ItemCtrl.deleteAll();
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.updateCalories(totalCalories);
        UICtrl.clearList();
        StorageCtrl.clearAll();
        UICtrl.hideList();
        e.preventDefault();
    }
    //public methods
    return {
        init: function(){
            //set initial state
            UICtrl.clearEditState();
            const items = ItemCtrl.getItems();
            if(items.length === 0){
                UICtrl.hideList()
            } else{
                UICtrl.populateItemList(items);
            }
            
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.updateCalories(totalCalories);

            loadEventListeners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

App.init()