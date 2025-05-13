import { Component } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  currentStatus: 'in' | 'out' | 'none' = 'none';
  entryTime: string | null = null;
  exitTime: string | null = null;

  constructor() {
    // Simular datos de ejemplo
    this.entryTime = '08:30';
    this.currentStatus = 'in';
  }

  registerEntry() {
    const now = new Date();
    this.entryTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.currentStatus = 'in';
  }

  registerExit() {
    const now = new Date();
    this.exitTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.currentStatus = 'out';
  }

  calculateWorkedHours(): string {
    if (!this.entryTime || !this.exitTime) return '--:--';
    
    const [entryHours, entryMinutes] = this.entryTime.split(':').map(Number);
    const [exitHours, exitMinutes] = this.exitTime.split(':').map(Number);
    
    let totalMinutes = (exitHours * 60 + exitMinutes) - (entryHours * 60 + entryMinutes);
    
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}

