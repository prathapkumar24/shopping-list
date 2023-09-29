const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const filterInput = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

function displayItems() {
  const storageItems = getItemsFromStorage();
  storageItems.forEach((item) => addItemtoDOM(item));
  checkUI();
}

function addItem(e) {
  e.preventDefault();
  const newItem = itemInput.value.trim();
  console.log(newItem);
  if (newItem === "") {
    alert("Please add an item");
    return;
  }
  if (isEditMode) {
    const editItem = document.querySelector(".edit-mode");
    editItem.remove();
    removeItemFromStorage(editItem.textContent);
  } else {
    if (checkItemExists(newItem)) {
      alert("This item already exist");
      return;
    }
  }
  //Add item to DOM element
  addItemtoDOM(newItem);

  //add item to localstorage
  addItemtoStorage(newItem);

  checkUI();
}

function addItemtoDOM(item) {
  const listItem = document.createElement("li");
  listItem.appendChild(document.createTextNode(item));
  const button = createButton("remove-item btn-link text-red");
  listItem.appendChild(button);
  itemList.appendChild(listItem);
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;

  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function addItemtoStorage(item) {
  const storageItems = getItemsFromStorage();
  storageItems.push(item);
  localStorage.setItem("items", JSON.stringify(storageItems));
}

function getItemsFromStorage() {
  let storageItems;
  if (localStorage.getItem("items") === null) {
    storageItems = [];
  } else {
    storageItems = JSON.parse(localStorage.getItem("items"));
  }
  return storageItems;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else if (e.target.closest("li")) {
    setItemToEdit(e.target);
  }
}

function checkItemExists(item) {
  const storageItems = getItemsFromStorage();
  return storageItems.includes(item);
}
function setItemToEdit(item) {
  isEditMode = true;

  itemList.querySelectorAll("li").forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
  formBtn.style.backgroundColor = "#228B22";
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm("Are you sure?")) {
    item.remove();
    removeItemFromStorage(item.textContent);
    checkUI();
  }
}

function removeItemFromStorage(item) {
  let storageItems = getItemsFromStorage();
  storageItems = storageItems.filter((i) => i !== item);
  localStorage.setItem("items", JSON.stringify(storageItems));
  checkUI();
}
function clearItems() {
  if (confirm("Are you sure?")) {
    while (itemList.firstElementChild) {
      itemList.firstElementChild.remove();
    }

    //clear from local storage
    localStorage.removeItem("items");
    checkUI();
  }
}

function checkUI() {
  itemInput.value = "";
  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    clearBtn.style.display = "none";
    filterInput.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    filterInput.style.display = "block";
  }
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";
  isEditMode = false;
}

function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll("li");
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) !== -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function init() {
  itemForm.addEventListener("submit", addItem);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearItems);
  filterInput.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);
  checkUI();
}

init();
