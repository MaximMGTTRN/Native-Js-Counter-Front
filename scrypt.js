let shopName = "";
let spendMoney = 0;
let curentTime = new Date(Date.now())
  .toISOString()
  .substr(0, 10)
  .replaceAll("-", ".");
let allShops = [];
let newName = "";
let newTime = "";
let newPrice = 0;
let allMoney = 0;

window.onload = init = async () => {
  inputName = document.getElementById("place");
  inputMoney = document.getElementById("money");
  addButton = document.getElementById("addButton");
  inputName.addEventListener("change", newValueName);
  inputMoney.addEventListener("change", newValueMoney);
  addButton.addEventListener("click", addValue);
  const resp = await fetch("http://localhost:8000/allCards", {
    method: "GET",
  });

  let result = await resp.json();
  allShops = result.data;
  render();
};

const newValueName = (event) => {
  shopName = event.target.value;
  shopName = shopName.trim(" ");
};

const newValueMoney = (event) => {
  spendMoney = event.target.value;
  spendMoney = spendMoney.trim(" ");
};

const addValue = async (event) => {
  if (shopName === "" || spendMoney <= 0) {
    alert("Введите значение");
  } else {
    const resp = await fetch("http://localhost:8000/createCard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        name: shopName,
        money: spendMoney,
        time: curentTime,
      }),
    });

    shopName = "";
    spendMoney = 0;
    inputName.value = "";
    inputMoney.value = "";
    let result = await resp.json();
    allShops = result.data;
    render();
  }
};

const render = () => {
  allMoney = 0;
  const allCards = document.getElementById("cards");
  const total = document.getElementById("total");

  while (allCards.firstChild) {
    allCards.removeChild(allCards.firstChild);
  }

  const editName = document.createElement("input");
  allShops.map((item, index) => {
    allMoney += Number(item.money);
    const card = document.createElement("div");
    card.id = `card-${index}`;
    card.classList.add("card");
    const cardNum = document.createElement("div");
    cardNum.classList.add("card_num");
    cardNum.innerText = index + 1 + ")";
    const cardName = document.createElement("div");
    cardName.classList.add("shop_name");
    cardName.innerText = `Магазин : "${item.name}"`;
    const cardInfoBlock = document.createElement("div");
    cardInfoBlock.classList.add("info_block");
    const cardTime = document.createElement("div");
    cardTime.classList.add("time");
    cardTime.innerText = trueDate(item);
    const cardMoney = document.createElement("div");
    cardMoney.classList.add("spend_money");
    cardMoney.innerText = item.money + "Р.";
    const cardButtons = document.createElement("div");
    cardButtons.classList.add("buttons");
    const cardEdit = document.createElement("div");
    cardEdit.classList.add("editBut");
    const cardDelete = document.createElement("div");
    cardDelete.classList.add("trashBut");
    allCards.appendChild(card);
    card.appendChild(cardNum);
    card.appendChild(cardName);
    card.appendChild(cardInfoBlock);
    cardInfoBlock.appendChild(cardTime);
    cardInfoBlock.appendChild(cardMoney);
    cardInfoBlock.appendChild(cardButtons);
    cardButtons.appendChild(cardEdit);
    cardButtons.appendChild(cardDelete);
    cardName.addEventListener("dblclick", () => {
      newTime = item.time;
      newPrice = item.money;
      newName = item.name;
      const editName = document.createElement("input");
      editName.type = "text";
      editName.classList.add("shop_name-edit");
      editName.value = item.name;
      editName.addEventListener("change", updateName);
      card.replaceChild(editName, cardName);
      editName.focus();
      editName.onblur = () => okChange(item, index);
    });
    cardMoney.addEventListener("dblclick", () => {
      newTime = item.time;
      newPrice = item.money;
      newName = item.name;
      const editMoney = document.createElement("input");
      editMoney.type = "number";
      editMoney.value = item.money;
      editMoney.classList.add("money-edit");
      editMoney.addEventListener("change", updateMoney);
      cardInfoBlock.replaceChild(editMoney, cardMoney);
      editMoney.focus();
      editMoney.onblur = () => okChange(item, index);
    });
    cardTime.addEventListener("dblclick", () => {
      newTime = item.time;
      newPrice = item.money;
      newName = item.name;
      const editTime = document.createElement("input");
      editTime.type = "date";
      editTime.classList.add("time-edit");
      editTime.value = item.time.replaceAll(".", "-");
      editTime.addEventListener("change", updateTime);
      cardInfoBlock.replaceChild(editTime, cardTime);
      editTime.focus();
      editTime.onblur = () => okChange(item, index);
    });
    cardEdit.onclick = () => editClick(item, index);
    cardDelete.onclick = () => deleteClick(index);
  });

  total.innerHTML = "";
  total.innerText = `Итого: ${allMoney} р.`;
};

const trueDate = (item) =>{
  let day = item.time.slice(8, 10);
  let month = item.time.slice(5, 7);

  let year = item.time.slice(0, 4);
  let fullDate = `${day}.${month}.${year}`;
  return fullDate;
};

const editClick = (item, index) => {
  render();
  newTime = item.time;
  newPrice = item.money;
  newName = item.name;
  const cardEdit = document.getElementById(`card-${index}`);
  cardEdit.innerHTML = "";
  const editName = document.createElement("input");
  editName.type = "text";
  editName.classList.add("shop_name-edit");
  editName.value = item.name;
  editName.addEventListener("change", updateName);
  const editTime = document.createElement("input");
  editTime.type = "date";
  editTime.classList.add("time-edit");
  editTime.value = item.time.replaceAll(".", "-");
  editTime.addEventListener("change", updateTime);
  const editMoney = document.createElement("input");
  editMoney.type = "number";
  editMoney.value = item.money;
  editMoney.classList.add("money-edit");
  editMoney.addEventListener("change", updateMoney);
  const cardNum = document.createElement("div");
  cardNum.classList.add("card_num");
  cardNum.innerText = index + 1 + ")";
  const cardName = document.createElement("div");
  cardName.classList.add("shop_name");
  cardName.appendChild(editName);
  const cardInfoBlock = document.createElement("div");
  cardInfoBlock.classList.add("info_block");
  const cardTime = document.createElement("div");
  cardTime.classList.add("time");
  cardTime.appendChild(editTime);
  const cardMoney = document.createElement("div");
  cardMoney.classList.add("spend_money");
  cardMoney.appendChild(editMoney);
  const cardButtons = document.createElement("div");
  cardButtons.classList.add("buttons");
  const okBut = document.createElement("div");
  okBut.classList.add("okBut");
  const disBut = document.createElement("div");
  disBut.classList.add("disBut");
  cardEdit.appendChild(cardNum);
  cardEdit.appendChild(cardName);
  cardEdit.appendChild(cardInfoBlock);
  cardInfoBlock.appendChild(cardTime);
  cardInfoBlock.appendChild(cardMoney);
  cardInfoBlock.appendChild(cardButtons);
  cardButtons.appendChild(okBut);
  cardButtons.appendChild(disBut);
  okBut.onclick = () => okChange(item, index);
  disBut.onclick = () => render();
};

const okChange = async (item, index) => {
  if (!(newName === "" || newPrice <= 0)) {
    allShops[index] = {
      ...allShops[index],
      name: newName,
      money: newPrice,
      time: newTime,
    };
    const { _id, name, money, time } = allShops[index];
    const resp = await fetch("http://localhost:8000/changeCard", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        _id,
        name,
        money,
        time,
      }),
    });

    let result = await resp.json();
    allShops = result.data;
    render();
  } else {
    alert("Нельзя оставить тоже самое или все удалить!");
  }
};

const updateName = (event) => {
  newName = event.target.value;
  newName = newName.trim(" ");
};

const updateTime = (event) => {
  newTime = event.target.value;
  newTime = newTime.replaceAll("-", ".");
};

const updateMoney = (event) => {
  newPrice = event.target.value;
  newPrice = newPrice.trim(" ");
};

const deleteClick = async (index) => {
  const { _id } = allShops[index];
  const resp = await fetch(`http://localhost:8000/deleteCard?_id=${_id}`, {
    method: "DELETE",
  });

  let result = await resp.json();
  allShops = result.data;
  render();
};
