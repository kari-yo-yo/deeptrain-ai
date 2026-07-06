from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

# Tutorial schemas
class TutorialBase(BaseModel):
    title: str
    content: str
    category: str = "basic"
    order_index: int = 0

class TutorialCreate(TutorialBase):
    pass

class TutorialResponse(TutorialBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime

# Term schemas
class TermBase(BaseModel):
    name: str
    category: str = "general"
    short_desc: str
    full_desc: Optional[str] = None

class TermCreate(TermBase):
    pass

class TermResponse(TermBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime

# TrainingMetric schemas
class TrainingMetricBase(BaseModel):
    epoch: Optional[int] = None
    train_loss: Optional[float] = None
    val_loss: Optional[float] = None
    accuracy: Optional[float] = None
    learning_rate: Optional[float] = None

class TrainingMetricCreate(TrainingMetricBase):
    log_id: int

class TrainingMetricResponse(TrainingMetricBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    timestamp: datetime

# CodeSnippet schemas
class CodeSnippetBase(BaseModel):
    title: str = "代码片段"
    language: str = "python"
    code: str

class CodeSnippetCreate(CodeSnippetBase):
    log_id: int

class CodeSnippetResponse(CodeSnippetBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime

# ParsedLog schemas
class ParsedLogBase(BaseModel):
    project_name: str = "未命名项目"
    dataset: str = ""
    model_arch: str = ""
    status: str = "success"
    raw_log: str
    parsed_meta: Dict[str, Any] = {}

class ParsedLogCreate(ParsedLogBase):
    pass

class ParsedLogResponse(ParsedLogBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    metrics: List[TrainingMetricResponse] = []
    code_snippets: List[CodeSnippetResponse] = []

# Log parse request/response
class LogParseRequest(BaseModel):
    raw_log: str

class LogParseResponse(BaseModel):
    meta: Dict[str, Any]
    epochs: List[Dict[str, Any]]
    code_blocks: List[Dict[str, str]]
    errors: List[str]

# Code repo filters
class CodeFilterRequest(BaseModel):
    project_name: Optional[str] = None
    dataset: Optional[str] = None
    model_arch: Optional[str] = None
    status: Optional[str] = None
