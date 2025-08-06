const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// accessing dropdown menus with currency options from countryList
for (let select of dropdowns) {
  for (let currCode in countryList) {
    // Creating a new option element for each currency
    let newOption = document.createElement("option");
    newOption.innerText = currCode; //it Displays currency code
    newOption.value = currCode; // it Sets value to currency code

    //here the default codes are set
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "NPR") {
      newOption.selected = "selected";
    }
    // Adding the option to the dropdown
    select.append(newOption);
  }

  // event listener to update flag image when currency selection changes
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// it fetches and update the exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input"); //taking input
  let amtVal = parseFloat(amount.value); //converting into floatvalue

  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amount.value = "1"; // Update input field to reflect default value
  }
  // making api url to fetch rates for the 'from' currency
  const URL = `${BASE_URL}/${fromCurr.value}`;
  try {
    let response = await fetch(URL);
    if (!response.ok) throw new Error("Failed to fetch exchange rates");
    let data = await response.json();
    let rate = data.rates[toCurr.value];

    // Calculate the converted amount
    let finalAmount = amtVal * rate;
    // Update the message with the conversion result to 2 decimal places
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${
      toCurr.value
    }`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rates";
    console.error(error);
  }
};

// update the flag image when a currency is selected
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode]; //country code
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`; //flag image
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault(); //no page reload
  updateExchangeRate(); // Call function to fetch and display conversion
});

// Run the exchange rate update when the page loads
window.addEventListener("load", () => {
  updateExchangeRate();
});
