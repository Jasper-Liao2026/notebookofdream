import {
    Controller,
    Get
} from '@nestjs/common';

@Controller('todos')
export class TodosController{
  @Get()
  findAll():Todo[]{
    // /todos
    console.log('/todos controller');
    return this.TodosService.findAll();
  }
}