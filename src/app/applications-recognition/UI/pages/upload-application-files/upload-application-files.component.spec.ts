import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadApplicationFilesComponent } from './upload-application-files.component';

describe('UploadApplicationFilesComponent', () => {
  let component: UploadApplicationFilesComponent;
  let fixture: ComponentFixture<UploadApplicationFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadApplicationFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadApplicationFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
