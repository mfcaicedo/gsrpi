import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListApplicationsComponent } from './list-applications.component';

describe('ListApplicationsComponent', () => {
  let component: ListApplicationsComponent;
  let fixture: ComponentFixture<ListApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListApplicationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
