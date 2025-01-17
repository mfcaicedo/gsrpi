import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCiarpSecretaryComponent } from './register-ciarp-secretary.component';

describe('RegisterCiarpSecretaryComponent', () => {
  let component: RegisterCiarpSecretaryComponent;
  let fixture: ComponentFixture<RegisterCiarpSecretaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCiarpSecretaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCiarpSecretaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
