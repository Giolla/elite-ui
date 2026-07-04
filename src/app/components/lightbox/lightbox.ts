import { Component, ElementRef, effect, input, model, viewChild, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lightbox',
  imports: [MatIconModule],
  templateUrl: './lightbox.html',
  styleUrl: './lightbox.css',
})
export class Lightbox {
  images = input<string[]>([]);
  activeIndex = model<number | null>(null); 

  dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialogRef');

  constructor() {
    effect(() => {
      const index = this.activeIndex();
      const dialog = this.dialogRef()?.nativeElement; 
      
      if (!dialog) return;

      if (index !== null) {
        if (!dialog.open) dialog.showModal();
        
        requestAnimationFrame(() => {
          const targetImg = document.getElementById(`lightbox-img-${index}`);
          targetImg?.scrollIntoView({ block: 'nearest', inline: 'center' });
        });
      } else {
        if (dialog.open) dialog.close();
      }
    });
  }

  next(event?: Event) {
    event?.stopPropagation(); 
    const current = this.activeIndex();
    const total = this.images().length;
    if (current !== null && total > 0) {
       let nextIndex = (current + 1) % total;
      this.activeIndex.set(nextIndex);
    }
  }

  prev(event?: Event) {
    event?.stopPropagation(); 
    const current = this.activeIndex();
    const total = this.images().length;
    if (current !== null && total > 0) {
      let prevIndex = (current - 1 + total) % total;
      this.activeIndex.set(prevIndex);
    }
  }

  close() {
    this.activeIndex.set(null);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardNav(event: KeyboardEvent) {
    if (this.activeIndex() === null) return;

    if (event.key === 'ArrowRight') this.next();
    if (event.key === 'ArrowLeft') this.prev();
    if (event.key === 'Escape') this.close();
  }
}