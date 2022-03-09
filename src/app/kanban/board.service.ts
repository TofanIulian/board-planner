import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  collection,
  addDoc,
  Firestore,
  DocumentReference,
  deleteDoc,
  doc,
  updateDoc,
  arrayRemove,
  query,
  where,
  orderBy,
  collectionData,
  writeBatch,
} from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { Board, Task, TaskLabelColor } from './board.model';

/**
 * Service to make Board related calls to firebase.
 */
@Injectable({
  providedIn: 'root',
})
export class BoardService {
  collection;
  docRef: DocumentReference<Board>;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.collection = collection(this.firestore, 'boards');
  }

  /**
   * Crates a new board for the current user
   */
  async createBoard(data: Board): Promise<Board> {
    const user = await this.auth.currentUser;

    return await addDoc(this.collection, {
      ...data,
      uid: user.uid,
      tasks: [{ description: 'Hello', label: TaskLabelColor.Yellow }],
    });
  }

  /**
   * Deletes a board
   */
  async deleteBoard(boardId: string): Promise<void> {
    await deleteDoc(doc(this.collection, boardId));
  }

  /**
   * Updates the tasks on board
   */
  async updateTasks(boardId: string, tasks: Task[]): Promise<void> {
    await updateDoc(doc(this.collection, boardId), 'tasks', tasks);
  }

  /**
   * Removes a specific task form the board
   */
  async removeTask(boardId: string, task: Task): Promise<void> {
    await updateDoc(doc(this.collection, boardId), 'tasks', arrayRemove(task));
  }

  /**
   * Gets all boards owned by current user
   */
  getUserBoards(): Observable<Board[]> {
    return authState(this.auth).pipe(
      // https://www.learnrxjs.io/learn-rxjs/operators/transformation/switchmap
      switchMap((user) => {
        if (user) {
          const boardsQuery = query(
            this.collection,
            where('uid', '==', user.uid),
            orderBy('priority')
          );

          return collectionData(boardsQuery, { idField: 'id' });
        } else {
          return of([]);
        }
      })
    );
  }

  /**
   * Run a batch write to change the priority of each board for sorting
   */
  sortBoards(boards: Board[]) {
    const batch = writeBatch(this.firestore);
    const refs = boards.map((b) => doc(this.collection, b.id));
    refs.forEach((ref, idx) => batch.update(ref, { priority: idx }));
    batch.commit();
  }
}
