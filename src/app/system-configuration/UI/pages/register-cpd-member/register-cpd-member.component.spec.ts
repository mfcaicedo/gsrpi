import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCpdMemberComponent } from './register-cpd-member.component';

describe('RegisterCpdMemberComponent', () => {
  let component: RegisterCpdMemberComponent;
  let fixture: ComponentFixture<RegisterCpdMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCpdMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCpdMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
