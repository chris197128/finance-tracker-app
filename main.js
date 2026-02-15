//Calls backend to add a new category
async function addCategory(catName) {
    const res = await fetch("http://localhost:3000/categories", {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify({catName})
    });

    if(!res.ok) {
        throw new Error("failed to add category");
    }

    return await res.json();
   

}

//Calls backend to return all transactions
async function getAllTransactions(){
    const res = await fetch("http://localhost:3000/transactions");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json(); 
    return data;
}

//calls backend to return a specific transaction given its id
async function getTransactionById(id){
    const res = await fetch(`http://localhost:3000/transactions/${id}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json(); 
    return data;
}

//calls backend to return list of categories
async function getAllCategories(){
    const res = await fetch("http://localhost:3000/categories");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json(); 
    return data;
}

//calls backend to add a new transaction
async function submitTransaction() {
   
    
    const amount = document.getElementById("incomeSelector").classList.contains("selected-button") ?  parseFloat(document.getElementById("amount").value) : -parseFloat(document.getElementById("amount").value);
    const description = document.getElementById("description").value;
    const categorySelect = document.getElementById("category").value;
    let category_id;
    const newCat = document.getElementById("new-category").value;
    let result;


    if(String(newCat) === ""){
        category_id =  parseInt(categorySelect);
        console.log(category_id);
    }
    else{

        result = await addCategory(String(newCat));
        category_id = result.id;
        console.log(category_id);
    }
    
    const date = document.getElementById("date").value;
   

try{
        const res = await fetch("http://localhost:3000/transactions", {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify({amount, category_id, description, date})
        });

        const text = await res.json();



        
        if(text.success) {
            console.log("Transaction added:", text.id);

            modal.style.display = "none";

            clearCards();
            displayAllCards(await getAllTransactions());
        }else {
            console.error("Failed to add transaction:", text.error);
        }
    } catch(err) {
        console.error("Error submitting transation:", err);
    }

}

//calls backend to remove a transaction
async function deleteTransaction(id) {
    
    try{
        const res = await fetch(`http://localhost:3000/transactions/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            throw new Error(`HTTP error ${res.status}`);
        }

        const text = await res.json();



        
        if(text.success) {
            console.log("Transaction deleted");

            editModal.style.display = "none";
            
            clearCards();

            displayAllCards(await getAllTransactions());

        }else {
            console.error("Failed to add transaction:", text.error);
        }
    } catch(err) {
        console.error("Error submitting transation:", err);
    }
}

//calls backend to edit a transaction
async function editTransaction(id) {
    const amount = document.getElementById("incomeEditSelector").classList.contains("selected-button") ?  parseFloat(document.getElementById("editAmount").value) : -parseFloat(document.getElementById("editAmount").value);
    const description = document.getElementById("editDescription").value;
    const categorySelect = document.getElementById("editCategory").value;
    let category_id = parseInt(categorySelect);
    let result;
    const newCat = document.getElementById("editNewCategory").value;
    const date = document.getElementById("editDate").value;
    console.log(id);
    
    if(String(newCat) !== ""){
        result = await addCategory(String(newCat));
        category_id = result.id;

    }


    try{
        const res = await fetch(`http://localhost:3000/transactions/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify({amount, category_id, description, date})
        });

        const text = await res.json();



        
        if(text.success) {

            editModal.style.display = "none";

            clearCards();
            displayAllCards(await getAllTransactions());
        }else {
            console.error("Failed to edit transaction:", text.error);
        }
    } catch(err) {
        console.error("Error editing transation:", err);
    }
}

//displays an individual transaction card
function addCard(transaction){
    const container = document.querySelector('.transaction-container');

    const card = document.createElement('div');
    card.classList.add('transaction-card');


    //convert value returned from sql to number
    const amount = Number(transaction.amount);

    //convert date to correct length string
    const date = transaction.date.slice(0,10);

    if (amount >= 0) {
        card.classList.add('income');
    } else {
        card.classList.add('expense');
    }

    card.innerHTML = `
        <div class="top-row">
            <span class="category">${transaction.category}</span>
            <span class="date">${date}</span>
        </div>
        <div class="description">${transaction.description}</div>
        <div class="bottom-row">
            <span class="amount">${(amount >= 0) ? '+' : '-'} $${(amount < 0) ? (-1*amount).toFixed(2) : amount.toFixed(2)}</span>
            <button class="edit-btn" data-id="` + transaction.id + `">Edit</button>
        </div>
    `;

    container.appendChild(card);

}

//clears all transaction cards from the display
function clearCards(){
    const cards = document.getElementsByClassName("transaction-card");
       
    
    while(cards.length> 0){
        cards[0].remove();
    }


}

//opens modal to edit a transaction
async function openEditModal(transactionId) {
    

    const transaction = await getTransactionById(transactionId);
    document.getElementById("editTransactionModal").querySelector("form").reset();

    if(transaction.amount < 0){
        document.getElementById("incomeEditSelector").classList.remove('selected-button');
        document.getElementById("expenseEditSelector").classList.add('selected-button');
        document.getElementById("editAmount").value = -transaction.amount;
    }
    else{
        document.getElementById("incomeEditSelector").classList.add('selected-button');
        document.getElementById("expenseEditSelector").classList.remove('selected-button');
        document.getElementById("editAmount").value = transaction.amount;
    }

    await populateCategorySelector(true);

    document.getElementById("editDescription").value = transaction.description;
    document.getElementById("editCategory").value = String(transaction.category_id);
    document.getElementById("editDate").value = String(transaction.date).slice(0, 10);

    document.getElementById("editTransactionModal").style.display = "flex";
    
}

//calls addCard to display all the transaction cards
function displayAllCards(arr){
    for(let i = 0; i < arr.length; ++i){
        addCard(arr[i]);
    }
}



//Displays all category options in the category selector
//isEdit == true if for the transaction modal used for editing, false if for modal used for a new transation
async function populateCategorySelector(isEdit) {
    
    const select = isEdit? document.getElementById("editCategory") : document.getElementById("category");
  

    try{
        const categories = await getAllCategories();

        select.innerHTML = "";

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "-- Select Category --";
        placeholder.disabled = true;
        placeholder.selected = true;
        select.appendChild(placeholder);

        for(let i = 0; i < categories.length; ++i){
            const option = document.createElement("option");
            option.value = categories[i].id;
            option.textContent = categories[i].name;
            select.appendChild(option);
        }
      


    }catch(err) {
        console.error("Failed to load categories:", err);
    }


}

//displays all transactions upon load
const transactions = await getAllTransactions();
displayAllCards(transactions);




// Get elements from html
const addBtn = document.getElementById("add-transaction-btn");
const modal = document.getElementById("transaction-modal");
const closeModal = document.getElementById("close-modal");
const expenseSelector = document.getElementById("expenseSelector");
const incomeSelector = document.getElementById("incomeSelector");
const amountInput = document.getElementById("amount");
const newCategory = document.getElementById("new-category");
const categorySelect = document.getElementById("category");
const submitAddBtn = document.getElementById("submitAddTrans");

//get elements for the transaction edit modal
const editModal = document.getElementById("editTransactionModal");
const closeEditModal = document.getElementById("closeEditModal");
const expenseEditSelector = document.getElementById("expenseEditSelector");
const incomeEditSelector = document.getElementById("incomeEditSelector");
const editAmountInput = document.getElementById("editAmount"); 
const deleteTransModal = document.getElementById("deleteTrans");
const submitEditTrans = document.getElementById("submitEditTrans");
const editNewCategory = document.getElementById("editNewCategory");
const editCategorySelect = document.getElementById("editCategory");


// Open modal
addBtn.addEventListener("click", () => {
    modal.querySelector("form").reset();
    incomeSelector.classList.remove('selected-button');
    expenseSelector.classList.add('selected-button');
    modal.style.display = "flex"; // using flex to center
    populateCategorySelector(false);
    
    
});


//income or expense selectors
incomeSelector.addEventListener("click", () => {
    incomeSelector.classList.add('selected-button');
    expenseSelector.classList.remove('selected-button');
});

expenseSelector.addEventListener("click", () => {
    incomeSelector.classList.remove('selected-button');
    expenseSelector.classList.add('selected-button');
});

//prevents negative amounts from being entered
amountInput.addEventListener("input", () => {
  if (amountInput.value < 0) {
    amountInput.value = Math.abs(amountInput.value);
  }
});


//clears category selector if adding a new category
newCategory.addEventListener("input", () => {
    categorySelect.value = "";

    
});

//clears new category input if selecting an existing category
categorySelect.addEventListener("input", () => {
    newCategory.value = newCategory.defaultValue;
});



// Close modal when X clicked
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close modal when clicking outside content
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});


//add the transaction
submitAddBtn.addEventListener("click", async (e) => {
    
    e.preventDefault();
    await submitTransaction();
    

});


//edit transaction button to open modal
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
        const id = e.target.dataset.id;
        deleteTransModal.dataset.id = id;        
        openEditModal(id);
    }
});

//selects income or expense for the edit transaction modal
incomeEditSelector.addEventListener("click", () => {
    incomeEditSelector.classList.add('selected-button');
    expenseEditSelector.classList.remove('selected-button');
});

expenseEditSelector.addEventListener("click", () => {
    incomeEditSelector.classList.remove('selected-button');
    expenseEditSelector.classList.add('selected-button');
    console.log("edit clicked");
});

//prevents negative values
editAmountInput.addEventListener("input", () => {
  if (editAmountInput.value < 0) {
    editAmountInput.value = Math.abs(editAmountInput.value);
  }
});

//clears category selector if adding a new category
editNewCategory.addEventListener("input", () => {
    editCategorySelect.value = "";
});

//clears new category input if selecting an existing category
editCategorySelect.addEventListener("input", () => {
    editNewCategory.value = editNewCategory.defaultValue;
});

// Close modal when X clicked
closeEditModal.addEventListener("click", () => {
    editModal.style.display = "none";
});

// Close modal when clicking outside content
window.addEventListener("click", (e) => {
  if (e.target === editModal) {
    editModal.style.display = "none";
  }
});

//Delete Transaction when delete pressed

deleteTransModal.addEventListener("click", async () => {
    const id = deleteTransModal.dataset.id;
    await deleteTransaction(id);
});

//sub,it edit transaction form
submitEditTrans.addEventListener("click", async () => {
    const id = deleteTransModal.dataset.id;
    await editTransaction(id);
});


