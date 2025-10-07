import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenseadragonViewerComponent } from './openseadragon-viewer.component';

describe('OpenseadragonViewerComponent', () => {
  let component: OpenseadragonViewerComponent;
  let fixture: ComponentFixture<OpenseadragonViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenseadragonViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenseadragonViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
