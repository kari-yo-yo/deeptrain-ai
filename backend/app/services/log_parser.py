import re
from typing import Dict, List, Any

class LogParser:
    def __init__(self):
        self.epoch_pattern = re.compile(
            r'Epoch\s*(?:\[?\s*(\d+)\s*\/?\s*(?:\d*)\s*\]?)?'
            r'.*?loss[:\s]*([\d.]+)'
            r'(?:.*?acc(?:uracy)?[:\s]*([\d.]+))?'
            r'(?:.*?lr[:\s]*([\d.e-]+))?',
            re.IGNORECASE
        )
        self.standalone_loss = re.compile(r'(?:train|val|test)?\s*loss[:\s]*([\d.]+)', re.IGNORECASE)
        self.standalone_acc = re.compile(r'(?:train|val|test)?\s*acc(?:uracy)?[:\s]*([\d.]+)', re.IGNORECASE)
        self.lr_pattern = re.compile(r'lr\s*[:=]?\s*([\d.e-]+)', re.IGNORECASE)
        self.epoch_num_pattern = re.compile(r'epoch\s*(?:\[?\s*(\d+)\s*\/?\s*(?:\d*)\s*\]?)?', re.IGNORECASE)
        
        self.code_block_pattern = re.compile(r'```(\w+)?\n(.*?)```', re.DOTALL)
        self.inline_code_pattern = re.compile(r'`([^`]+)`')
        
        self.error_patterns = [
            (re.compile(r'CUDA out of memory', re.IGNORECASE), 'CUDA OOM'),
            (re.compile(r'RuntimeError', re.IGNORECASE), 'Runtime Error'),
            (re.compile(r'KeyboardInterrupt', re.IGNORECASE), 'Interrupted'),
            (re.compile(r'AssertionError', re.IGNORECASE), 'Assertion Failed'),
            (re.compile(r'FileNotFoundError', re.IGNORECASE), 'File Not Found'),
            (re.compile(r'ModuleNotFoundError', re.IGNORECASE), 'Module Not Found'),
            (re.compile(r'OutOfMemoryError', re.IGNORECASE), 'Out of Memory'),
        ]
        
        self.meta_patterns = {
            'gpu': re.compile(r'GPU\s*[:=]?\s*(RTX\s*\d+|A\d+|Tesla\s*\w+|\w+)', re.IGNORECASE),
            'batch_size': re.compile(r'batch[_\s]?size\s*[:=]?\s*(\d+)', re.IGNORECASE),
            'model': re.compile(r'model\s*[:=]?\s*(ResNet\d+|VGG\d+|Transformer|CNN|BERT|GPT|YOLO|UNet|[\w-]+)', re.IGNORECASE),
            'dataset': re.compile(r'dataset\s*[:=]?\s*(CIFAR-?\d*|MNIST|ImageNet|COCO|自定义|[\w-]+)', re.IGNORECASE),
            'optimizer': re.compile(r'optimizer\s*[:=]?\s*(Adam|SGD|RMSprop|AdamW)', re.IGNORECASE),
            'epochs_total': re.compile(r'epochs?\s*[:=]?\s*(\d+)', re.IGNORECASE),
        }

    def parse(self, raw_log: str) -> Dict[str, Any]:
        lines = raw_log.split('\n')
        epochs = []
        current_epoch = {}
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            epoch_match = self.epoch_pattern.search(line)
            if epoch_match:
                epoch_data = {'epoch': None, 'train_loss': None, 'accuracy': None, 'learning_rate': None}
                if epoch_match.group(1):
                    epoch_data['epoch'] = int(epoch_match.group(1))
                if epoch_match.group(2):
                    epoch_data['train_loss'] = float(epoch_match.group(2))
                if epoch_match.group(3):
                    epoch_data['accuracy'] = float(epoch_match.group(3))
                if epoch_match.group(4):
                    epoch_data['learning_rate'] = float(epoch_match.group(4))
                epochs.append(epoch_data)
                current_epoch = epoch_data
            else:
                loss_match = self.standalone_loss.search(line)
                if loss_match and current_epoch:
                    current_epoch['train_loss'] = float(loss_match.group(1))
                
                acc_match = self.standalone_acc.search(line)
                if acc_match and current_epoch:
                    current_epoch['accuracy'] = float(acc_match.group(1))
                
                lr_match = self.lr_pattern.search(line)
                if lr_match and current_epoch:
                    current_epoch['learning_rate'] = float(lr_match.group(1))
                
                epoch_num = self.epoch_num_pattern.search(line)
                if epoch_num and not current_epoch.get('epoch'):
                    current_epoch['epoch'] = int(epoch_num.group(1))
        
        code_blocks = []
        for match in self.code_block_pattern.finditer(raw_log):
            lang = match.group(1) or 'python'
            code = match.group(2).strip()
            if code:
                code_blocks.append({'language': lang, 'code': code})
        
        errors = []
        for pattern, label in self.error_patterns:
            if pattern.search(raw_log):
                match = pattern.search(raw_log)
                line_num = raw_log[:match.start()].count('\n') + 1
                errors.append(f"{label} (line {line_num})")
        
        meta = {'total_lines': len(lines), 'log_size': len(raw_log)}
        for key, pattern in self.meta_patterns.items():
            match = pattern.search(raw_log)
            if match:
                meta[key] = match.group(1)
        
        status = 'failed' if errors else ('success' if epochs else 'unknown')
        
        return {
            'meta': meta,
            'epochs': epochs,
            'code_blocks': code_blocks,
            'errors': errors,
            'status': status,
        }

parser = LogParser()
