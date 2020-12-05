let modalAccout = 1;
const $_ = (element) => document.querySelector(element); //documento.querySelector
const $_All = (element) => document.querySelectorAll(element); //documento.querySelector
const $_Id = (element) => document.getElementById(element); //documento.querySelector

//variables globals
let modalKey = 0;
let cart = [];

//listagens pizza
pizzaJson.map((value, key) => {
  let pizzaClass = $_(".models .pizza-item").cloneNode(true);

  pizzaClass.setAttribute("data-key", key);
  pizzaClass.querySelector(".pizza-item--img img").src = value.img;
  pizzaClass.querySelector(".pizza-item--name").innerHTML = value.name;
  pizzaClass.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$ ${value.price.toFixed(2)}`;
  pizzaClass.querySelector(".pizza-item--desc").innerHTML = value.description;

  pizzaClass.querySelector("a").addEventListener("click", (event) => {
    event.preventDefault();
    let key = event.target.closest(".pizza-item").getAttribute("data-key");
    modalKey = key;
    modalAccout = 1;

    $_(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    $_(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    $_(".pizzaBig img").src = pizzaJson[key].img;
    $_(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[
      key
    ].price.toFixed(2)}`;

    $_(".pizzaInfo--size.selected").classList.remove("selected");
    $_All(".pizzaInfo--size").forEach((value, index) => {
      if (index == 2) {
        value.classList.add("selected");
      }
      value.querySelector("span").innerHTML = pizzaJson[key].sizes[index];
    });

    $_(".pizzaInfo--qt").innerHTML = modalAccout;

    $_(".pizzaWindowArea").style.opacity = 0.5;
    $_(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      $_(".pizzaWindowArea").style.opacity = 1;
    }, 200);
    $_(".pizzaInfo--cancelButton").classList.add("none");
  });

  $_(".pizza-area").append(pizzaClass);
  modalAccout = 1;
});

//events moda
function modalClose() {
  $_(".pizzaWindowArea").style.opacity = 0;

  setTimeout(() => {
    $_(".pizzaWindowArea").style.display = "none";
  }, 250);
}

$_All(".pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton").forEach(
  (itemClick) => {
    itemClick.addEventListener("click", modalClose);
  }
);
//minus pizza
$_(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalAccout > 1) {
    modalAccout--;
    $_(".pizzaInfo--qt").innerHTML = modalAccout;
  }
});
//plus pizzz
$_(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalAccout++;
  $_(".pizzaInfo--qt").innerHTML = modalAccout;
});
//selected size pizza
$_All(".pizzaInfo--size").forEach((valueSize, indexSize) => {
  valueSize.addEventListener("click", (event) => {
    $_(".pizzaInfo--size.selected").classList.remove("selected");
    valueSize.classList.add("selected");
  });
});
// add car
$_(".pizzaInfo--addButton").addEventListener("click", () => {
  //   modalAccout = 1;
  let sizePizza = $_(".pizzaInfo--size.selected").getAttribute("data-key");

  let identifyPizza = pizzaJson[modalKey].id + "@" + sizePizza;

  let key = cart.findIndex((value) => value.identifyPizza == identifyPizza);

  if (key > -1) {
    cart[key].sizeAccout += modalAccout;
  } else {
    cart.push({
      identifyPizza,
      id: pizzaJson[modalKey].id,
      size: sizePizza,
      sizeAccout: modalAccout,
    });
  }
  updateCart();
  modalClose();
});

$_(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    $_("aside").style.left = "0";
  }
});

$_(".menu-closer").addEventListener("click", () => {
  $_("aside").style.left = "100vw";
});

function updateCart() {
  $_(".menu-openner span").innerHTML = cart.length;
  if (cart.length > 0) {
    $_("aside").classList.add("show");
    $_(".cart").innerHTML = "";

    let subTotal = 0;
    let desconto = 0;
    let total = 0;

    for (let index in cart) {
      let pizzaItem = pizzaJson.find((value) => value.id == cart[index].id);
      subTotal += pizzaItem.price * cart[index].sizeAccout;

      let cartItem = $_(".models .cart--item").cloneNode(true);

      let pizzaSizeName;
      switch (cart[index].size) {
        case "0":
          pizzaSizeName = "P";
          break;
        case "1":
          pizzaSizeName = "M";
          break;
        case "2":
          pizzaSizeName = "G";
          break;
      }

      let pizzaName = `${pizzaItem.name}  (${pizzaSizeName})`;

      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(".cart--item-nome").textContent = pizzaName;
      cartItem.querySelector(".cart--item--qt").innerHTML =
        cart[index].sizeAccout;

      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[index].sizeAccout++;
          updateCart();
        });
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[index].sizeAccout > 1) {
            cart[index].sizeAccout--;
          } else {
            cart.splice(index, 1);
          }
          updateCart();
        });

      $_(".cart").append(cartItem);

      desconto = subTotal * 0.1;
      total = subTotal - desconto;

      $_(".subtotal span:last-child").innerHTML = `R$ ${subTotal.toFixed(2)}`;
      $_(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
      $_(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
    }
  } else {
    $_("aside").classList.remove("show");
    $_("aside ").style.left = '100vw'
  }
}
