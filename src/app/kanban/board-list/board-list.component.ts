import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Board } from '../board.model';
import { BoardService } from '../board.service';
import { BoardDialogComponent } from '../dialogs/board-dialog.component';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
})
export class BoardListComponent implements OnInit, OnDestroy {
  boards: Board[];
  boardsSubscription: Subscription;
  constructor(public boardService: BoardService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.boardsSubscription = this.boardService.getUserBoards().subscribe((boards) => {
      this.boards = boards;
      console.warn(this.boards);
    });
  }

  ngOnDestroy(): void {
    this.boardsSubscription?.unsubscribe();
  }

  drop(event: CdkDragDrop<string[]>) {
    // Sort boards in the front-end
    moveItemInArray(this.boards, event.previousIndex, event.currentIndex);

    // Persist the changes in the backend
    this.boardService.sortBoards(this.boards);
  }

  openBoardDialog(): void {
    const dialogRef = this.dialog.open(BoardDialogComponent, {
      width: '400px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.boardService.createBoard({
          title: result,
          priority: this.boards.length,
        });
      }
    });
  }
}
