import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaManagementComponent } from './agenda-management.component';

describe('AgendaManagementComponent', () => {
  let component: AgendaManagementComponent;
  let fixture: ComponentFixture<AgendaManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendaManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
