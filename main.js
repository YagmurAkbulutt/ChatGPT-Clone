const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeBtn = document.querySelector("#theme-btn");
const deleteBtn = document.querySelector("#delete-btn");
const defaultText = document.querySelector(".default-text");

let userText = null;

const API_KEY = "";

//HTML ELEMENTİ OLUŞTURMA
const createElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

const getChatResponse = async (incomingChatDiv) => {
  const API_URL = "";

  const pElement = document.createElement("p");

  const requestData = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: `${userText}`,
      },
    ],
  };

  //api isteği için özellik ve veri tanımlama
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(requestData),
  };

  try {
    const response = await (await fetch(API_URL, requestOptions)).json();
    pElement.textContent = response.choices[0].message.content;
  } catch (error) {
    console.log(error);
    pElement.classList.add("error");
    pElement.textContent = "Ooopppps!!!";
  }

  //yazı animasyonunu kaldırma ve apiden gelen cevabı göster ve inputu boşalt
  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
  chatInput.value = "";
};

//ANİMASYON OLUŞTURMA
const showTypingAnimation = () => {
  const html = `
    <div class="chat-content">
          <div class="chat-details">
            <img src="images/chatbot.jpg" alt="" />
            <div class="typing-animation">
              <div class="typing-dot" style="--delay: 0.2s"></div>
              <div class="typing-dot" style="--delay: 0.3s"></div>
              <div class="typing-dot" style="--delay: 0.4s"></div>
            </div>
          </div>
        </div>
    `;
  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);

  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  getChatResponse(incomingChatDiv);
};

//GÖNDERE TIKLAYINCA ÇALIŞTIR
const handleOutGoingChat = () => {
  userText = chatInput.value.trim(); //inputtaki değeri alır ve trim ile boşlukları siler
  if (!userText) return; //input içi boşsa çalışma

  const html = `<div class="chat-content">
    <div class="chat-details">
      <img src="images/user.jpg" alt="" />
      <p></p>
    </div>
  </div>`;

  const outgoingChatDiv = createElement(html, "outgoing");
  document.querySelector(".default-text")?.remove();
  outgoingChatDiv.querySelector("p").textContent = userText;
  chatContainer.appendChild(outgoingChatDiv);
  setTimeout(showTypingAnimation, 500);
};

//ENTER BASINCA İSTEK AT
chatInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();
    handleOutGoingChat();
  }
});

//GÖNDERME BUTONU OLAY İZLEYİCİ
sendButton.addEventListener("click", handleOutGoingChat);

//LIGHT-DARK MODE
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  themeBtn.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";
});

deleteBtn.addEventListener("click", () => {
  if (confirm("Tüm sohbetleri silmek istediğinizden emin misiniz?")) {
    chatContainer.remove();
  }
  const defaultText = `
    <div class="default-text">
    <h1>ChatGPT Clone</h1>
  </div>
  <div class="typing-container">
  <div class="typing-content">
    <div class="typing-textarea">
      <textarea
        id="chat-input"
        placeholder="Enter a propmt here"
        required
      ></textarea>
      <span id="send-btn" class="material-symbols-outlined"> send </span>
    </div>
    <div class="typing-controls">
      <span id="theme-btn" class="material-symbols-outlined">
        light_mode
      </span>
      <span id="delete-btn" class="material-symbols-outlined">
        delete
      </span>
    </div>
  </div>
</div>
    `;
  document.body.innerHTML = defaultText;
});
