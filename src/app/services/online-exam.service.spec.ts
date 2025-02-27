import { TestBed } from '@angular/core/testing';

import { OnlineExamService } from './online-exam.service';

describe('OnlineExamService', () => {
  let service: OnlineExamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineExamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
