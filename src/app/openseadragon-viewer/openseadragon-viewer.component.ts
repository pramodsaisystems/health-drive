import { Component, AfterViewInit } from '@angular/core';
import OpenSeadragon from 'openseadragon';

@Component({
  selector: 'app-openseadragon-viewer',
  standalone: true,
  imports: [],
  templateUrl: './openseadragon-viewer.component.html',
  styleUrl: './openseadragon-viewer.component.scss'
})
export class OpenseadragonViewerComponent implements AfterViewInit {
  private viewer!: OpenSeadragon.Viewer;

  ngAfterViewInit(): void {
    this.viewer = OpenSeadragon({
      id: 'openseadragon1',
      prefixUrl: 'assets/images/openseadragon/', // for navigation buttons
      tileSources: {
        type: 'image',
        url: 'assets/images/sample-highres.jpg' // path to your high-res image
      },
      showNavigator: true,
      animationTime: 0.5,
      blendTime: 0.1,
      constrainDuringPan: true,
      maxZoomPixelRatio: 2,
      minZoomLevel: 0.5
    });
  }
}
