document.addEventListener('DOMContentLoaded', function () {
  const chartContainer = document.getElementById("chat-messages");// 获取用于显示聊天消息的容器元素

  const userInput = document.getElementById("user-input"); // 获取用户输入消息的输入框元素

  const sendBtn = document.getElementById("send-btn");// 获取发送消息的按钮元素

  let messages = [{
    role: "system",
    content: "你好，我是你的助手。请问有什么我可以帮助你的吗？",
  }];
  //发消息函数
  function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return; // 如果输入为空，则不发送消息{
    userInput.value = ""; // 清空输入框
    userInput.focus();
    appendMessage("user", userMessage); // 显示用户消息
    messages.push({ role: "user", content: userMessage }); // 将用户消息添加到消息数组中
    const loadingDiv = document.createElement("div"); // 创建一个新的 div 元素用于显示加载状态
    loadingDiv.className = "message assistant"; // 设置 div 的类名为 "message assistant"
    loadingDiv.innerHTML = `
    <div class="loading">
      <span></span>
      <span></span>
      <span></span>
    </div>
    `; // 设置加载状态的内容
    chartContainer.appendChild(loadingDiv); // 将加载状态的 div 添加到聊天消息容器中
    chartContainer.scrollTop = chartContainer.scrollHeight; // 滚动到最新消息
    axios.post('/api/chat', {
      messages
    }).then((response) => {
      chartContainer.removeChild(loadingDiv);
      appendMessage("assistant", response.data.message); // 显示 AI 消息
      messages.push({
        role: response.data.role, // 获取 AI 的角色
        content: response.data.message
      }); // 将 AI 消息添加到消息数组中
    });
  }

  function appendMessage(role, content) {
    const messageDiv = document.createElement("div"); // 创建一个新的 div 元素用于显示消息
    messageDiv.className = `message ${role}`; // 设置 div 的类名为 "message" 和角色
    messageDiv.innerHTML = `
        <div class="message-content">${content}</div>
        `; // 设置消息的内容
    chartContainer.appendChild(messageDiv); // 将消息的 div 添加到聊天消息容器中
    chartContainer.scrollTop = chartContainer.scrollHeight; // 滚动到最新消息
  }

  sendBtn.addEventListener("click", sendMessage);

  userInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { // 如果按下回车键且没有按下 Shift 键
      e.preventDefault(); // 阻止默认行为（换行）
      sendMessage(); // 如果按下回车键，则发送消息
    }
  });
  userInput.addEventListener("input", function () {
    this.style.height = "auto"; // 重置高度
    this.style.height = this.scrollHeight < 120 ? this.scrollHeight + 'px' : "120px"; // 设置输入框的高度为内容的高度
  });


});

