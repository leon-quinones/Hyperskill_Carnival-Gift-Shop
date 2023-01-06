const input = require('sync-input');

function displayGiftList(machineStateProps) {
  console.log("Here's the list of gifts:\n");
  let availableGifts = machineStateProps.availableGifts;
  if (Object.keys(availableGifts).length == 0) {
    console.log('Wow! There are no gifts to buy.');
  } else {
    for (let key in availableGifts) {
      console.log(
          `${key}- ${availableGifts[key].name}, Cost: ${availableGifts[key].price} tickets`
      );
    }
  }
}

function buyGift(machineStateProps) {
  if (Object.keys(machineStateProps.availableGifts).length == 0){
    console.log('Wow! There are no gifts to buy.');
    return 10
  }  
  let giftIdSelected = Number(input('Enter the number of the gift you want to get: '));
  if (isNaN(giftIdSelected)) {
    console.log('Please enter a valid number!');
    return 0;
  }
  if (!Object.keys(machineStateProps.availableGifts).includes(String(giftIdSelected))) {
    //throw "Error: gift id doesn't exist";
    console.log('There is no gift with that number!');
    return 1;
  }
  if (machineStateProps.currentUser.ticketsNumber < machineStateProps.availableGifts[giftIdSelected].price){
    console.log("You don't have enough tickets to buy this gift.");
    return 2;
  }
  console.log(
      `Here you go, one ${machineStateProps.availableGifts[giftIdSelected].name}!`
  );
  machineStateProps.currentUser.ticketsNumber -= machineStateProps.availableGifts[giftIdSelected].price;
  delete machineStateProps.availableGifts[giftIdSelected];
  checkAccountTickets(machineStateProps);
}

function addTicketToAccount(machineStateProps) {
  let minAmount = 0;
  let maxAmount = 1000;
  let amountOfTickets = Number(input('Enter the ticket amount: '));
  if (isNaN(amountOfTickets)) {
    console.log('Please enter a valid number between 0 and 1000.');
    return 3; // just an escape code for further logging functionality
  }
  if (amountOfTickets < minAmount || amountOfTickets > maxAmount ) {
    console.log('Please enter a valid number between 0 and 1000.');
    return 4;
  }
  machineStateProps.currentUser.ticketsNumber += Number(amountOfTickets);
  checkAccountTickets(machineStateProps);
}

function checkAccountTickets(machineStateProps) {
  console.log(`Total tickets: ${machineStateProps.currentUser.ticketsNumber}`);
}

function createUserInpuntMessage(vendingOptions) {
  let inputMessage = '';
  for (let key in vendingOptions) {
    inputMessage =
        inputMessage + `${vendingOptions[key].id}-${vendingOptions[key].name} `;
  }

  return inputMessage.slice(0, inputMessage.length - 1) + '\n';
}

function logOffMachine(machineProps){
  machineProps.currentUser.isLogged = false;
}

function carnivalGiftsShopMachine() {
  let vendingOptions = [
    { id: '1', name: 'Buy a gift', action: buyGift },
    { id: '2', name: 'Add tickets', action: addTicketToAccount },
    { id: '3', name: 'Check tickets', action: checkAccountTickets },
    { id: '4', name: 'Show gifts', action: displayGiftList },
    { id: '5', name: 'Exit the shop', action: logOffMachine }];

  let supportedGifts = {
    1:  { name: 'Teddy Bear', price: 10 },
    2:  { name: 'Big Red Ball', price: 5 },
    3:  { name: 'Huge Bear', price: 50 },
    4:  { name: 'Candy', price: 8 },
    5:  { name: 'Stuffed Tiger', price: 15 },
    6:  { name: 'Stuffed Dragon', price: 30 },
    7:  { name: 'Skateboard', price: 100 },
    8:  { name: 'Toy Car', price: 25 },
    9:  { name: 'Basketball', price: 20 },
    10: { name: 'Scary Mask', price: 75 },
  };

  let userAccount = {
    name: 'User_Name',
    ticketsNumber: 0,
    isLogged: true,
  }

  let soldGiftsId = [];

  let machineStateProps = {
    optionsPanel: vendingOptions,
    availableGifts:  supportedGifts,
    soldOutGifts: soldGiftsId,
    currentUser: userAccount,
  }

  let inputMessage = createUserInpuntMessage(vendingOptions);

  console.log(`WELCOME TO THE CARNIVAL GIFT SHOP!
Hello friend! Thank you for visiting the carnival!`);
  displayGiftList(machineStateProps);
  do {
    console.log();
    console.log('What do you want to do?');
    let userOption = input(inputMessage);
    if (vendingOptions.findIndex((option) => option.id === userOption) === -1) {
      console.log('Please enter a valid number!');
      continue;
    }
    vendingOptions[Number(userOption) - 1].action(machineStateProps);
  } while(machineStateProps.currentUser.isLogged);
  return 'Have a nice day!';
}
console.log(carnivalGiftsShopMachine());
