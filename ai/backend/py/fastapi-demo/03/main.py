#及其简单
from fastapi import FastAPI,Path,Query
#注解类型
from typing import Annotated
app = FastAPI()
@app.get("/")
async def root():
    return {"message":"Hello world"}

# @app.get(f"/p/{article_id}")
# async def article_detail(article_id:int):
#     return {"article_id":article_id}

@app.get("/p/{article_id}")
async def article_detail(article_id:Annotated[int,Path(ge=2)]):#ge=2 表示大于等于2
    return {"article_id":article_id}

#http://0.0.0.0:8000/article/list?page=1&page_size=10 
@app.get("/article/list")
async def article_list(page:Annotated[int,Query(ge=1)]=1
,size:Annotated[int,Query(ge=10)]=10):
    return {"page":page,"size":size}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0",port=8000,reload=True)