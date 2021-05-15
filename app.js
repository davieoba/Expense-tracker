class App {
  #btn = document.querySelector(".container__btn");
  #timeFrame = document.querySelector(".time-frame");
  #totalBudget = document.querySelector(".total__budget");
  #incomeValue = document.querySelector(".income__value");
  #expenseValue = document.querySelector(".expense__value");
  #selectValue = document.querySelector(".container__select");
  #descValue = document.querySelector(".container__desc");
  #inputValue = document.querySelector(".container__value");
  #body = document.querySelector("body");
  #incomeItems = document.querySelector(".income__items");
  #expenseItems = document.querySelector(".expense__items");
  #addContainer = document.querySelector(".container__add");

  #months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  constructor() {
    this.renderTime();
    this.setupEventListeners();
    this.data = {
      allItems: {
        inc: [],
        exp: [],
      },
      totals: {
        inc: 0,
        exp: 0,
      },
      budget: 0,
    };
    this.#descValue.focus();
  }

  setupEventListeners() {
    this.#btn.addEventListener("click", this.ctrlAddItem.bind(this));
    this.#body.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.ctrlAddItem();
      }
    });
    this.#incomeItems.addEventListener("click", (e) => {
      if (e.target.classList.contains("icon-minus")) {
        // console.log(e.target.parentNode.parentNode.parentNode);
        this.ctrlDeleteItem(e.target.parentNode.parentNode.parentNode);
      }
    });
    this.#expenseItems.addEventListener("click", (e) => {
      if (e.target.classList.contains("icon-minus")) {
        // console.log(e.target.parentNode.parentNode.parentNode);
        this.ctrlDeleteItem(e.target.parentNode.parentNode.parentNode);
      }
    });
  }

  getInput() {
    const desc = this.#descValue.value;
    const select = this.#selectValue.value;
    const value = this.#inputValue.value;
    return {
      desc,
      select,
      value,
    };
  }

  ctrlAddItem() {
    // get the field data
    const inputData = this.getInput();

    // focus on the description input
    this.#descValue.focus();

    // check if the data is correct then
    if (
      inputData.desc === "" ||
      isNaN(inputData.value) ||
      inputData.value <= 0
    ) {
      return;
    }

    // add the item to the data controller
    let ID;
    if (this.data.allItems[inputData.select].length === 0) {
      ID = 0;
    } else {
      ID =
        this.data.allItems[inputData.select][
          this.data.allItems[inputData.select].length - 1
        ].id + 1;
    }
    const newData = { id: ID, desc: inputData.desc, value: inputData.value };
    this.data.allItems[inputData.select].push(newData);

    // add the new item to the user interface
    this.render(newData, inputData.select); // note 😃

    // note: moving income into the data
    this.calcBudget();

    // note: display the budget, income and expense
    this.renderBudget();
    // clear the fields
    this.clearInput();

    // return the input data
    return inputData;
  }

  ctrlDeleteItem(element) {
    const info = element.id.split("-");
    // get the id of the element to be deleted
    const ID = parseInt(info[1]);
    // get the type of the element either it is (inc or exp)
    const type = info[0];
    // use the element to find the item and delete from the DOM
    element.remove();
    // use the id to find the element in the data structure and delete the item
    // note this is where I stopped😃
    const del = this.data.allItems[type].findIndex((el) => {
      return el.id === ID;
    });
    this.data.allItems[type].splice(del, 1);
    // do the calculations for the budget, income and expenses all over again note I can simply call the class I created earlier 😉
    this.calcBudget();
    // render the new budget
    this.renderBudget();
  }

  render(data, type) {
    let html;
    if (type === "inc") {
      html = `<div class="income__item" id='inc-${data.id}'>
                     <div class="income__item--desc">
                       <div>${data.desc}</div>
                     </div>
                     <div class="income__item--value">
                       <span class="money"> ${data.value} </span>
                       <span class="money__delete">
                         <svg class="icon icon-minus">
                           <use xlink:href="symbol-defs.svg#icon-minus"></use>
                         </svg>
                       </span>
                     </div>
                   </div>
               `;
    } else if (type === "exp") {
      html = `<div class="expense__item" id="exp-${data.id}">
                <div class="expense__item--desc">
                  <div>${data.desc}</div>
                </div>
                <div class="expense__item--value">
                  <span class="money"> ${data.value} </span>
                  <span class="money__delete">
                    <svg class="icon icon-minus">
                      <use xlink:href="symbol-defs.svg#icon-minus"></use>
                    </svg>
                  </span>
                </div>
              </div>`;
    }

    if (type === "inc") {
      this.#incomeItems.insertAdjacentHTML("beforeend", html);
    } else if (type === "exp") {
      this.#expenseItems.insertAdjacentHTML("beforeend", html);
    }
  }

  calcBudget() {
    let income = 0;
    let expense = 0;

    this.data.allItems["inc"].forEach((el) => {
      income += parseInt(el.value);
    });

    this.data.allItems["exp"].forEach((el) => {
      expense += parseInt(el.value);
    });

    this.data.totals.inc = income;
    this.data.totals.exp = expense;

    this.data.budget = this.data.totals.inc - this.data.totals.exp;
  }

  renderBudget() {
    this.#totalBudget.textContent = this.data.budget;
    this.#expenseValue.textContent = this.data.totals.exp;
    this.#incomeValue.textContent = this.data.totals.inc;
  }

  renderTime() {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const mnth = this.#months[month];

    this.#timeFrame.textContent = `${mnth}, ${year}`;
  }

  clearInput() {
    // code
    const inputs = this.#addContainer.querySelectorAll("input");
    // console.log(inputs);
    inputs.forEach((el) => {
      el.value = "";
    });
  }
}

const app = new App();
