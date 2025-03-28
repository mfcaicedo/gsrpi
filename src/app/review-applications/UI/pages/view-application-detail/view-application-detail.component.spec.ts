import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApplicationDetailComponent } from './view-application-detail.component';

describe('ViewApplicationDetailComponent', () => {
  let component: ViewApplicationDetailComponent;
  let fixture: ComponentFixture<ViewApplicationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewApplicationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewApplicationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
