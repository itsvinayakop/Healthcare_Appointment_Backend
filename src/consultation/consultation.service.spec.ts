import { Test, TestingModule } from '@nestjs/testing';
import { ConsultationService } from './consultation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Consultation } from '../consultation/consultation.entity';
import { Prescription } from '../consultation/prescription.entity';
import { AuditService } from '../common/audit/audit.service';

describe('ConsultationService', () => {
  let service: ConsultationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultationService,
        {
          provide: getRepositoryToken(Consultation),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Prescription),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: AuditService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConsultationService>(ConsultationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
