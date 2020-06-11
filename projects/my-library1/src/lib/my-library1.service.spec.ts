import { TestBed } from '@angular/core/testing';

import { MyLibrary1Service } from './my-library1.service';

describe('MyLibrary1Service', () => {
  let service: MyLibrary1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyLibrary1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
