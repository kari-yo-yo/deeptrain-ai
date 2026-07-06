export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const NAV_ITEMS = [
  { path: '/', label: '总览看板' },
  { path: '/tutorials', label: '教程中心' },
  { path: '/glossary', label: '术语词典' },
  { path: '/agent', label: 'Agent 实验室' },
  { path: '/codes', label: '代码仓库' },
  { path: '/compare', label: '代码对比' },
  { path: '/viz', label: '可视化' },
]

export const TERM_CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'training', label: '训练' },
  { key: 'model', label: '模型' },
  { key: 'data', label: '数据' },
  { key: 'hardware', label: '硬件' },
]

export const MODEL_ARCHITECTURES = [
  'CNN', 'ResNet', 'VGG', 'Transformer', 'BERT', 'GPT', 'YOLO', 'UNet', 'LSTM', 'GRU', '其他'
]

export const DATASETS = [
  'CIFAR-10', 'CIFAR-100', 'MNIST', 'ImageNet', 'COCO', '自定义'
]
