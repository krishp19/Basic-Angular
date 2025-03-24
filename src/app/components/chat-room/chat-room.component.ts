import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss'
})
export class ChatRoomComponent {
  username: string = 'John Doe';
  friends: { name: string; lastMessage: string; timestamp: string }[] = [
    { name: 'Alice', lastMessage: 'Hey, how are you?', timestamp: '10:30 AM' },
    { name: 'Bob', lastMessage: 'Let’s meet up later!', timestamp: '9:15 AM' },
    { name: 'Charlie', lastMessage: 'See you tomorrow!', timestamp: 'Yesterday' }
  ];
  filteredFriends: { name: string; lastMessage: string; timestamp: string }[] = [];
  searchQuery: string = '';
  selectedFriend: string = 'Alice';
  messages: { text: string; sender: string; timestamp: string; status: string }[] = [
    { text: 'Hey, how are you?', sender: 'Alice', timestamp: '10:30 AM', status: 'read' },
    { text: 'I’m good, thanks! How about you?', sender: 'You', timestamp: '10:32 AM', status: 'delivered' },
    { text: 'Doing great, let’s catch up later!', sender: 'Alice', timestamp: '10:35 AM', status: 'unseen' }
  ];
  newMessage: string = '';

  constructor() {
    this.filteredFriends = [...this.friends];
  }

  searchFriends() {
    if (this.searchQuery.trim()) {
      this.filteredFriends = this.friends.filter(friend =>
        friend.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredFriends = [...this.friends];
    }
  }

  selectFriend(friend: string) {
    this.selectedFriend = friend;
    console.log(`Selected friend: ${friend}`);
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        text: this.newMessage,
        sender: 'You',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered'
      });
      this.newMessage = '';
    }
  }

  addEmoji() {
    console.log('Emoji button clicked');
  }

  uploadFile() {
    console.log('File upload button clicked');
  }

  shareContent() {
    console.log('Share button clicked');
  }
}