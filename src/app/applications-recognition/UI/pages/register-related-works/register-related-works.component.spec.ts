import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterRelatedWorksComponent } from './register-related-works.component';

describe('RegisterRelatedWorksComponent', () => {
  let component: RegisterRelatedWorksComponent;
  let fixture: ComponentFixture<RegisterRelatedWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterRelatedWorksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterRelatedWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
