from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Tutorial(Base):
    __tablename__ = "tutorials"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(50), default="basic")
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Term(Base):
    __tablename__ = "terms"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    category = Column(String(50), default="general")
    short_desc = Column(String(500), nullable=False)
    full_desc = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class ParsedLog(Base):
    __tablename__ = "parsed_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String(200), default="未命名项目")
    dataset = Column(String(100), default="")
    model_arch = Column(String(100), default="")
    status = Column(String(20), default="success")
    raw_log = Column(Text, nullable=False)
    parsed_meta = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    metrics = relationship("TrainingMetric", back_populates="log", cascade="all, delete-orphan")
    code_snippets = relationship("CodeSnippet", back_populates="log", cascade="all, delete-orphan")

class TrainingMetric(Base):
    __tablename__ = "training_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    log_id = Column(Integer, ForeignKey("parsed_logs.id"), nullable=False)
    epoch = Column(Integer)
    train_loss = Column(Float)
    val_loss = Column(Float)
    accuracy = Column(Float)
    learning_rate = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    log = relationship("ParsedLog", back_populates="metrics")

class CodeSnippet(Base):
    __tablename__ = "code_snippets"
    
    id = Column(Integer, primary_key=True, index=True)
    log_id = Column(Integer, ForeignKey("parsed_logs.id"), nullable=False)
    title = Column(String(200), default="代码片段")
    language = Column(String(50), default="python")
    code = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    log = relationship("ParsedLog", back_populates="code_snippets")
