import {
  Component,
  QueryList,
  Input,
  HostListener,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ViewRef,
  ComponentRef,
  ChangeDetectorRef
} from "@angular/core";

import { CdlTab } from "./tab.component";

@Component({
  selector: "cdl-tab-headers",
  template: `
    <div [class.is-over-flow]="isOverFlow">
      <button class="left-arrow clear-button" [class.disabled]="disabledLeftArrow" (click)="goLeft()">
        <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
          <style>.st0{fill:#959595}</style>
          <path class="st0" d="M10 11.5L6.4 8 10 4.5l-1-1L4.6 8 9 12.5z"/>
          <path class="st0" d="M8 16c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zM8
          1.2c3.7 0 6.8 3.1 6.8 6.8 0 3.7-3.1 6.8-6.8 6.8S1.2 11.7 1.2 8c0-3.7 3.1-6.8 6.8-6.8z"/>
        </svg>
      </button>
      <ul class="cdl-tab-heading" role="tablist">
        <li *ngFor="let tab of tabs">
          <a href="javascript:void(0)" role="tab" (click)="selectTab(tab)"
            [ngClass]="{'active-tab': tab.active, 'disabled-tab': tab.disabled}">
            <span *ngIf="!tab.headingIsTemplate">{{tab.heading}}</span>
            <template *ngIf="tab.headingIsTemplate" [ngTemplateOutlet]="tab.heading">
            </template>
          </a>
        </li>
      </ul>
      <button class="right-arrow clear-button" [class.disabled]="disabledRightArrow"  (click)="goRight()">
        <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
          <style>.st0{fill:#959595}</style>
          <path class="st0" d="M6 4.5L9.6 8 6 11.5l1 1L11.4 8 7 3.5z"/>
          <path class="st0" d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14.8c-3.7 0-6.8-3.1-6.8-6.8 0-3.7
          3.1-6.8 6.8-6.8s6.8 3.1 6.8 6.8c0 3.7-3.1 6.8-6.8 6.8z"/>
        </svg>
      </button>
    </div>
   `,
  styleUrls: ["./tabs.component.scss"]
})

export class CdlTabHeaders {
  private tabHeading;
  private isOverFlow = false;
  private firstVisibleTab = 0;
  private scrollLength = 0;
  private allTabHeading;
  private disabledRightArrow = false;
  private disabledLeftArrow = true;
  @Input() tabs: QueryList<CdlTab>;

  constructor(private _elementRef: ElementRef, private _viewContainerRef: ViewContainerRef, private _cdr: ChangeDetectorRef) {}

  ngOnInit() {
     this.tabHeading = this._elementRef.nativeElement.querySelector("div ul");
  }

  ngAfterViewInit() {
    if (this.tabHeading.scrollWidth > this.tabHeading.offsetWidth) {
      this.isOverFlow = true;
      this.scrollLength = this.tabHeading.scrollWidth - this.tabHeading.offsetWidth;
      this.allTabHeading = this._elementRef.nativeElement.querySelectorAll("div ul li");
      this._cdr.detectChanges();
    }
  }

  private goLeft() {
    if (this.disabledLeftArrow) {
      return;
    }

    if (this.disabledRightArrow) {
      this.disabledRightArrow = false;
    }

    if (this.firstVisibleTab === 1) {
      this.disabledLeftArrow = true;
    }

    // Substract the width of the tab before the firstVisibleTab
    requestAnimationFrame(() => {
      this.animateScroll(this.allTabHeading[this.firstVisibleTab - 1].offsetWidth, 0, false);
      this.firstVisibleTab--;
    });
  }

  private goRight() {
    if (this.disabledRightArrow) {
      return;
    }

    if (this.disabledLeftArrow) {
      this.disabledLeftArrow = false;
    }

    if (this.tabHeading.scrollLeft + this.allTabHeading[this.firstVisibleTab].offsetWidth >= this.scrollLength) {
      this.disabledRightArrow = true;
    }

    // Add the width of the firstVisibleTab
    requestAnimationFrame(() => {
      this.animateScroll(this.allTabHeading[this.firstVisibleTab].offsetWidth);
      this.firstVisibleTab++;
    });
  }

  private selectTab(tab: CdlTab) {
    if (tab.disabled) {
      return;
    }

    this.tabs.forEach((_tab) => {
      _tab.active = false;
    });

    tab.active = true;
  }

  private animateScroll(scrollWidth, increment = 0, goRight = true) {
    if (scrollWidth <= increment) {
      return;
    }

    let toBeIncrement = Math.floor(scrollWidth / 20);

    increment += toBeIncrement;

    if (goRight) {
      this.tabHeading.scrollLeft += toBeIncrement;
    } else {
      this.tabHeading.scrollLeft -= toBeIncrement;
    }

    requestAnimationFrame(() => {
      this.animateScroll(scrollWidth, increment, goRight);
    });
  }
}