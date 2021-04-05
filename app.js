// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert')
const form = document.querySelector('.grocery-form')
const grocery = document.getElementById('grocery')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')
const sum = document.querySelector('.sum')
let totalCost

// edit option
let editElement;
let price
let editFlag = false
let priceFlag = false
let editID = ''
// ****** EVENT LISTENERS **********
//submit form
form.addEventListener('submit',addItem)
//clear items
clearBtn.addEventListener('click', clearItems)
//load items
window.addEventListener('DOMContentLoaded', setupItems)

// ****** FUNCTIONS **********
function addItem(e){
    e.preventDefault()
    const value = grocery.value
    const id = new Date().getTime().toString()
    if(value && !editFlag && !priceFlag){
        createListItem(id, value)
    //display Alert
    displayAlert('item added to the list', 'success')
    //show container
    container.classList.add('show-container')
    //add to local storage
    addToLocalStorage(id, value)
    //set back to default
    setBackToDefault()
    }
    else if(value && editFlag){
       editElement.innerHTML = value
       displayAlert('value changed', 'success')
       //edit local storage
       editLocalStorage(editID, value)
       setBackToDefault()
    }
    else if(value && priceFlag){
        if(value === '0'){
            price.innerHTML = ''
        
        }else{
            price.innerHTML = value + 'р'
        }
        
        
        displayAlert('price changed', 'success')
        //edit local storage
        setPriceToLocalStorage(editID, value)
        getSum()
        setBackToDefault()
    }
    else{
        displayAlert('please enter value', 'danger') 
        
    }
}

//dispaly alert function

function displayAlert(text, action){
    alert.textContent = text
    alert.classList.add(`alert-${action}`)
    setTimeout(function(){
        alert.textContent = ''
        alert.classList.remove(`alert-${action}`)
    }, 1500)
}
//clear items
function clearItems(){
   const confirm = window.confirm('Очистить корзину?')
   if(confirm){
    const items = document.querySelectorAll('.grocery-item')
    if(items.length > 0){
        items.forEach(item=>{
            list.removeChild(item)
        })
    }
    container.classList.remove('show-container')
    displayAlert('all items has been deleted', 'success')
    setBackToDefault()
    localStorage.removeItem('list')
    getSum()
   }
    
}
//delete function
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement.parentElement
    const id = element.dataset.id
    list.removeChild(element)
    if(list.children.length === 0){
        container.classList.remove('show-container')
    }
    displayAlert('item removed', 'success')
    setBackToDefault()
    //remove from local storage
    removeFromLocalStorage(id)

}
//edit function
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement.parentElement
    //set edit item
    editElement = e.currentTarget.parentElement.parentElement.previousElementSibling
    console.log(editElement);
    //set form value
    grocery.value = editElement.innerHTML
    editFlag = true
    editID = element.dataset.id
    submitBtn.textContent = 'изменить'
    grocery.focus()
    
}
//set price
function setPrice(e){
    const element = e.currentTarget.parentElement.parentElement.parentElement
    price = e.currentTarget.parentElement.previousElementSibling
    priceFlag = true
    editID = element.dataset.id
    submitBtn.textContent = 'цена'
    grocery.focus()
    
}
//set back to default
function setBackToDefault(){
    grocery.value = ''
    editFlag = false
    priceFlag = false
    editID = ''
    submitBtn.textContent = 'добавить'
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value){
    const grocery = {id, value}
    let items = getLocalStorage()
    items.push(grocery)
    localStorage.setItem('list', JSON.stringify(items))
}

function removeFromLocalStorage(id){
    let items =  getLocalStorage()
    items = items.filter(el => el.id !== id)
    localStorage.setItem('list', JSON.stringify(items))
    getSum()
}

function editLocalStorage(id, value){
    let items =  getLocalStorage()
    items = items.map(el =>{
        if(el.id === id){
            el.value = value
        }
        return el
    })
    localStorage.setItem('list', JSON.stringify(items))
}
function setPriceToLocalStorage(id, value){
    let items = getLocalStorage()
    items = items.map(el =>{
        if(el.id === id){
            el.price = value
        }
        return el
    })
    localStorage.setItem('list', JSON.stringify(items))
}

function getLocalStorage(){
 return localStorage.getItem('list') 
    ? JSON.parse(localStorage.getItem('list')) 
    : []
}
// LOCAL STORAGE API
// setItem
// getItem
// removeItem
// save as strings

// localStorage.setItem('orange', JSON.stringify(['item', 'item2']))
// const oranges = JSON.parse(localStorage.getItem('orange'))
// console.log(oranges);
// localStorage.removeItem('orange')
// ****** SETUP ITEMS **********
function getSum(){
    let items = getLocalStorage()
    totalCost = items.reduce((accum, item)=>{
        if(item.price){
            accum += Number(item.price)
        }
        return accum
    },0)

    sum.textContent = totalCost
}

function setupItems(){
    let items = getLocalStorage()
    if(items.length > 0){
        items.forEach(el =>{
            createListItem(el.id, el.value, el.price ? el.price + 'р' : '')
        })
        
        container.classList.add('show-container')
    }
    getSum()
}


  function createListItem(id, value, price = ''){
    const element = document.createElement('article')
        element.classList.add('grocery-item')
        const attribute = document.createAttribute('data-id')
        attribute.value = id
        element.setAttributeNode(attribute)
        element.innerHTML = `
        <p class="title">${value}</p>
        <div class="grocery-item-info">
        <span class="price">${price}</span>
        <div class="btn-container">
            <button type="button" class="price-btn">
                <i class="fas fa-dollar-sign"></i>
            </button>
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        </div>
        `
    const deleteBtn = element.querySelector('.delete-btn')
    const editBtn = element.querySelector('.edit-btn')
    const priceBtn = element.querySelector('.price-btn')

    deleteBtn.addEventListener('click', deleteItem)
    editBtn.addEventListener('click', editItem)
    priceBtn.addEventListener('click', setPrice)
    
    //append child
    list.appendChild(element)
  }