/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private _storage: Storage | null = null;
  private sessionSubject: Subject<any> = new Subject<any>();
  private session: any = {};
  private persistentSession: any = {};
  private user: any = {};
  private userSubject: Subject<any> = new Subject<any>();

  constructor(private storage: Storage) {
    this.init().then(() => {
      this._storage.get(`persistentSession`).then((session) => {
        this.persistentSession = session || {};
        this.mergePersistentSession();
        this.notifySessionUpdated();
      });
      // this._storage.get(`user`).then((user) => {
      //   console.log(`SessionService.init() user from storage`, user);
      //   this.user = JSON.parse(JSON.stringify(user));
      //   this.notifyUserUpdated();
      // });
    });
  }

  public getSession(): any {
    return this.session;
  }

  public getSessionAsObservable(): Observable<any> {
    return this.sessionSubject.asObservable();
  }

  public async setPersistent(key: string, value: any) {
    this.persistentSession[key] = value;
    await this._storage?.set(`persistentSession`, this.persistentSession);
    this.mergePersistentSession();
    this.notifySessionUpdated();
  }

  public set(key: string, value: any) {
    this.session[key] = value;
    this.notifySessionUpdated();
  }

  public get(key: string): any {
    return this.session[key];
  }

  public getUser(): any {
    return this.user;
  }

  public getUserAsObservable(): Observable<any> {
    return this.userSubject.asObservable();
  }

  public async updateUser(user: any) {
    console.log(`SessionService.updateUser()`);
    const newUser: any = JSON.parse(JSON.stringify(user));
    // await this._storage?.set(`user`, newUser);
    this.user = newUser;
    this.notifyUserUpdated();
  }

  private async init() {
    console.log(`SessionService.init()`);
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    this._storage = await this.storage.create();
  }

  private notifySessionUpdated(): void {
    this.sessionSubject.next(this.session);
  }

  private mergePersistentSession() {
    Object.keys(this.persistentSession).forEach(key => this.session[key] = this.persistentSession[key]);
  }

  private notifyUserUpdated(): void {
    console.log(`SessionService.notifyUserUpdated()`);
    this.userSubject.next(this.user);
  }
}
