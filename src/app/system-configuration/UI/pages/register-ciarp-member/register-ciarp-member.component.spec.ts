import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCiarpMemberComponent } from './register-ciarp-member.component';

describe('RegisterCiarpMemberComponent', () => {
  let component: RegisterCiarpMemberComponent;
  let fixture: ComponentFixture<RegisterCiarpMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCiarpMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCiarpMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
