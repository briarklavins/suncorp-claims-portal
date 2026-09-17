import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { UppercaseRegoDirective } from './uppercase-rego.directive';

@Component({
  template: '<input [formControl]="registration" sunUppercaseRego>'
})
class HostComponent {
  registration = new FormControl('');
}

describe('UppercaseRegoDirective', () => {

  let fixture: ComponentFixture<HostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, UppercaseRegoDirective],
      imports: [ReactiveFormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should upper case the registration and strip separators', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = '123-abc';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('123ABC');
    expect(fixture.componentInstance.registration.value).toBe('123ABC');
  });
});
