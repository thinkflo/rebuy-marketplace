import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <header class="bg-[#f5f7f9] border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <a routerLink="/" class="text-xl flex gap-3 items-center font-bold text-gray-900 tracking-tight">
            <svg role="img" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="100" viewBox="0 0 1503.9 573">
              <title>rebuy</title>
              <path fill="#3a4a59" d="m184.2 211.8 19.9-55.8A149 149 0 0 0 0 294.2v138.7h59.2V294.2a89.7 89.7 0 0 1 125-82.4m978.5-55.4v139.7a148.9 148.9 0 1 1-297.7 0V156.4h59.2v139.7a89.8 89.8 0 0 0 179.4 0V156.4zm282.2 0v139.7a89.8 89.8 0 0 1-179.4 0V156.4h-59.2v139.7a149 149 0 0 0 148.8 148.8c32.4 0 64.6-12.2 89.7-33.1v12.4a89.7 89.7 0 0 1-89.7 89.6V573a149 149 0 0 0 148.8-148.8V156.4zm-909.4 4.8a193 193 0 0 1 55.7-42.1V0H532v164.9z"/>
              <path fill="#3a4a59" d="M681 144.6c-42.8 0-83.6 18.3-112 50.4L417.3 357.5a89.7 89.7 0 1 1-16.7-138.4l-67.9 73.7 43.6 40.9L484.7 218l-18.6-20.7a149.8 149.8 0 1 0-2.3 198.4l148.8-159.2a89.8 89.8 0 1 1 1.8 118l-24.6-26.1-41.2 43.9 24.7 26.1A149.8 149.8 0 1 0 681 144.6"/>
            </svg>
            <span>Marketplace</span>
          </a>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
