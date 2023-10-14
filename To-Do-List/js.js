var addButton = document.getElementById("add");
var allDeleteButton = document.getElementById("all-delete");
var addText = document.getElementById("add-text");
var todoBox = document.getElementById("todo-box");

var storedItems = JSON.parse(sessionStorage.getItem("todoItems")) || [];
var itemCount = storedItems.length;
for (var i = 0; i < storedItems.length; i++) {
   var item = storedItems[i];
   addItemToDOM(item);
}

function addItemToDOM(item) {
   var newItem = document.createElement("div");
   newItem.className = "todo-box";
   newItem.id = "todo-box-" + itemCount;
   newItem.innerHTML = `
      <div class="todo-item">
         <div class="delete" id="delete-${itemCount}" title="Delete item"><span class="material-symbols-outlined" id="delete-${itemCount}">delete</span></div>
         <div class="to-do-item-name">${item}</div>
      </div>
   `;

   todoBox.appendChild(newItem);
   itemCount++;
}

function saveItemsToSessionStorage() {
   var itemsToStore = [];
   var todoItems = document.querySelectorAll(".to-do-item-name");
   todoItems.forEach(function (item) {
      itemsToStore.push(item.textContent);
   });
   sessionStorage.setItem("todoItems", JSON.stringify(itemsToStore));
}

function deleteItem(event) {
   var itemId = event.target.id;
   console.log(itemId);
   var itemIndex = itemId.replace("delete-", "");
   var itemToDelete = document.getElementById("todo-box-" + itemIndex);

   if (itemToDelete) {
      itemToDelete.remove();
      itemCount--;

      var itemsToStore = [];
      var todoItems = document.querySelectorAll(".to-do-item-name");
      todoItems.forEach(function (item) {
         itemsToStore.push(item.textContent);
      });
      sessionStorage.setItem("todoItems", JSON.stringify(itemsToStore));
   }
}

function addItem() {
   var toDoText = addText.value;
   if (toDoText.trim() !== "") {
      addItemToDOM(toDoText);

      storedItems.push(toDoText);
      sessionStorage.setItem("todoItems", JSON.stringify(storedItems));

      addText.value = "";
   }
}

function deleteAllItems() {
   todoBox.innerHTML = "";
   itemCount = 0;

   sessionStorage.removeItem("todoItems");
}

addButton.addEventListener("click", addItem);
allDeleteButton.addEventListener("click", deleteAllItems);
todoBox.addEventListener("click", deleteItem);
