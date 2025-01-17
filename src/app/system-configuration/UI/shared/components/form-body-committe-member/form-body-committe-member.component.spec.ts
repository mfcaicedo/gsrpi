import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBodyCommitteMemberComponent } from './form-body-committe-member.component';

describe('FormBodyCommitteMemberComponent', () => {
  let component: FormBodyCommitteMemberComponent;
  let fixture: ComponentFixture<FormBodyCommitteMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBodyCommitteMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormBodyCommitteMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
