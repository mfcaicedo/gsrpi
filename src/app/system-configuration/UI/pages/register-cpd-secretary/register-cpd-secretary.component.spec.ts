import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCpdSecretaryComponent } from './register-cpd-secretary.component';

describe('RegisterCpdSecretaryComponent', () => {
  let component: RegisterCpdSecretaryComponent;
  let fixture: ComponentFixture<RegisterCpdSecretaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCpdSecretaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCpdSecretaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
