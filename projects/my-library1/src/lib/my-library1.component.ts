import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-my-library1',
  template: `
    <p>
      my-library1 works!
    </p>
  `,
  styles: [
  ]
})
export class MyLibrary1Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
