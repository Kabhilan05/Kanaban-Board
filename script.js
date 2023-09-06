let addbtn = document.querySelector(".add");
let removebtn = document.querySelector(".remove");
let modelcontent = document.querySelector(".model-content");
let maincontent = document.querySelector(".main-content");
let textareacont = document.querySelector(".textAre-content");
let allprioritycolors = document.querySelectorAll(".priorty-color");
let helpAlert = document.querySelector(".help")

let colorsArray = ["red", "green", "blue", "black"];

let toolboxColors = document.querySelectorAll(".color");

let addtaskflag = false;
let removetaskflag = false;
let modalPrioritycolor = colorsArray[colorsArray.length - 1];
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let ticketArr = [];
//!Help Alert
helpAlert.addEventListener("click",()=>{
  alert("1. Click The + Button to add The Ticket"+"\n"+"2. Type the Required task and press SHIFT+ENTER to create a ticket select the Color to Gropu it"+"\n"+"3. In Ticket Click on the Color arear To chage the color "+"\n"+"4. Click on the lock button to Edit the content"+"\n"+"5. Once the Editing on ticket is completed click on it to lock the content "+"\n"+"6. Click on the colors in the top to Filter the tickets based on colors" +"\n"+"7. Click on the Delete Button to Activate Delete and click on the Ticket to delet it again Click on the Button to Deactivate it")

})
//! Add task button action

addbtn.addEventListener("click", function () {
  addtaskflag = !addtaskflag;

  if (addtaskflag == true) {
    modelcontent.style.display = "flex";
    addbtn.style.color = "lightgreen";
  } else {
    modelcontent.style.display = "none";
    addbtn.style.color = "black";
  }
});

//! Remove Button Action
removebtn.addEventListener("click", function () {
  removetaskflag = !removetaskflag;
  if (removetaskflag == true) {
    alert("The Delete Button has been activated");
    removebtn.style.color = "red";
  } else {
    removebtn.style.color = "black";
  }
});

function handleRemove(ticket, id) {
  ticket.addEventListener("click", function () {
    if (!removetaskflag) return;

    let idx = getTicketIdx(id);

    ticket.remove();

    let deletElement = ticketArr.splice(idx, 1);

    localStorage.setItem("tickets", JSON.stringify(ticketArr));
  });
}

//! seleting color from our task

allprioritycolors.forEach(function (colorelem) {
  colorelem.addEventListener("click", function () {
    allprioritycolors.forEach(function (priorityColorElem) {
      priorityColorElem.classList.remove("active");
    });
    colorelem.classList.add("active");
    modalPrioritycolor = colorelem.classList[1];
  });
});

// //! Creating a Ticket

modelcontent.addEventListener("keydown", function (e) {
  let key = e.key;

  if (key === "Shift") {
    createTicket(modalPrioritycolor, textareacont.value);
    modelcontent.style.display = "none";
    addbtn.style.color = "black";
    textareacont.value = "";
  }
});

function createTicket(ticketColor, ticketTask, ticketId) {
  let id = ticketId || shortid();
  let ticketcont = document.createElement("div");
  ticketcont.setAttribute("class", "ticket-content");
  ticketcont.innerHTML = `<div class="taskcolor ${ticketColor}"></div>
    <div class="ticketid">${id}</div>
    <div class="taskarea" contenteditable="false">${ticketTask}</div>
     <div class="ticket-lock"><i class="fa-sharp fa-solid fa-lock"></i></div>`;

  maincontent.appendChild(ticketcont);

  if (!ticketId) {
    ticketArr.push({ ticketColor, ticketTask, ticketId: id });
    localStorage.setItem("tickets", JSON.stringify(ticketArr));
  }

  handleRemove(ticketcont, id);
  hadlelock(ticketcont, id);
  handleColor(ticketcont, id);
}

//! Lock Mechanism

function hadlelock(ticket, id) {
  let ticketlockElement = ticket.querySelector(".ticket-lock");
  let ticketLockIcon = ticketlockElement.children[0];
  let ticketTaskArea = ticket.querySelector(".taskarea");

  ticketLockIcon.addEventListener("click", function () {
    let ticketidx = getTicketIdx(id);
    if (ticketLockIcon.classList.contains(lockClass)) {
      ticketLockIcon.classList.remove(lockClass);
      ticketLockIcon.classList.add(unlockClass);
      ticketTaskArea.setAttribute("contenteditable", "true");
    } else {
      ticketLockIcon.classList.remove(unlockClass);
      ticketLockIcon.classList.add(lockClass);
      ticketTaskArea.setAttribute("contenteditable", "false");
    }
    ticketArr[ticketidx].ticketTask = ticketTaskArea.innerText;
    localStorage.setItem("tickets", JSON.stringify(ticketArr));
  });
}

//! Handling Color

function handleColor(ticket, id) {
  let ticketcolorBand = ticket.querySelector(".taskcolor");
  ticketcolorBand.addEventListener("click", function () {
    let ticketIdx = getTicketIdx(id);
    let currentcolor = ticketcolorBand.classList[1];
    let currentcolorIdx = colorsArray.findIndex(function (color) {
      return currentcolor === color;
    });

    currentcolorIdx++;
    let newticketidx = currentcolorIdx % colorsArray.length;
    let newcolor = colorsArray[newticketidx];
    ticketcolorBand.classList.remove(currentcolor);
    ticketcolorBand.classList.add(newcolor);

    ticketArr[ticketIdx].ticketColor = newcolor;
    localStorage.setItem("tickets", JSON.stringify(ticketArr));
  });
}

//! Making task Visible according to color

for (let i = 0; i < toolboxColors.length; i++) {
  toolboxColors[i].addEventListener("click", function () {
    let selectedToolboxcolor = toolboxColors[i].classList[0];

    let filtertickes = ticketArr.filter(function (ticket) {
      return selectedToolboxcolor === ticket.ticketColor;
    });

    let allTickets = document.querySelectorAll(".ticket-content");

    for (let i = 0; i < allTickets.length; i++) {
      allTickets[i].remove();
    }

    filtertickes.forEach(function (filterticke) {
      createTicket(
        filterticke.ticketColor,
        filterticke.ticketTask,
        filterticke.ticketId
      );
    });
  });

  toolboxColors[i].addEventListener("dblclick", function () {
    let allTickets = document.querySelectorAll(".ticket-content");

    for (let i = 0; i < allTickets.length; i++) {
      allTickets[i].remove();
    }

    ticketArr.forEach(function (ticketObj) {
      createTicket(
        ticketObj.ticketColor,
        ticketObj.ticketTask,
        ticketObj.ticketId
      );
    });
  });
}

//! LocalStorage

if (localStorage.getItem("tickets")) {
  ticketArr = JSON.parse(localStorage.getItem("tickets"));
  ticketArr.forEach(function (ticket) {
    createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketId);
  });
}

//! getting ticketindx

function getTicketIdx(id) {
  let ticketIdx = ticketArr.findIndex(function (ticketObj) {
    return ticketObj.ticketId === id;
  });

  return ticketIdx;
}
