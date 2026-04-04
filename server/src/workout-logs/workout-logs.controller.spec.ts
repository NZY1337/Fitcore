import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutLogsController } from './workout-logs.controller';

describe('WorkoutLogsController', () => {
  let controller: WorkoutLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutLogsController],
    }).compile();

    controller = module.get<WorkoutLogsController>(WorkoutLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
