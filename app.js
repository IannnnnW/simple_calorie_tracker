//Storage Controller


//Item Contoller
const ItemCtrl = (function(){
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    //Data Structure
    const data = {
        items:[
            // {id: 0, name: 'Steak Dinner', calories: 1200},
            // {id: 1, name: 'Cookie', calories: 400},
            // {id: 2, name: 'Eggs', calories: 300}
        ],
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
        backBtn: '.back-btn'
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
            
        }


    } 
    
})();


//App Controller
const App = (function(ItemCtrl, UICtrl){
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



    }
    const itemAddSubmit = function(e){
        const input = UICtrl.getItemInput();
        if(input.name !== '' && input.calories !== ''){
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //Add item to the UI
            UICtrl.addListItem(newItem);

            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.updateCalories(totalCalories);

            //Clear input fields
            UICtrl.clearInput();

        }
        e.preventDefault()
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
        UICtrl.clearEditState();
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

})(ItemCtrl, UICtrl);

App.init()



