import express from 'express'; // 导入 Express 框架，用于构建 Web 服务器
import cors from 'cors'; // 导入 CORS 中间件，用于处理跨域请求
import OpenAI from 'openai'; // 导入 OpenAI 官方库，用于与 OpenAI API 交互
import { fileURLToPath } from 'url'; // 导入 url 模块的 fileURLToPath 函数，用于将文件 URL 转换为路径
import { dirname, join } from 'path'; // 导入 path 模块的 dirname 和 join 函数，用于处理文件和目录路径

console.log("======================服务器初始化开始======================");

const _filename = fileURLToPath(import.meta.url); // 获取当前文件的路径
const _dirname = dirname(_filename); // 获取当前文件所在目录的路径

console.log(`当前目录路径: ${_dirname}`);

const app = express(); // 创建一个 Express 应用实例
const port = process.env.PORT || 3000; // 定义服务器监听的端口号
console.log(`当前端口号: ${port}`);

app.use(cors()); // 使用 CORS 中间件，允许跨域请求
app.use(express.json()); // 解析 JSON 格式的请求体  

app.use(express.static(join(_dirname, 'public'))); // 提供静态文件服务，指定静态文件目录为 '../dist'

const openai = new OpenAI({
  apiKey: "sk-240df64b5221491dba82836a8238bb50", // 从环境变量中获取 OpenAI API 密钥
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1", // 设置 OpenAI API 的基础 URL
});

console.log("======================服务器初始化完成======================");

// 定义一个 POST 路由，处理 /api/chat 接口的请求
app.post('/api/chat', async (req, res) => {
  console.log("======================服务器开始处理请求======================");
  console.log(`请求参数: ${JSON.stringify(req.body)}`); // 打印请求参数
  try {
    const { messages } = req.body; // 从请求体中获取消息数组
    const completion = await openai.chat.completions.create({
      model: "qwen-plus", // 使用的模型名称
      messages: [
        { role: "system", content: "You are a helpful assistant." }, // 系统消息
        ...messages, // 用户消息
      ], // 消息数组
    });
    console.log("AI调用成功");
    const aiResponse = completion.choices[0].message.content; // 获取 AI 的响应内容
    const aiRole = completion.choices[0].message.role; // 获取 AI 的角色
    console.log(`AI响应内容: ${aiResponse}${aiResponse.substring(0, 50)}`); // 打印 AI 的响应内容
    res.json({
      message: aiResponse, // 返回 AI 的响应内容
      role: aiRole, // 返回 AI 的角色
    });
    console.log("======================服务器处理请求完成======================");

  } catch (error) {
    console.error("AI调用失败", error); // 打印错误信息

  }

});
app.listen(port, () => {
  console.log(`服务器正在监听端口 ${port}`);
  console.log(`地址: http://localhost:${port}`); // 打印服务器地址

});