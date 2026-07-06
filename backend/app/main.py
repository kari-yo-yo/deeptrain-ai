from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.config import settings
from app.routers import tutorials, glossary, agent, code_repo, visualization, files

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DeepTrain AI API",
    description="深度学习训练助手的后端 API",
    version="0.1.0",
)

# CORS
origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(tutorials.router, prefix="/api/tutorials", tags=["教程中心"])
app.include_router(glossary.router, prefix="/api/glossary", tags=["术语词典"])
app.include_router(agent.router, prefix="/api/agent", tags=["AI Agent"])
app.include_router(code_repo.router, prefix="/api/codes", tags=["代码仓库"])
app.include_router(visualization.router, prefix="/api/viz", tags=["数据可视化"])
app.include_router(files.router, prefix="/api/files", tags=["文件管理"])

@app.get("/")
def root():
    return {"message": "DeepTrain AI API is running", "version": "0.1.0"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
