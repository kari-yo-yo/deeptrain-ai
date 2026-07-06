export const STATIC_TUTORIALS = [
  {
    id: 1,
    title: "AutoDL 平台简介与注册",
    content: "## AutoDL 是什么？\n\nAutoDL 是国内领先的 GPU 云服务器租赁平台，提供按小时计费的 GPU 实例。\n\n### 注册流程\n1. 访问 [AutoDL 官网](https://www.autodl.com)\n2. 点击右上角「注册」按钮\n3. 使用手机号或邮箱完成注册\n4. 实名认证后即可创建实例\n\n### 充值与计费\n- 支持支付宝、微信充值\n- 按小时计费，关机不计费\n- 新用户通常有优惠券",
    category: "basic",
    order_index: 1
  },
  {
    id: 2,
    title: "创建 GPU 实例",
    content: "## 选择实例\n\n1. 登录后点击「算力市场」\n2. 根据需求选择 GPU 型号（推荐 RTX 3090 / A100）\n3. 选择镜像：建议使用 PyTorch 官方镜像\n4. 设置密码或 SSH 密钥\n\n### 推荐配置\n- **入门**：RTX 3060 + 12GB 显存\n- **进阶**：RTX 3090 + 24GB 显存\n- **专业**：A100 + 40GB 显存",
    category: "basic",
    order_index: 2
  },
  {
    id: 3,
    title: "数据上传与数据集准备",
    content: "## 上传方式\n\n### 方式一：JupyterLab 上传\n1. 打开实例的 JupyterLab\n2. 左侧文件浏览器 → 右键 → Upload\n3. 选择本地文件或文件夹\n\n### 方式二：XFTP / FileZilla\n使用 SFTP 协议连接实例，端口 22\n\n### 方式三：OSS 挂载\n阿里云 OSS 或百度云 BOS 直接挂载到实例\n\n## 数据集规范\n- 建议放在 `/root/autodl-tmp/` 目录\n- 图像数据按类别分文件夹存放\n- 使用 `torchvision.datasets.ImageFolder` 可直接读取",
    category: "basic",
    order_index: 3
  },
  {
    id: 4,
    title: "环境配置与依赖安装",
    content: "## 检查现有环境\n\n```bash\npython --version\nnvidia-smi  # 查看 GPU 状态\n```\n\n## 安装依赖\n\n### 使用 conda\n```bash\nconda create -n deeptrain python=3.10\nconda activate deeptrain\n```\n\n### 安装 PyTorch\n```bash\npip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118\n```\n\n### 安装其他常用库\n```bash\npip install numpy matplotlib tensorboard tqdm\n```\n\n### 从 requirements.txt 安装\n```bash\npip install -r requirements.txt\n```",
    category: "basic",
    order_index: 4
  },
  {
    id: 5,
    title: "运行训练代码",
    content: "## 基本命令\n\n```bash\ncd /root/autodl-tmp/your-project\npython train.py\n```\n\n## 后台运行\n使用 `nohup` 或 `screen` 保持训练不中断：\n\n```bash\nnohup python train.py > train.log 2>&1 &\n```\n\n## 查看日志\n```bash\ntail -f train.log\n```\n\n## TensorBoard 可视化\n```bash\ntensorboard --logdir=runs --port=6006\n```\n然后在本地浏览器访问 `<实例公网IP>:6006`",
    category: "basic",
    order_index: 5
  },
  {
    id: 6,
    title: "结果查看与模型下载",
    content: "## 查看训练结果\n\n1. 在 JupyterLab 中直接查看生成的图片\n2. 使用 TensorBoard 查看 loss 曲线\n3. 查看保存的模型文件（通常在 `checkpoints/` 目录）\n\n## 下载模型\n\n### 方式一：JupyterLab 下载\n右键文件 → Download\n\n### 方式二：SFTP 下载\n使用 XFTP / FileZilla 连接下载\n\n### 方式三：OSS 回传\n将模型上传到阿里云 OSS，然后本地下载",
    category: "basic",
    order_index: 6
  }
]

export const STATIC_TERMS = [
  {
    id: 1,
    name: "Loss",
    category: "training",
    short_desc: "损失函数值，衡量模型预测与真实值的差距",
    full_desc: "Loss（损失）是深度学习中最核心的指标之一。它量化了模型预测输出与真实标签之间的差异。训练的目标就是最小化 Loss 值。常见的损失函数包括交叉熵损失（CrossEntropy，用于分类）和均方误差（MSE，用于回归）。Loss 曲线通常应该随训练轮数逐渐下降。"
  },
  {
    id: 2,
    name: "Epoch",
    category: "training",
    short_desc: "完整遍历一遍训练数据集的次数",
    full_desc: "一个 Epoch 表示模型已经看过了训练集中的所有样本一次。例如，如果有 10000 张训练图片，batch size 为 32，那么一个 epoch 包含 10000/32 ≈ 313 个 iteration（迭代）。Epoch 数过少会导致欠拟合，过多可能导致过拟合。"
  },
  {
    id: 3,
    name: "Batch Size",
    category: "training",
    short_desc: "每次参数更新时使用的样本数量",
    full_desc: "Batch Size 指的是每次前向传播和反向传播时同时处理的样本数量。较大的 batch size 可以利用 GPU 并行计算优势，训练更稳定，但需要更多显存。较小的 batch size 引入更多噪声，有助于泛化，但训练速度较慢。常见取值：16、32、64、128、256。"
  },
  {
    id: 4,
    name: "Learning Rate",
    category: "training",
    short_desc: "每次参数更新的步长大小",
    full_desc: "Learning Rate（学习率）控制模型参数在每次更新时的调整幅度。学习率太大可能导致 loss 震荡甚至发散（不收敛），太小则收敛极慢。常用策略：初始学习率 0.001~0.01，配合学习率衰减（Step Decay、Cosine Annealing）。"
  },
  {
    id: 5,
    name: "Accuracy",
    category: "training",
    short_desc: "预测正确的样本占总样本的比例",
    full_desc: "Accuracy（准确率）是最直观的分类指标，计算公式为：正确预测的样本数 / 总样本数。但在类别不平衡的数据集上，Accuracy 可能具有误导性（例如 99% 的样本是负例，模型全部预测为负例也有 99% 准确率）。此时应结合 Precision、Recall、F1-Score 综合评估。"
  },
  {
    id: 6,
    name: "Overfitting",
    category: "training",
    short_desc: "模型在训练集表现很好，但在测试集表现差",
    full_desc: "Overfitting（过拟合）指模型过度记忆了训练数据的细节和噪声，导致泛化能力差。判断方法：训练 loss 持续下降，但验证 loss 开始上升。解决方法：增加数据量、使用数据增强、添加 Dropout、提前停止（Early Stopping）、正则化（L1/L2）。"
  },
  {
    id: 7,
    name: "CNN",
    category: "model",
    short_desc: "卷积神经网络，专门处理图像数据的神经网络架构",
    full_desc: "CNN（Convolutional Neural Network，卷积神经网络）是计算机视觉领域的基础架构。核心组件包括卷积层（提取局部特征）、池化层（降维）、全连接层（分类）。经典模型：LeNet、AlexNet、VGG、ResNet。"
  },
  {
    id: 8,
    name: "Transformer",
    category: "model",
    short_desc: "基于自注意力机制的神经网络架构",
    full_desc: "Transformer 是 2017 年 Google 提出的架构，完全基于 Self-Attention（自注意力）机制，摒弃了 RNN 的序列依赖。最初用于 NLP（BERT、GPT），后来扩展到视觉领域（ViT、DETR）。核心优势：并行计算、长距离依赖建模能力强。"
  },
  {
    id: 9,
    name: "GPU Utilization",
    category: "hardware",
    short_desc: "GPU 计算单元的使用率百分比",
    full_desc: "GPU Utilization（GPU 利用率）表示 GPU 计算核心处于忙碌状态的时间比例。理想情况下应保持在 80% 以上。如果利用率很低（<30%），通常是数据加载瓶颈（CPU 预处理太慢），可通过增加 DataLoader 的 num_workers 或使用 pin_memory 解决。"
  },
  {
    id: 10,
    name: "VRAM",
    category: "hardware",
    short_desc: "显存，GPU 上的专用内存",
    full_desc: "VRAM（Video RAM，显存）是 GPU 上的高速内存，用于存储模型参数、中间特征图、优化器状态等。显存不足（OOM, Out Of Memory）是深度学习训练中最常见的错误。解决方法：减小 batch size、使用梯度累积、启用混合精度训练（AMP）、使用更小的模型。"
  },
  {
    id: 11,
    name: "Data Augmentation",
    category: "data",
    short_desc: "通过对训练数据进行变换来增加数据多样性",
    full_desc: "Data Augmentation（数据增强）通过对原始图像进行随机变换（旋转、翻转、裁剪、颜色抖动等）来生成新的训练样本，从而扩充数据集、减少过拟合。PyTorch 中通过 torchvision.transforms 实现。常用操作：RandomCrop、RandomHorizontalFlip、ColorJitter、Normalize。"
  },
  {
    id: 12,
    name: "Normalization",
    category: "data",
    short_desc: "将数据缩放到标准范围，加速模型收敛",
    full_desc: "Normalization（归一化）将输入数据的均值调整为 0，标准差调整为 1。对于图像数据，通常使用 ImageNet 预训练模型的均值 [0.485, 0.456, 0.406] 和标准差 [0.229, 0.224, 0.225]。归一化能加速收敛、提高训练稳定性。"
  }
]

// Mock data for visualization demo
export const MOCK_LOSS_DATA = [
  { epoch: 1, train_loss: 2.302, val_loss: 2.285 },
  { epoch: 2, train_loss: 1.856, val_loss: 1.902 },
  { epoch: 3, train_loss: 1.523, val_loss: 1.610 },
  { epoch: 4, train_loss: 1.289, val_loss: 1.398 },
  { epoch: 5, train_loss: 1.102, val_loss: 1.234 },
  { epoch: 6, train_loss: 0.956, val_loss: 1.112 },
  { epoch: 7, train_loss: 0.834, val_loss: 1.023 },
  { epoch: 8, train_loss: 0.732, val_loss: 0.956 },
  { epoch: 9, train_loss: 0.645, val_loss: 0.901 },
  { epoch: 10, train_loss: 0.572, val_loss: 0.867 },
  { epoch: 11, train_loss: 0.510, val_loss: 0.845 },
  { epoch: 12, train_loss: 0.456, val_loss: 0.834 },
  { epoch: 13, train_loss: 0.409, val_loss: 0.831 },
  { epoch: 14, train_loss: 0.368, val_loss: 0.838 },
  { epoch: 15, train_loss: 0.332, val_loss: 0.849 },
  { epoch: 16, train_loss: 0.300, val_loss: 0.862 },
  { epoch: 17, train_loss: 0.272, val_loss: 0.878 },
  { epoch: 18, train_loss: 0.248, val_loss: 0.895 },
  { epoch: 19, train_loss: 0.226, val_loss: 0.912 },
  { epoch: 20, train_loss: 0.206, val_loss: 0.931 },
]

export const MOCK_HISTOGRAM = {
  categories: [
    { name: 'Cat', count: 1500 },
    { name: 'Dog', count: 1200 },
    { name: 'Bird', count: 800 },
    { name: 'Fish', count: 600 },
    { name: 'Horse', count: 400 },
    { name: 'Car', count: 350 },
    { name: 'Plane', count: 300 },
    { name: 'Ship', count: 250 },
    { name: 'Truck', count: 200 },
    { name: 'Flower', count: 180 },
  ]
}
