import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-friends',
  imports: [NgFor],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss'
})
export class FriendsComponent {
@Input() friends: { name: string; progress: string; avatar: string }[] = [];
}
