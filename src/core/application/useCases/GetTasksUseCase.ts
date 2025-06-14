import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';

export class GetTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(): Promise<Task[]> {
    try {
      const tasks = await this.taskRepository.getTasks();
      return tasks;
    } catch (error) {
      throw new Error('Failed to fetch tasks');
    }
  }
} 