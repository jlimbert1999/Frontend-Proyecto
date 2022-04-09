import { Injectable } from '@angular/core';
import { observable, Observable } from 'rxjs';
import * as io from 'socket.io-client'
import { entorno } from '../api-config'
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private URL = entorno.baseUrl;
  socket=io.io(this.URL)
  //cuando este servicio se importe en un componente, se conectara


  constructor() {
    // this.socket.on('listar',(resp)=>{
    //   console.log(resp);
    // })
    // this.Emitir().subscribe((resp)=>{
    //   console.log('es',resp);
    // })

  }

  Escuchar(eventName:string) {
    return new Observable((observable) => {
      this.socket.on(eventName,(data:any) => {
        observable.next(data)
      })
    })
    // this.socket.on(eventName, (resp)=>{
    //   console.log(resp);
    // })
  }
  Emitir(eventName:string, data:any) {
    return new Observable((observable) => {
      this.socket.emit(eventName, data, (data: any) => {
        observable.next(data)
      })
    })
    // this.socket.emit(eventName, datos)
  }



}
