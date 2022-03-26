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
  docData,
} from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { Customer } from './customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  collection;
  docRef: DocumentReference<Customer>;

  constructor(private firestore: Firestore) {
    this.collection = collection(this.firestore, 'customers');
  }

  /**
   * Gets all customers
   */
  getAllCustomers(): Observable<Customer[]> {
    const customersQuery = query(this.collection, orderBy('name'));

    return collectionData(customersQuery, { idField: 'id' });
  }

  /**
   * Gets customer by id
   */
  getCustomersById(id: string): Observable<Customer> {
    const docRef = doc(this.collection, id);

    return docData(docRef, { idField: 'id' });
  }
}
