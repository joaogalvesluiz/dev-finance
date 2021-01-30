const Modal = {
  open(){
    // Abrir Modal
    // adicionar a class active do modal
    document.querySelector('.modal-overlay').classList.add('active');
  },
  close(){
    //Fechar Modal
    //remover a class active do modal
    document.querySelector('.modal-overlay').classList.remove('active');
  }
}

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
  },

  set(transactions) {

    localStorage.setItem("dev.finances:transactions",
    JSON.stringify(transactions))
  }
};


const Transaction = {
  all: Storage.get(),
  
  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },

  incomes() {
    let income = 0;
    Transaction.all.forEach(transaction => {
      if (transaction.amount > 0 ) {
        income += transaction.amount; 
      }
    });
    return income;
  },

  expenses() {
    let expense = 0;
    Transaction.all.forEach(transaction => {
      if(transaction.amount < 0) {
        expense += transaction.amount; 
      }
    });
    return expense;
  },

  total() {
    return Transaction.incomes() + Transaction.expenses();
  },

  remove(index) {
    Transaction.all.splice(index, 1);
    App.reload();
  }
};

const DOM = {

  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclas = transaction.amount > 0 ? "income" : "expensive";
    const amount = Utils.formatCurrency(transaction.amount);
    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSclas}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td><img onclick="Transaction.remove(${index})" src="./assets/images/minus.svg" alt="Menos" /></td>
    `;

    return html;
  },

  updateBalance() {
    document.querySelector('#expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses());
    document.querySelector('#incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes());
    document.querySelector('#totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total());
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = "";
  }

};

const Utils = {

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";
    value = String(value).replace(/\D/g, "");
    value = Number(value) / 100;
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
    return signal + value;
  },

  formatAmount(value) {
    value = Number(value.replace(/\,\./g, "")) * 100;
    
    return value;
  },

  formatDate(date) {
    const splittedDate = date.split("-")
    return ` ${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]} `;
  }

};


const Form = {

  description: document.querySelector("#description"),
  amount: document.querySelector("#amount"),
  date: document.querySelector("#date"),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateFields() {
    const { description, amount, date } = Form.getValues();

    if (description.trim() === "" || amount.trim() === "" || date.trim() === "" ) {
    
      throw new Error("Por favor, preencha todos os campos.");
    
    } 

  },
    
  formatValues() {

    let { description, amount, date } = Form.getValues();
    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);
   
    return {
      description,
      amount,
      date
    }
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },
 
  submit(event) {

    event.preventDefault();

    try {

      // verify if all informations was completed
      Form.validateFields();
      // format the data for saving
      const transaction = Form.formatValues();
      // save
      Transaction.add(transaction);
      // delete data from Form
      Form.clearFields();
      // close modal
      Modal.close();


    } catch(error) {
      alert(error.message);
    } 


  }

};


//Initialilze and Update
const App = {
  init() {

    // Transaction.all.forEach((transaction, index) => {
    //   (transaction, index)
    // });

    Transaction.all.forEach(DOM.addTransaction);

    DOM.updateBalance();

    Storage.set(Transaction.all);

  },

  reload() {
    DOM.clearTransactions();
    App.init();
  },
};

App.init()
