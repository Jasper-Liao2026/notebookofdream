from fastapi import FastAPI 
# BaseModel 校验能力的基类
# Field 模型字段添加额外校验规则，最大值，最小值
from pydantic import BaseModel,Field
from typing import Annotated,List

app = FastAPI()

class Item(BaseModel):
    name:str
    descrpition:str | None = None
    price:float 
    tax:float | None = None

@app.put("/items/{item_id}")
async def update_item(item_id:int,item:Item):
    # Item 实例 转成简单的字典
    # ** 展开字典 
    result= {"item_id":item_id,**item.model_dump()}
    return result

class LoginIn(BaseModel):
    # ... 表示必填字段
    # 参数的格式类型
    email:Annotated[str,Field(...,descrpition="邮箱地址")]
    password:Annotated[str,Field(...,min_length=6,max_length=20,description="密码")]

@app.post('/login')
async def login(data:LoginIn):
    email = data.mail
    password = data.password
    return {"email":email,"password":password}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0",port=8000,reload=True)