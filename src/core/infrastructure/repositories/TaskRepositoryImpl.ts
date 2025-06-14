import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class TaskRepositoryImpl implements ITaskRepository {
  private readonly STORAGE_KEY = '@tasks';

  async getTasks(): Promise<Task[]> {
    try {
      const tasksJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
      throw new Error('Failed to fetch tasks from storage');
    }
  }

  async getTaskById(id: string): Promise<Task | null> {
    try {
      const tasks = await this.getTasks();
      return tasks.find(task => task.id === id) || null;
    } catch (error) {
      throw new Error('Failed to fetch task by id');
    }
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    try {
      const tasks = await this.getTasks();
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify([...tasks, newTask]));
      return newTask;
    } catch (error) {
      throw new Error('Failed to create task');
    }
  }

  async updateTask(id: string, taskUpdate: Partial<Task>): Promise<Task> {
    try {
      const tasks = await this.getTasks();
      const taskIndex = tasks.findIndex(task => task.id === id);
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }
      const updatedTask = {
        ...tasks[taskIndex],
        ...taskUpdate,
        updatedAt: new Date()
      };
      tasks[taskIndex] = updatedTask;
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
      return updatedTask;
    } catch (error) {
      throw new Error('Failed to update task');
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      const tasks = await this.getTasks();
      const filteredTasks = tasks.filter(task => task.id !== id);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredTasks));
    } catch (error) {
      throw new Error('Failed to delete task');
    }
  }
} 